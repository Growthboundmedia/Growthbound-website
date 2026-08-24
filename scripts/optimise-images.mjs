#!/usr/bin/env node
/**
 * optimise-images.mjs — compress every photo and build responsive derivatives.
 *
 * Runs as part of `npm run build`, BEFORE astro build, because the manifest it
 * writes is read at build time by components/Photo.astro.
 *
 * WHY: photos live in public/, so Astro's own image pipeline never touches them
 * (astro:assets only optimises what is imported from src/assets). The Walkom
 * demo shipped a 679KB band photo and a 4.2MB asset folder straight to a phone
 * on Newcastle 4G. The design is photo-carried, so this is not a nice-to-have:
 * a hero that arrives late is a hero nobody saw.
 *
 * DESIGN NOTE — nothing is overwritten. The client's originals stay exactly as
 * they are in public/assets/. Every derivative lands in public/assets/opt/, and
 * public/assets/opt/manifest.json records what exists. Photo.astro falls back to
 * the plain original whenever a file has no manifest entry, so a site that never
 * ran this script still builds and still renders. Optimisation degrades, it does
 * not break.
 *
 * Re-runs are cheap: a derivative newer than its source is left alone.
 */
import { readdir, readFile, writeFile, mkdir, stat } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import path from 'node:path';

const ROOT = process.cwd();
const SRC_DIR = path.join(ROOT, 'public/assets');
const OUT_DIR = path.join(SRC_DIR, 'opt');
const MANIFEST = path.join(OUT_DIR, 'manifest.json');

// The four that matter: phone, phone-retina/tablet, laptop, desktop-retina.
// Never upscale past the original, so a small source just gets fewer entries.
const WIDTHS = [480, 800, 1280, 1920];
const JPEG_Q = 78;   // visually clean on photos of building work at these sizes
const WEBP_Q = 74;   // webp holds up lower than jpeg at the same perceived quality

if (!existsSync(SRC_DIR)) {
  console.log('optimise-images: no public/assets, nothing to do');
  process.exit(0);
}

let sharp;
try {
  ({ default: sharp } = await import('sharp'));
} catch {
  // Not fatal. A build must never fail because an optimiser is missing; it just
  // ships the originals, which is exactly what it did before this script existed.
  console.warn(
    'optimise-images: sharp not installed, shipping originals uncompressed.\n' +
    '                 Run `npm install` (sharp is a devDependency) to fix.'
  );
  process.exit(0);
}

await mkdir(OUT_DIR, { recursive: true });

const files = (await readdir(SRC_DIR, { withFileTypes: true }))
  .filter((d) => d.isFile() && /\.(jpe?g|png)$/i.test(d.name))
  .map((d) => d.name);

const manifest = {};
let savedBytes = 0;
let built = 0;

for (const name of files) {
  const srcPath = path.join(SRC_DIR, name);
  const base = name.replace(/\.(jpe?g|png)$/i, '');
  const srcStat = await stat(srcPath);
  const meta = await sharp(srcPath).metadata();
  const srcWidth = meta.width ?? 0;
  if (!srcWidth) continue;

  // A logo or a tiny mark gains nothing from four derivatives and loses crispness
  // in webp. Leave anything under the smallest breakpoint alone.
  if (srcWidth < WIDTHS[0]) continue;

  // Transparency means it is a logo or a mark, not a photograph. A jpeg
  // derivative would flatten the alpha onto black and Photo.astro's fallback
  // <img> would render a logo in a box. Leave them alone; they are small anyway.
  if (meta.hasAlpha) {
    console.log(`optimise-images: skipping ${name} (has transparency, treated as a mark)`);
    continue;
  }

  const widths = WIDTHS.filter((w) => w <= srcWidth);
  if (widths.length === 0 || widths[widths.length - 1] !== srcWidth) {
    // Always include a full-size derivative so the largest srcset entry is not
    // a downscale of a photo the client supplied at exactly 1000px.
    if (srcWidth < WIDTHS[WIDTHS.length - 1]) widths.push(srcWidth);
  }

  const entry = { width: srcWidth, height: meta.height ?? 0, jpg: [], webp: [] };

  for (const w of widths) {
    for (const [fmt, list] of [['jpg', entry.jpg], ['webp', entry.webp]]) {
      const outName = `${base}-${w}.${fmt}`;
      const outPath = path.join(OUT_DIR, outName);
      let outStat = existsSync(outPath) ? await stat(outPath) : null;

      if (!outStat || outStat.mtimeMs < srcStat.mtimeMs) {
        const pipe = sharp(srcPath).resize(w, null, { withoutEnlargement: true });
        const buf =
          fmt === 'webp'
            ? await pipe.webp({ quality: WEBP_Q }).toBuffer()
            : await pipe.jpeg({ quality: JPEG_Q, mozjpeg: true, progressive: true }).toBuffer();
        await writeFile(outPath, buf);
        outStat = await stat(outPath);
        built++;
      }
      list.push({ w, file: `opt/${outName}`, bytes: outStat.size });
    }
  }

  // Rough saving: what a phone would have downloaded before (the original) vs
  // what it downloads now (the 800px webp).
  const phone = entry.webp.find((d) => d.w >= 800) ?? entry.webp[entry.webp.length - 1];
  if (phone) savedBytes += Math.max(0, srcStat.size - phone.bytes);

  manifest[name] = entry;
}

await writeFile(MANIFEST, JSON.stringify(manifest, null, 2));

const mb = (n) => `${(n / 1024 / 1024).toFixed(2)}MB`;
console.log(
  `optimise-images: ${Object.keys(manifest).length} photos, ${built} derivatives built, ` +
  `~${mb(savedBytes)} less over the wire on a phone`
);
