import fs from "node:fs";
import path from "node:path";

// Server-only helpers that check what artwork files exist under /public.
// Cached per process so catalogue pages don't hit the disk on every render.
const cache = new Map<string, boolean>();

function exists(publicPath: string): boolean {
  const hit = cache.get(publicPath);
  if (hit !== undefined) return hit;
  let ok = false;
  try {
    ok = fs.existsSync(path.join(process.cwd(), "public", publicPath));
  } catch {
    ok = false;
  }
  cache.set(publicPath, ok);
  return ok;
}

/** Does the Printful garment mockup PNG for this garment exist? */
export function artExists(image: string): boolean {
  return exists(image);
}

export type Artwork = {
  /** Transparent, print-ready file (from scripts/prepare-artwork.mjs) */
  print: string | null;
  /** The raw design as delivered, background baked in */
  raw: string | null;
};

/** The design files for a product, if the owner has dropped them in public/artwork. */
export function artworkFor(slug: string): Artwork {
  const print = `/artwork/print/${slug}.png`;
  const raw = `/artwork/${slug}.png`;
  return { print: exists(print) ? print : null, raw: exists(raw) ? raw : null };
}

export function artworkMap(slugs: string[]): Record<string, Artwork> {
  return Object.fromEntries(slugs.map((s) => [s, artworkFor(s)]));
}
