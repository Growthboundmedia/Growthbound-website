import { defineConfig } from 'astro/config';

// growthbound.media is the real domain and this site IS indexable, unlike every
// demo under demo.growthbound.media. `site` builds the canonical URLs and the
// sitemap. Never set `base` here.
export default defineConfig({
  site: 'https://growthbound.media',
  build: { format: 'directory' },
});
