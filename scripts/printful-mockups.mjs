// Generates garment mockups with Printful's Mockup Generator and saves them
// as public/products/<slug>-<garment>-<colour>.png, which the site picks up
// automatically (see src/lib/art.ts).
//
//   PRINTFUL_API_KEY=... ARTWORK_BASE_URL=https://backwhen.com/artwork/print \
//     node scripts/printful-mockups.mjs [slug ...]
//
//   node scripts/printful-mockups.mjs --list "as colour"   # find catalog product ids
//
// Printful downloads the print file from ARTWORK_BASE_URL/<slug>.png, so the
// files in public/artwork/print/ must be reachable on the public internet
// (deploy the site first, or host them anywhere public). Mockup tasks are
// rate-limited to roughly two per minute; 12 garments takes ~6 minutes.
//
// Env overrides (defaults are AS Colour, which Printful fulfils from Australia):
//   PRINTFUL_HOODIE_PRODUCT="AS Colour 5101"  PRINTFUL_TEE_PRODUCT="AS Colour 5082"
//   Or give catalog ids directly: PRINTFUL_HOODIE_ID=123 PRINTFUL_TEE_ID=456

import fs from "node:fs/promises";
import path from "node:path";
import { pathToFileURL } from "node:url";

const key = process.env.PRINTFUL_API_KEY;
if (!key) {
  console.error("Set PRINTFUL_API_KEY");
  process.exit(1);
}
const headers = { Authorization: `Bearer ${key}`, "Content-Type": "application/json" };
if (process.env.PRINTFUL_STORE_ID) headers["X-PF-Store-Id"] = process.env.PRINTFUL_STORE_ID;

const BASE = "https://api.printful.com";
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

async function api(method, p, body) {
  for (let attempt = 0; attempt < 6; attempt++) {
    const res = await fetch(`${BASE}${p}`, { method, headers, body: body ? JSON.stringify(body) : undefined });
    const json = await res.json().catch(() => null);
    if (res.status === 429) {
      const wait = Number(res.headers.get("retry-after") ?? 30) * 1000;
      console.log(`  rate limited, waiting ${wait / 1000}s`);
      await sleep(wait);
      continue;
    }
    if (!res.ok) throw new Error(`${method} ${p}: ${res.status} ${JSON.stringify(json?.error ?? json?.result ?? json)}`);
    return json.result;
  }
  throw new Error(`${method} ${p}: gave up after repeated 429s`);
}

// ---------------------------------------------------------------- catalog

async function findProduct(idEnv, nameEnv, fallbackName) {
  if (process.env[idEnv]) return api("GET", `/products/${process.env[idEnv]}`);
  const wanted = (process.env[nameEnv] ?? fallbackName).toLowerCase();
  const all = await api("GET", "/products");
  const hit = all.find((p) => `${p.brand} ${p.model} ${p.title}`.toLowerCase().includes(wanted));
  if (!hit) throw new Error(`No catalog product matching "${wanted}". Run with --list to search.`);
  return api("GET", `/products/${hit.id}`);
}

const COLOUR_NAMES = {
  black: ["black"],
  charcoal: ["coal", "charcoal", "dark heather", "asphalt"],
  cream: ["bone", "ecru", "natural", "cream", "sand", "oatmeal"],
};

// "Faded Black" (AS Colour 5082) counts as black, "Grey Marle" stays distinct.
const normaliseColour = (c) => (c ?? "").toLowerCase().replace(/^faded /, "").trim();

function pickVariant(product, colourSlug) {
  const names = COLOUR_NAMES[colourSlug] ?? [colourSlug];
  const variants = product.variants.filter((v) => names.includes(normaliseColour(v.color)));
  if (variants.length === 0) {
    const available = [...new Set(product.variants.map((v) => v.color))].join(", ");
    throw new Error(`${product.product.title}: no colour matching ${names.join("/")}. Available: ${available}`);
  }
  return variants.find((v) => /^(L|Large)$/i.test(v.size)) ?? variants[0];
}

// ---------------------------------------------------------------- placement

function pngSize(buf) {
  if (buf.readUInt32BE(0) !== 0x89504e47) throw new Error("not a PNG");
  return { width: buf.readUInt32BE(16), height: buf.readUInt32BE(20) };
}

const printfileCache = new Map();
async function printfileFor(productId, variantId) {
  if (!printfileCache.has(productId)) printfileCache.set(productId, await api("GET", `/mockup-generator/printfiles/${productId}`));
  const info = printfileCache.get(productId);
  const vp = info.variant_printfiles.find((v) => v.variant_id === variantId);
  const pfId = vp?.placements?.front ?? Object.values(vp?.placements ?? {})[0];
  const pf = info.printfiles.find((f) => f.printfile_id === pfId);
  if (!pf) throw new Error(`No front printfile for variant ${variantId}`);
  return pf;
}

// Fit the design to a chest print: ~80% of the print width, a little below the top.
function positionFor(pf, img) {
  const scale = Math.min((pf.width * 0.8) / img.width, (pf.height * 0.9) / img.height);
  const width = Math.round(img.width * scale);
  const height = Math.round(img.height * scale);
  return {
    area_width: pf.width,
    area_height: pf.height,
    width,
    height,
    left: Math.round((pf.width - width) / 2),
    top: Math.round(pf.height * 0.05),
  };
}

// ---------------------------------------------------------------- main

if (process.argv[2] === "--list") {
  const q = (process.argv[3] ?? "").toLowerCase();
  const all = await api("GET", "/products");
  for (const p of all) {
    const line = `${String(p.id).padEnd(6)} ${p.brand ?? ""} ${p.model} — ${p.title}`;
    if (!q || line.toLowerCase().includes(q)) console.log(line);
  }
  process.exit(0);
}

const baseUrl = (process.env.ARTWORK_BASE_URL ?? "").replace(/\/$/, "");
if (!baseUrl.startsWith("http")) {
  console.error("Set ARTWORK_BASE_URL to the public URL of public/artwork/print (e.g. https://backwhen.com/artwork/print)");
  process.exit(1);
}

const { products } = await import(pathToFileURL(path.resolve("src/lib/products.ts")).href).catch(async () => {
  // products.ts is TypeScript; strip the types with a tiny transform when run under plain node.
  const src = await fs.readFile(path.resolve("src/lib/products.ts"), "utf8");
  const js = src
    .replace(/^export type[\s\S]*?^};?$/gm, "")
    .replace(/: Record<string, number \| null>/g, "")
    .replace(/\): [A-Za-z<>\[\] |]+ \{/g, ") {")
    .replace(/ satisfies [^;]+;/g, ";")
    .replace(/\b(\w+): (string|number|Colour|Garment|Product)\b(\[\])?/g, "$1")
    .replace(/export type [^=]+= [^;]+;/g, "");
  const tmp = path.resolve(".printful-products.tmp.mjs");
  await fs.writeFile(tmp, js);
  const mod = await import(pathToFileURL(tmp).href);
  await fs.unlink(tmp);
  return mod;
});

const only = process.argv.slice(2);
const wanted = products.filter((p) => only.length === 0 || only.includes(p.slug));

const printDir = path.resolve("public/artwork/print");
const outDir = path.resolve("public/products");
await fs.mkdir(outDir, { recursive: true });

const hoodie = await findProduct("PRINTFUL_HOODIE_ID", "PRINTFUL_HOODIE_PRODUCT", "as colour 5101");
const tee = await findProduct("PRINTFUL_TEE_ID", "PRINTFUL_TEE_PRODUCT", "as colour 5082");
console.log(`Hoodie: ${hoodie.product.title} (#${hoodie.product.id})`);
console.log(`Tee:    ${tee.product.title} (#${tee.product.id})`);

for (const product of wanted) {
  const printFile = path.join(printDir, `${product.slug}.png`);
  try {
    await fs.access(printFile);
  } catch {
    console.log(`\n${product.slug}: no print file in public/artwork/print — run scripts/prepare-artwork.mjs first. Skipped.`);
    continue;
  }
  const imageUrl = `${baseUrl}/${product.slug}.png`;
  const img = pngSize(await fs.readFile(printFile));

  for (const g of product.garments) {
    const dest = path.join(outDir, `${product.slug}-${g.type}-${g.colour.slug}.png`);
    try {
      await fs.access(dest);
      console.log(`\n${path.basename(dest)} exists, skipped (delete it to regenerate)`);
      continue;
    } catch {}

    const catalog = g.type === "hoodie" ? hoodie : tee;
    const variant = pickVariant(catalog, g.colour.slug);
    console.log(`\n${product.name} — ${g.type}, ${g.colour.name} → variant ${variant.id} (${variant.color} / ${variant.size})`);

    const pf = await printfileFor(catalog.product.id, variant.id);
    const task = await api("POST", `/mockup-generator/create-task/${catalog.product.id}`, {
      variant_ids: [variant.id],
      format: "png",
      files: [{ placement: "front", image_url: imageUrl, position: positionFor(pf, img) }],
    });

    let result;
    for (let i = 0; i < 40; i++) {
      await sleep(8000);
      result = await api("GET", `/mockup-generator/task?task_key=${encodeURIComponent(task.task_key)}`);
      if (result.status === "completed") break;
      if (result.status === "failed") throw new Error(`Mockup failed: ${result.error}`);
      process.stdout.write(".");
    }
    if (!result || result.status !== "completed") throw new Error("Timed out waiting for mockup");

    const mock = result.mockups.find((m) => m.placement === "front") ?? result.mockups[0];
    const res = await fetch(mock.mockup_url);
    await fs.writeFile(dest, Buffer.from(await res.arrayBuffer()));
    console.log(`  saved ${path.relative(process.cwd(), dest)}`);
    for (const extra of mock.extra ?? []) console.log(`  also available: ${extra.title} ${extra.url}`);

    // Mockup Generator allows ~2 tasks a minute.
    await sleep(25000);
  }
}
console.log("\nDone. Reload the site; mockups replace the generated mock-ups automatically.");
