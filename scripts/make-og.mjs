// Social share images (1200x630) into public/og/: one per design (back and
// front of the hero garment side by side) and one for the home page (a row of
// backs). Re-run after adding a design or regenerating mockups:
//   node scripts/make-og.mjs
import fs from "node:fs/promises";
import path from "node:path";
import sharp from "sharp";

const W = 1200;
const H = 630;
const BG = { r: 28, g: 26, b: 23 };
const out = path.resolve("public/og");
await fs.mkdir(out, { recursive: true });

const files = await fs.readdir("public/products");
const backs = files.filter((f) => f.endsWith("-hoodie-black-back.png") || f.endsWith("-hoodie-charcoal-back.png") || f.endsWith("-hoodie-cream-back.png"));

const glow = Buffer.from(
  `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}"><defs><radialGradient id="g" cx="50%" cy="45%" r="60%"><stop offset="0" stop-color="#E8DFC8" stop-opacity="0.10"/><stop offset="1" stop-color="#1C1A17" stop-opacity="0"/></radialGradient></defs><rect width="100%" height="100%" fill="url(#g)"/></svg>`,
);

async function fit(file, size) {
  return sharp(path.join("public/products", file)).resize(size, size, { fit: "contain", background: { r: 0, g: 0, b: 0, alpha: 0 } }).png().toBuffer();
}

for (const back of backs) {
  const slug = back.replace(/-hoodie-(black|charcoal|cream)-back\.png$/, "");
  const front = back.replace("-back.png", "-front.png");
  const layers = [{ input: glow, left: 0, top: 0 }, { input: await fit(back, 600), left: 20, top: 15 }];
  if (files.includes(front)) layers.push({ input: await fit(front, 600), left: 580, top: 15 });
  await sharp({ create: { width: W, height: H, channels: 3, background: BG } })
    .composite(layers)
    .jpeg({ quality: 82, mozjpeg: true })
    .toFile(path.join(out, `${slug}.jpg`));
  console.log("og", slug);
}

const row = backs.filter((f) => !f.includes("-cream-")).slice(0, 5);
const step = 230;
const layers = [{ input: glow, left: 0, top: 0 }];
for (const [i, f] of row.entries()) layers.push({ input: await fit(f, 380), left: Math.round((W - step * (row.length - 1) - 380) / 2 + i * step), top: 125 });
await sharp({ create: { width: W, height: H, channels: 3, background: BG } }).composite(layers).jpeg({ quality: 82, mozjpeg: true }).toFile(path.join(out, "home.jpg"));
console.log("og home");
