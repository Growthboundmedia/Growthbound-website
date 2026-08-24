// Prefixes a site-absolute path with Astro's configured `base`.
//
// At a domain root (base "/") this returns the path unchanged, so the same
// source builds correctly for the client's real domain and for a demo served
// from a subfolder like demo.growthbound.media/<slug>/.
//
// Idempotent: an already-prefixed path is returned as-is, because some paths
// (project photos, ogImage) are prefixed at the data layer and then passed
// through Base.astro, which prefixes again.
//
// DO NOT EDIT. scripts/deploy-demo.sh refuses to build a site without this file,
// and rejects the deploy if any built href/src still points at the domain root.

const BASE = (import.meta.env.BASE_URL ?? '/').replace(/\/+$/, '');

export function url(path: string): string {
  // Leave external, protocol-relative, tel:, mailto: and relative paths alone.
  if (!path.startsWith('/') || path.startsWith('//')) return path;
  if (!BASE) return path;
  if (path === BASE || path.startsWith(`${BASE}/`)) return path;
  return `${BASE}${path}`;
}
