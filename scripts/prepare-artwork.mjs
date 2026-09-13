// Turns the raw design PNGs in public/artwork/ (baked black or cream
// background) into print-ready transparent PNGs in public/artwork/print/.
// The site composites these onto garment colours, and the Printful mockup
// script uploads them as the print file.
//
//   node scripts/prepare-artwork.mjs            # all designs
//   node scripts/prepare-artwork.mjs blue-moon-inn
//
// Dark backgrounds: alpha = brightness, colour un-premultiplied against black.
// Light backgrounds: alpha = darkness relative to the sampled background.

import fs from "node:fs/promises";
import path from "node:path";
import { createRequire } from "node:module";

const require = createRequire(import.meta.url);
const sharp = require("sharp");

const SRC = path.resolve("public/artwork");
const OUT = path.join(SRC, "print");
await fs.mkdir(OUT, { recursive: true });

const only = process.argv.slice(2);
const files = (await fs.readdir(SRC)).filter((f) => f.endsWith(".png") && (only.length === 0 || only.includes(f.replace(/\.png$/, ""))));

for (const file of files) {
  const slug = file.replace(/\.png$/, "");
  const { data, info } = await sharp(path.join(SRC, file)).removeAlpha().raw().toBuffer({ resolveWithObject: true });
  const { width, height } = info;

  // Sample the background from a border ring, 4px in.
  const bg = [0, 0, 0];
  let n = 0;
  const sample = (x, y) => {
    const i = (y * width + x) * 3;
    bg[0] += data[i];
    bg[1] += data[i + 1];
    bg[2] += data[i + 2];
    n++;
  };
  for (let x = 0; x < width; x += 8) {
    sample(x, 4);
    sample(x, height - 5);
  }
  for (let y = 0; y < height; y += 8) {
    sample(4, y);
    sample(width - 5, y);
  }
  bg[0] /= n;
  bg[1] /= n;
  bg[2] /= n;
  const dark = (bg[0] + bg[1] + bg[2]) / 3 < 80;

  const out = Buffer.alloc(width * height * 4);
  for (let p = 0, q = 0; p < data.length; p += 3, q += 4) {
    const r = data[p];
    const g = data[p + 1];
    const b = data[p + 2];
    let a;
    let ir;
    let ig;
    let ib;
    if (dark) {
      a = Math.max(r, g, b) / 255;
      if (a < 0.05) a = 0;
      ir = a ? Math.min(255, r / a) : 0;
      ig = a ? Math.min(255, g / a) : 0;
      ib = a ? Math.min(255, b / a) : 0;
    } else {
      a = Math.max((bg[0] - r) / bg[0], (bg[1] - g) / bg[1], (bg[2] - b) / bg[2]);
      a = Math.min(1, Math.max(0, a));
      if (a < 0.06) a = 0;
      ir = a ? Math.min(255, Math.max(0, (r - (1 - a) * bg[0]) / a)) : 0;
      ig = a ? Math.min(255, Math.max(0, (g - (1 - a) * bg[1]) / a)) : 0;
      ib = a ? Math.min(255, Math.max(0, (b - (1 - a) * bg[2]) / a)) : 0;
    }
    out[q] = ir;
    out[q + 1] = ig;
    out[q + 2] = ib;
    out[q + 3] = Math.round(a * 255);
  }

  const dest = path.join(OUT, `${slug}.png`);
  const result = await sharp(out, { raw: { width, height, channels: 4 } })
    .trim({ threshold: 8 })
    .png({ compressionLevel: 9 })
    .toFile(dest);
  console.log(`${slug.padEnd(44)} ${dark ? "dark" : "light"} bg -> ${result.width}x${result.height}`);
}
