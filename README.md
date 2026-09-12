# Growthbound Media — growthbound.media

The business's own site. Astro, static output, deployed to Netlify.

This replaced a hand-written single-page site (plain HTML/CSS/JS, no build step).
That version is still in git history if it is ever needed; nothing from it is
live any more, and its files were removed rather than left shadowed by the new
ones.

## Running it

```bash
npm install
npm run dev        # http://localhost:4321
npm run build      # optimises images, then builds to dist/
npm run favicons   # regenerates the icon set from the accent colour
```

`npm run build` runs `scripts/optimise-images.mjs` first, which writes resized
webp/jpg derivatives into `public/assets/opt/` and a manifest that
`components/Photo.astro` reads. Both are generated and gitignored.

## Structure

```
src/
  pages/           one file per route, plus sitemap.xml.ts
  layouts/Base.astro    <head>, schema, nav, footer, analytics slot
  components/      Photo, ContactForm, BuildSheet, Nav, Footer, ...
  data/            site.ts, work.ts, faqs.ts, process.ts  <- all copy and facts
  styles/          tokens.css, global.css
  lib/             url.ts, schema.ts, photos.ts, form-ux.ts
public/            static files copied as-is (favicons, robots.txt, assets)
```

## Rules this site is built on

- **`src/styles/tokens.css` is the only file allowed a hex value.** Everything
  else references tokens, which is why a whole palette swap is one file. See
  `PALETTES.md` for the current palette and two alternatives on branches.
- **Every number on this site traces to a source.** `src/data/site.ts` carries
  the pricing and the Satori proof figures with the date they were measured.
  Nothing goes on the page that is not in there.
- **No em dashes or en dashes in visitor-facing copy.**
- **`noindex` belongs on `/404` and `/thanks` only.** Everything else is meant
  to be found.
- Contrast is computed, never estimated. AA minimum, and the measured ratio for
  every pair is recorded in `tokens.css` and `PALETTES.md`.

## Deploying

Netlify builds this repo directly. Production branch is `main`, and
`allowed_branches` is `main` only, so pushing any other branch is free and does
not deploy. `netlify.toml` overrides the dashboard: build command, publish
directory, security headers, cache headers and the redirects for the URLs the
old site used (`/demo/*`, `/pitch`, `/landing`).

A push to `main` deploys. To roll back, revert the commit and push, or roll the
deploy back in the Netlify UI.

## The contact form

Netlify Forms, named `enquiry`, detected from the built HTML at deploy time. It
posts to `/thanks` rather than Netlify's own receipt page. A site-level
`submission_created` notification emails daniel@growthbound.media; without it,
submissions sit in the dashboard unseen.
