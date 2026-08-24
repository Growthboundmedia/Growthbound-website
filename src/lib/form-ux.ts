// Client-side validation and submit states for the quote form.
//
// WHY NOT JUST NATIVE `required`: the browser's own bubble is one field at a
// time, it disappears on the next click, and on iOS it is easy to miss entirely.
// A tradie's form gets filled on a phone with one thumb. If it fails silently
// the lead is gone and nobody ever knows.
//
// PROGRESSIVE ENHANCEMENT: `novalidate` is set HERE, in JS, not in the markup.
// With JS off the browser's own validation still runs, so the form never becomes
// less strict than it was. Nothing here changes what gets POSTed.
//
// Used by any form with `data-validate`. QuoteForm has it. A bespoke build's
// form (e.g. Walkom's QualifyForm) just needs the same attribute.

type Field = HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement;

// Spaces, brackets and dashes are stripped before this runs, so "+61 412 345 678",
// "(02) 4960 9894" and "0412-345-678" all pass. Only the digit shape is checked.
const AU_PHONE = /^(\+?61|0)[2-478]\d{8}$/;
const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

// Reads the label as a possessive so the message is a sentence, not a slot fill.
// "Phone" -> "your phone". "Your name" -> "your name" (unchanged).
function possessive(label: string): string {
  return /^(your|the|a|an)\b/.test(label) ? label : `your ${label}`;
}

// Plain, human messages. No "This field is required."
//
// A field can override its line with data-msg when the generic one reads badly.
// A SELECT never interpolates its label: "Pick one so what are you building is
// clear" is what that produces, and it is not a sentence anyone would say.
function messageFor(el: Field): string | null {
  const value = el.value.trim();
  const label = el.dataset.label || el.getAttribute('name') || 'this';
  const type = el.getAttribute('type');

  if (el.hasAttribute('required') && !value) {
    if (el.dataset.msg) return el.dataset.msg;
    if (el.tagName === 'SELECT') return 'Pick one from the list.';
    if (type === 'tel') return 'We need a phone number to get back to you.';
    if (type === 'email') return 'We need an email address to get back to you.';
    return `We need ${possessive(label)} to get back to you.`;
  }
  if (!value) return null;

  if (type === 'email' && !EMAIL.test(value)) {
    return "That email address doesn't look right. Check the @ and the bit after it.";
  }
  if (type === 'tel' && !AU_PHONE.test(value.replace(/[\s()\-]/g, ''))) {
    return 'That phone number doesn\u2019t look like an Australian one. Mobile or landline is fine.';
  }
  return null;
}

function errorNode(el: Field): HTMLElement {
  const id = `${el.id || el.getAttribute('name')}-err`;
  let node = document.getElementById(id);
  if (!node) {
    node = document.createElement('p');
    node.id = id;
    node.className = 'field-err';
    node.setAttribute('role', 'alert');
    // After the field itself, or after its wrapper when the field is in a grid cell.
    el.insertAdjacentElement('afterend', node);
  }
  return node;
}

function setError(el: Field, msg: string | null) {
  const node = errorNode(el);
  if (msg) {
    node.textContent = msg;
    node.classList.add('on');
    el.classList.add('invalid');
    el.setAttribute('aria-invalid', 'true');
    el.setAttribute('aria-describedby', node.id);
  } else {
    node.textContent = '';
    node.classList.remove('on');
    el.classList.remove('invalid');
    el.removeAttribute('aria-invalid');
    el.removeAttribute('aria-describedby');
  }
}

function enhance(form: HTMLFormElement) {
  form.noValidate = true;

  const fields = Array.from(
    form.querySelectorAll<Field>('input, select, textarea')
  ).filter((el) => el.type !== 'hidden' && el.name !== 'bot-field');

  // Label text drives the message, so the copy stays in the markup where it
  // belongs and never goes stale against a renamed field.
  fields.forEach((el) => {
    if (!el.dataset.label && el.id) {
      const lbl = form.querySelector(`label[for="${el.id}"]`);
      if (lbl?.textContent) el.dataset.label = lbl.textContent.trim().toLowerCase().replace(/[?:]$/, '');
    }
    // Only nag about a field the person has already had a go at.
    el.addEventListener('blur', () => { if (el.dataset.touched) setError(el, messageFor(el)); });
    el.addEventListener('input', () => {
      el.dataset.touched = '1';
      if (el.classList.contains('invalid')) setError(el, messageFor(el));
    });
    el.addEventListener('change', () => { el.dataset.touched = '1'; setError(el, messageFor(el)); });
  });

  const summary = form.querySelector<HTMLElement>('[data-form-summary]');
  const button = form.querySelector<HTMLButtonElement>('button[type="submit"]');
  const buttonText = button?.textContent ?? '';

  form.addEventListener('submit', (e) => {
    const bad: Field[] = [];
    fields.forEach((el) => {
      el.dataset.touched = '1';
      const msg = messageFor(el);
      setError(el, msg);
      if (msg) bad.push(el);
    });

    if (bad.length) {
      e.preventDefault();
      if (summary) {
        summary.textContent =
          bad.length === 1
            ? 'One field needs fixing before this can send.'
            : `${bad.length} fields need fixing before this can send.`;
        summary.classList.add('on');
      }
      bad[0].focus();
      bad[0].scrollIntoView({ block: 'center', behavior: 'smooth' });
      return;
    }

    if (summary) summary.classList.remove('on');

    // Double-tap on a slow connection posts the lead twice and the client rings
    // the same person about the same job. Lock it after the first tap.
    if (button) {
      button.disabled = true;
      button.classList.add('sending');
      button.textContent = 'Sending…';
      // If the POST fails and the browser stays put, give the form back rather
      // than leaving a dead button on screen.
      window.setTimeout(() => {
        button.disabled = false;
        button.classList.remove('sending');
        button.textContent = buttonText;
      }, 12000);
    }
  });
}

export function initForms(root: ParentNode = document) {
  root.querySelectorAll<HTMLFormElement>('form[data-validate]').forEach(enhance);
}
