// Generates garment mockups with Printful's Mockup Generator and saves them
// as public/products/<slug>-<garment>-<colour>-back.png (the big design) and
// -front.png (the left-chest crest), which the site picks up automatically
// (see src/lib/art.ts).
//
//   PRINTFUL_API_KEY=... ARTWORK_BASE_URL=https://backwhen.com/artwork/print \
//     node scripts/printful-mockups.mjs [slug ...]
//
//   node scripts/printful-mockups.mjs --list "as colour"   # find catalog product ids
//
// Printful downloads the print files from ARTWORK_BASE_URL/<slug>.png (back)
// and ARTWORK_BASE_URL/crest/<slug>.png (front), so the files in
// public/artwork/print/ must be reachable on the public internet
// (deploy the site first, or host them anywhere public). Mockup tasks are
// rate-limited to roughly two per minute; 12 garments takes ~6 minutes.
//
// Env overrides (defaults are AS Colour, which Printful fulfils from Australia):
//   PRINTFUL_HOODIE_PRODUCT="AS Colour 5101"  PRINTFUL_TEE_PRODUCT="AS Colour 5082"
//   Or give catalog ids directly: PRINTFUL_HOODIE_ID=123 PRINTFUL_TEE_ID=456

import fs from "node:fs/promises";
import { createHash } from "node:crypto";
import path from "node:path";
import { pathToFileURL } from "node:url";
import { backPosition, crestPosition } from "./lib/placement.mjs";

const key = process.env.PRINTFUL_API_KEY;
if (!key) {
  console.error("Set PRINTFUL_API_KEY");
  process.exit(1);
}
const headers = { Authorization: `Bearer ${key}`, "Content-Type": "application/json" };
if (process.env.PRINTFUL_STORE_ID) headers["X-PF-Store-Id"] = process.env.PRINTFUL_STORE_ID;

const BASE = "https://api.printful.com";
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

// Printful caches downloaded files by URL, so a replaced design at the same
// address would silently keep the old artwork. Tag the URL with the file hash.
async function versioned(url, localPath) {
  const hash = createHash("md5").update(await fs.readFile(localPath)).digest("hex").slice(0, 10);
  return `${url}?v=${hash}`;
}

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
async function printfileFor(productId, variantId, placement) {
  if (!printfileCache.has(productId)) printfileCache.set(productId, await api("GET", `/mockup-generator/printfiles/${productId}`));
  const info = printfileCache.get(productId);
  const vp = info.variant_printfiles.find((v) => v.variant_id === variantId);
  const pfId = vp?.placements?.[placement];
  const pf = info.printfiles.find((f) => f.printfile_id === pfId);
  if (!pf) throw new Error(`No ${placement} printfile for variant ${variantId}`);
  return pf;
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
  const backFile = path.join(printDir, `${product.slug}.png`);
  const crestFile = path.join(printDir, "crest", `${product.slug}.png`);
  try {
    await fs.access(backFile);
  } catch {
    console.log(`\n${product.slug}: no print file in public/artwork/print — run scripts/prepare-artwork.mjs first. Skipped.`);
    continue;
  }
  const hasCrest = await fs.access(crestFile).then(() => true, () => false);
  if (!hasCrest) console.log(`\n${product.slug}: no crest in public/artwork/print/crest — front will be blank.`);
  const backUrl = await versioned(`${baseUrl}/${product.slug}.png`, backFile);
  const backImg = pngSize(await fs.readFile(backFile));
  const crestUrl = hasCrest ? await versioned(`${baseUrl}/crest/${product.slug}.png`, crestFile) : null;
  const crestImg = hasCrest ? pngSize(await fs.readFile(crestFile)) : null;

  for (const g of product.garments) {
    const stem = path.join(outDir, `${product.slug}-${g.type}-${g.colour.slug}`);
    const dests = { back: `${stem}-back.png`, front: `${stem}-front.png` };
    const missing = [];
    for (const [placement, dest] of Object.entries(dests)) {
      if (placement === "front" && !hasCrest) continue;
      await fs.access(dest).then(() => console.log(`\n${path.basename(dest)} exists, skipped (delete it to regenerate)`), () => missing.push(placement));
    }
    if (missing.length === 0) continue;

    const catalog = g.type === "hoodie" ? hoodie : tee;
    const variant = pickVariant(catalog, g.colour.slug);
    console.log(`\n${product.name} — ${g.type}, ${g.colour.name} → variant ${variant.id} (${variant.color} / ${variant.size}): ${missing.join(" + ")}`);

    const files = [];
    if (missing.includes("back")) {
      const pf = await printfileFor(catalog.product.id, variant.id, "back");
      files.push({ placement: "back", image_url: backUrl, position: backPosition(pf, backImg) });
    }
    if (missing.includes("front")) {
      const pf = await printfileFor(catalog.product.id, variant.id, "front");
      files.push({ placement: "front", image_url: crestUrl, position: crestPosition(pf, crestImg) });
    }
    const task = await api("POST", `/mockup-generator/create-task/${catalog.product.id}`, {
      variant_ids: [variant.id],
      format: "png",
      files,
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

    // One task with both placements returns the same main image (the back)
    // on every entry, with the other angles under `extra` — so pick by the
    // view name in the file name rather than by entry.
    const views = result.mockups.flatMap((m) => [{ title: m.placement, url: m.mockup_url }, ...(m.extra ?? []).map((e) => ({ title: e.title, url: e.url }))]);
    for (const placement of missing) {
      const view = views.find((v) => new RegExp(`-${placement}-[0-9a-f]+\\.png$`, "i").test(v.url)) ?? views.find((v) => v.title.toLowerCase() === placement);
      if (!view) {
        console.log(`  no ${placement} view came back (${views.map((v) => v.title).join(", ")})`);
        continue;
      }
      const res = await fetch(view.url);
      await fs.writeFile(dests[placement], Buffer.from(await res.arrayBuffer()));
      console.log(`  saved ${path.relative(process.cwd(), dests[placement])}`);
    }

    // Mockup Generator allows ~2 tasks a minute.
    await sleep(25000);
  }
}
console.log("\nDone. Reload the site; mockups replace the generated mock-ups automatically.");
