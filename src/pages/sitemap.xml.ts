// The sitemap, built from the filesystem rather than a hand-written list.
//
// A hand-written list is how a sitemap ends up submitting a page that no longer
// exists: the Bracken build shipped one naming /about on a site with no about
// page, so Google was handed a 404 on purpose. Globbing the pages directory
// means a page cannot be in the sitemap unless it is really there, and a new
// page is in it the moment it is created.
//
// /404 and /thanks are the only two noindex pages on the site, so they are the
// only two excluded. Keep this list in step with the `noindex` prop in Base.astro.
import type { APIRoute } from 'astro';
import { site } from '../data/site';

const EXCLUDE = ['/index', '/404', '/thanks', '/sitemap.xml'];

const paths = Object.keys(import.meta.glob('./*.astro', { eager: false }))
  .map((f) => f.replace(/^\.\/(.*)\.astro$/, '/$1'))
  .filter((p) => !EXCLUDE.includes(p))
  .sort();

// The homepage first, then every other page, each as a directory URL to match
// build.format: 'directory' and the canonical Base.astro emits.
const urls = ['/', ...paths.map((p) => `${p}/`)];

export const GET: APIRoute = () => {
  const body = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.map((u) => `  <url><loc>${site.url}${u}</loc></url>`).join('\n')}
</urlset>
`;
  return new Response(body, {
    headers: { 'Content-Type': 'application/xml; charset=utf-8' },
  });
};
