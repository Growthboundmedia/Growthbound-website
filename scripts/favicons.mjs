#!/usr/bin/env node
/**
 * favicons.mjs — generate the whole icon set for THIS client.
 *
 *   node scripts/favicons.mjs          # run from inside sites/<slug>/
 *
 * WHY THIS EXISTS: the template used to ship one hand-written favicon.svg with
 * Hammond's forest green and a hard-coded letter H. Every site copied from the
 * template inherited it, so the Walkom demo sat in Chris's browser tab wearing
 * another builder's initial. Nobody notices until the client does.
 *
 * Inputs, in priority order, all read from the site itself so there is nothing
 * to pass in and nothing to keep in sync:
 *   1. public/assets/favicon-source.png  a square mark the client gave us
 *   2. public/assets/logo.png            used ONLY if it is roughly square.
 *                                        A wide wordmark makes an illegible
 *                                        16px icon, so it is rejected on aspect
 *                                        ratio rather than shipped unreadable.
 *   3. site.monogram on the accent       the fallback, and a good one.
 *
 * Colour comes from --accent in src/styles/accent.css and --on-accent in
 * src/styles/theme.css. Never hard-code it here: accent.css is the single source
 * of truth for a client's colour and this script must follow it, not fork it.
 *
 * Outputs into public/:
 *   favicon.svg          crisp at any size, what modern browsers use
 *   favicon.ico          32px, the legacy + crawler fallback (Google fetches it)
 *   apple-touch-icon.png 180px, iOS home screen. Must be PNG, must be opaque.
 *   favicon-32.png       explicit raster fallback
 *   favicon-192.png      Android / PWA install
 *
 * It also rewrites `themeColor` in src/data/site.ts so the mobile browser chrome
 * matches the accent without anyone remembering to edit two files.
 */
import { readFile, writeFile } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import path from 'node:path';

const ROOT = process.cwd();
const p = (...a) => path.join(ROOT, ...a);

const fail = (m) => { console.error(`favicons: ${m}`); process.exit(1); };

// ---- read the accent ------------------------------------------------------
const readVar = async (file, name) => {
  if (!existsSync(file)) return null;
  const m = (await readFile(file, 'utf8')).match(
    new RegExp(`^\\s*${name}\\s*:\\s*(#[0-9a-fA-F]{3,8})`, 'm')
  );
  return m ? m[1] : null;
};

// --accent lives in accent.css on every site built from the current template.
// A LEGACY site (hammond predates the accent split) keeps its brand colour in
// global.css under its own name, so probe rather than fail. An explicit
// `--accent #RRGGBB` on the command line beats all of it.
const argAccent = (() => {
  const i = process.argv.indexOf('--accent');
  return i > -1 ? process.argv[i + 1] : null;
})();

const PROBES = [
  ['src/styles/accent.css', '--accent'],
  ['src/styles/global.css', '--accent'],
  ['src/styles/global.css', '--green'],   // hammond's legacy token name
  ['src/styles/global.css', '--brand'],
];

let accent = argAccent;
let accentFrom = argAccent ? 'command line' : null;
if (!accent) {
  for (const [file, name] of PROBES) {
    const v = await readVar(p(file), name);
    if (v) { accent = v; accentFrom = `${file} ${name}`; break; }
  }
}
if (!accent) {
  fail(
    'could not find a brand colour.\n' +
    '          Looked for --accent in src/styles/accent.css and global.css, and\n' +
    '          --green / --brand in global.css. Pass one explicitly:\n' +
    '            node scripts/favicons.mjs --accent "#2C6A50"'
  );
}

const onAccent =
  (await readVar(p('src/styles/theme.css'), '--on-accent')) ??
  (await readVar(p('src/styles/global.css'), '--on-accent')) ??
  (await readVar(p('src/styles/global.css'), '--bone')) ??
  '#F6EFE1';

// ---- read the monogram ----------------------------------------------------
const siteTsPath = p('src/data/site.ts');
if (!existsSync(siteTsPath)) fail('no src/data/site.ts. Run this from inside sites/<slug>/.');
const siteTs = await readFile(siteTsPath, 'utf8');
const monogram = (siteTs.match(/^\s*monogram:\s*'([^']+)'/m)?.[1] ?? '?').slice(0, 2);

// ---- pick the source ------------------------------------------------------
let sharp = null;
try {
  ({ default: sharp } = await import('sharp'));
} catch {
  console.warn(
    'favicons: sharp not installed, writing favicon.svg only.\n' +
    '          Run `npm install` in this site (sharp is a devDependency of the\n' +
    '          template) and re-run, or iOS gets no apple-touch-icon.'
  );
}

const candidates = ['public/assets/favicon-source.png', 'public/assets/logo.png'];
let source = null;
// A mark that is already a finished, opaque tile (a cut-out logo square, its own
// background included) gets used FULL BLEED. Padding it at 74% onto the accent
// would print a green square inside a green square with a visible seam.
// A transparent mark is padded, because it has no background of its own.
let fullBleed = false;
if (sharp) {
  for (const rel of candidates) {
    const f = p(rel);
    if (!existsSync(f)) continue;
    const { width = 0, height = 0, hasAlpha } = await sharp(f).metadata();
    const aspect = width && height ? Math.max(width, height) / Math.min(width, height) : 99;
    if (rel.includes('favicon-source') || aspect <= 1.3) {
      source = f;
      // hasAlpha is only a hint (a fully opaque PNG can still carry an alpha
      // channel), so check the actual corner pixel.
      const corner = await sharp(f).extract({ left: 0, top: 0, width: 1, height: 1 })
        .ensureAlpha().raw().toBuffer();
      fullBleed = !hasAlpha || corner[3] > 250;
      break;
    }
    console.log(`favicons: skipping ${rel} (${width}x${height}, too wide for a 16px icon)`);
  }
}

// ---- SVG ------------------------------------------------------------------
// The icon modern browsers actually use, and the only one that stays sharp on a
// retina tab strip.
const fontSize = monogram.length > 1 ? 13 : 19;
const monogramSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" role="img" aria-label="${monogram}">
  <rect width="32" height="32" rx="3" fill="${accent}"/>
  <text x="16" y="22" font-family="Inter,Helvetica,Arial,sans-serif" font-size="${fontSize}" font-weight="800"
        text-anchor="middle" fill="${onAccent}">${monogram}</text>
</svg>
`;

// When the client has a real mark, the SVG must carry the MARK, not the
// monogram. Shipping a monogram svg alongside a mark png means the browser tab
// and the iOS home screen show two different logos for the same business, and
// the svg wins in the tab, which is the one people see.
let svg = monogramSvg;
if (sharp && source) {
  const embedded = await sharp(source).resize(256, 256, { fit: fullBleed ? 'cover' : 'contain',
    background: fullBleed ? undefined : { r: 0, g: 0, b: 0, alpha: 0 } }).png().toBuffer();
  svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" role="img" aria-label="${monogram}">
  <rect width="32" height="32" rx="3" fill="${accent}"/>
  <image x="${fullBleed ? 0 : 4}" y="${fullBleed ? 0 : 4}" width="${fullBleed ? 32 : 24}" height="${fullBleed ? 32 : 24}"
         href="data:image/png;base64,${embedded.toString('base64')}"/>
</svg>
`;
}
await writeFile(p('public/favicon.svg'), svg);

// ---- rasters --------------------------------------------------------------
if (sharp) {
  // A logo mark gets padded onto the accent rather than pasted edge to edge, so
  // it still reads once the browser rounds the corners.
  const render = async (size) => {
    if (source && fullBleed) {
      // Already a finished tile. Straight resize, opaque, no padding.
      return sharp(source).resize(size, size, { fit: 'cover' }).flatten({ background: accent }).png().toBuffer();
    }
    if (source) {
      const inner = Math.round(size * 0.74);
      const mark = await sharp(source)
        .resize(inner, inner, { fit: 'contain', background: { r: 0, g: 0, b: 0, alpha: 0 } })
        .png()
        .toBuffer();
      return sharp({
        create: { width: size, height: size, channels: 4, background: accent },
      })
        .composite([{ input: mark, gravity: 'centre' }])
        .png()
        .toBuffer();
    }
    // No usable mark: rasterise the monogram SVG. Opaque, because iOS composites
    // a transparent apple-touch-icon onto black and the accent disappears.
    return sharp(Buffer.from(monogramSvg))
      .resize(size, size)
      .flatten({ background: accent })
      .png()
      .toBuffer();
  };

  const png32 = await render(32);
  await writeFile(p('public/favicon-32.png'), png32);
  await writeFile(p('public/favicon-192.png'), await render(192));
  await writeFile(p('public/apple-touch-icon.png'), await render(180));

  // ICO, hand-built. sharp cannot write .ico, and an ICO is allowed to carry a
  // PNG payload verbatim (Vista onward), so this is a 22-byte header in front of
  // the 32px PNG we already have. Cheap, and it means Google's favicon crawler
  // and any legacy resolver both get something.
  const header = Buffer.alloc(22);
  header.writeUInt16LE(0, 0);            // reserved
  header.writeUInt16LE(1, 2);            // type: icon
  header.writeUInt16LE(1, 4);            // one image
  header.writeUInt8(32, 6);              // width
  header.writeUInt8(32, 7);              // height
  header.writeUInt8(0, 8);               // palette: none
  header.writeUInt8(0, 9);               // reserved
  header.writeUInt16LE(1, 10);           // colour planes
  header.writeUInt16LE(32, 12);          // bits per pixel
  header.writeUInt32LE(png32.length, 14);
  header.writeUInt32LE(22, 18);          // offset to the payload
  await writeFile(p('public/favicon.ico'), Buffer.concat([header, png32]));
}

// ---- keep themeColor honest ----------------------------------------------
const updated = siteTs.replace(/^(\s*themeColor:\s*)'#[0-9a-fA-F]{3,8}'/m, `$1'${accent}'`);
if (updated !== siteTs) {
  await writeFile(siteTsPath, updated);
} else if (!/themeColor:/.test(siteTs)) {
  console.warn('favicons: no themeColor field in src/data/site.ts, skipped. Add it from the template.');
}

console.log(
  `favicons: ${accent} (from ${accentFrom}) + ` +
  (source ? `${path.relative(ROOT, source)}${fullBleed ? ' (full bleed)' : ' (padded on accent)'}` : `monogram "${monogram}"`) +
  ' -> ' + (sharp ? 'svg, ico, 32, 192, apple-touch' : 'svg only')
);
