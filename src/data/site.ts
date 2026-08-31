// Growthbound's own site. Unlike a client build there is no clients/*.json
// behind this: every fact here is Daniel's, checked against a source, and
// nothing on this site may state anything that is not in this file.
//
// FACT DISCIPLINE. This site is indexable and carries the business's own
// claims, so a number without a source does not go on it. Where a figure is
// measured, the measurement and its date are written next to it.

export const site = {
  // ---- identity ----
  name: 'Growthbound',
  legalName: 'Growthbound Media',
  owner: 'Daniel',
  tagline: 'Websites for builders and trades, out of Newcastle.',

  // ---- contact ----
  phoneDisplay: '0491 145 688',
  phoneHref: '+61491145688',
  email: 'daniel@growthbound.media',
  base: 'Newcastle, NSW',
  region: 'Newcastle and the Hunter',
  serviceArea: ['Newcastle', 'Lake Macquarie', 'Maitland', 'Port Stephens', 'the Hunter'],

  // ---- site ----
  url: 'https://growthbound.media',
  themeColor: '#F0A82C',
  geo: { lat: -32.9283, lng: 151.7817 },   // Newcastle NSW

  // ---- analytics ----
  // Plausible is the default on every live site (cookieless, so /privacy stays
  // short). Empty until Daniel creates the property; Base.astro emits nothing
  // while it is blank rather than shipping a broken script tag.
  analyticsDomain: '',
  // Ad pixels are a SEPARATE decision and a separate slot. CLAUDE.md.
  adPixels: '',

  // What the contact form actually collects, field for field. /privacy quotes
  // this list, so the two can never drift apart. If a field is added to
  // ContactForm.astro it goes here in the same commit.
  formCollects: [
    'your name',
    'your business name',
    'your phone number',
    'your email address',
    'your trade',
    'what you have online at the moment',
    'what you are after',
    'anything else you type into the message box',
  ],

  // This is the real business site, not a demo. Nothing here is noindexed
  // except /404 and /thanks.
  isDemo: false,
} as const;

// ---------------------------------------------------------------------------
// PRICING
//
// $4,000 is the standard build. The 50/50 split is not a payment detail, it is
// the offer: it is what removes the risk for a builder who has been burned by a
// web person before, so it leads rather than sits in small print.
//
// "From" and the scope line beneath exist so nothing on this site can ever
// contradict a bigger quote after a proper look. GROWTHBOUND-PLAYBOOK.md:
// never discount, but never box yourself in either.
// ---------------------------------------------------------------------------
export const pricing = {
  build: {
    label: 'The build',
    amount: '$4,000',
    qualifier: 'standard build',
    terms: 'Half to start. Half when you are happy.',
    scopeNote:
      'Bigger scope, more pages, migrations and custom work quoted properly after a look.',

    // The payment plan. Same $4,000, no interest and no premium: 1500 + (250 x 10)
    // is exactly 4000, and the arithmetic has to stay exactly that, because the
    // moment a plan totals more than the price it is a finance product and has to
    // be described as one.
    //
    // The deposit is the risk filter, not a formality. It is what makes the plan
    // safe to offer: it covers the work up front and a client who has put $1,500
    // in does not walk. /terms quotes this object, so the offer on the pricing
    // page and the mechanics in the terms can never drift apart.
    plan: {
      deposit: '$1,500',
      monthly: '$250',
      months: 'ten',
      line: '$1,500 to start, then $250 a month for ten months.',
      note: 'Same $4,000, no interest. Hosting is $90 a month on top, same as always.',
    },

    includes: [
      'Custom design and build, not a template',
      'A gallery of your actual jobs',
      'Every service and every area you cover, on its own page',
      'Reviews and proof built in',
      'Quote form that asks the questions you need answered',
      'One-tap calling on a phone',
      'Built to rank: titles, schema, local SEO done properly on day one',
      'Fast, and built for a phone first',
    ],
  },
  hosting: {
    label: 'Hosting and security',
    amount: '$90',
    per: '/month',
    terms: 'Starts when the site goes live.',
    body:
      'Hosting, SSL, backups and security patching. The site has to live somewhere and stay up, so this one is not optional. Everything after it is.',
    includes: [
      'Fast hosting and SSL',
      'Backups and security patching',
      'Uptime monitoring',
      'Small text fixes when you need them',
    ],
  },
  growth: {
    label: 'Growth',
    amount: '$750',
    per: '/month',
    terms: 'Month to month. No lock-in.',
    body:
      'For when the site is up and you want it working harder. Replaces the $90, it does not stack on top.',
    includes: [
      'Everything in hosting and security',
      'SEO kept sharp over time, not set and forgotten',
      'GEO, so AI tools like ChatGPT know who you are',
      'New jobs added to the gallery as you finish them',
      'Every edit you need, handled, no hourly billing',
      'What is working, reported plainly',
    ],
  },
  partner: {
    label: 'Growth Partner',
    amount: 'Tailored',
    terms: 'Quoted after a proper look at the business.',
    body:
      'The whole funnel, not just the site. Organic posting, paid ads on Google and Meta, email nurture and retargeting, all run for you. For builders who want winning work on autopilot while they stay on the tools.',
    includes: [
      'Everything in Growth',
      'Organic posting, written and scheduled for you',
      'Paid ads on Google and Meta, run and managed',
      'Email nurture so a lead does not go cold',
      'Retargeting the people who already looked',
      'We work out what it is worth before either of us commits',
    ],
  },
} as const;

// ---------------------------------------------------------------------------
// PROOF — Satori Muay Thai.
//
// The one live client with measurable results, and the only numbers on this
// site. Every figure below traces to a screenshot taken 24 August 2026:
//
//   Framer Analytics, 30 days, 25 Jul to 24 Aug 2026
//     768 unique visitors, 2K pageviews (Framer rounds, so "around 2,000")
//     352 from google.com  ->  45.8%, which is "just under half", not "half"
//     /timetable 384, /packages 260
//     bounce 44.1%, average session 2m51s
//   Google SERP, 24 Aug 2026: #2 organic for "muay thai Newcastle"
//
// "A month" and never "every month": this is ONE measured 30-day window.
// Re-pull the screenshots before changing any number here.
// ---------------------------------------------------------------------------
export const proof = {
  client: 'Satori Muay Thai',
  clientUrl: 'https://www.smtgym.com',
  clientLabel: 'Muay Thai gym, Newcastle CBD',
  measured: '25 July to 24 August 2026',
  headline: '#2 on Google for "muay thai Newcastle"',
  stats: [
    { figure: '768', unit: 'visitors a month', note: 'Just under half of them straight off Google search.' },
    { figure: '~2,000', unit: 'page views a month', note: 'From one local gym, in one city.' },
    { figure: '260', unit: 'checked the prices', note: 'Every month, without ever ringing the desk.' },
    { figure: '2m51s', unit: 'average visit', note: 'They land and they actually read it.' },
  ],
} as const;

export type Stat = (typeof proof.stats)[number];
