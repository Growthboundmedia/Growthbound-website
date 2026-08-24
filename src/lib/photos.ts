// Reads the derivative manifest written by scripts/optimise-images.mjs.
//
// Node fs, not a JSON import: the manifest is generated, so on a fresh clone it
// does not exist yet and a static `import ... from '...json'` would fail the
// whole build at resolve time rather than falling back. Read at module scope so
// it is parsed once per build, not once per <Photo>.
import { readFileSync, existsSync } from 'node:fs';
import { fileURLToPath } from 'node:url';

export type Derivative = { w: number; file: string; bytes?: number };
export type PhotoEntry = {
  width: number;
  height: number;
  jpg: Derivative[];
  webp: Derivative[];
};

const MANIFEST = fileURLToPath(new URL('../../public/assets/opt/manifest.json', import.meta.url));

let cache: Record<string, PhotoEntry> | null = null;

export function photoManifest(): Record<string, PhotoEntry> {
  if (cache) return cache;
  try {
    cache = existsSync(MANIFEST) ? JSON.parse(readFileSync(MANIFEST, 'utf8')) : {};
  } catch {
    cache = {};
  }
  return cache!;
}

// Keyed on the bare filename, so it does not matter whether the path arrived
// already prefixed by url() at the data layer.
export function photoFor(src: string): PhotoEntry | undefined {
  return photoManifest()[src.split('/').pop() ?? ''];
}
