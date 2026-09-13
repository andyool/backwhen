// Creates one Printful sync product per design × garment × colour in the
// backwhen store, with the print file placed and one sync variant per size,
// then writes the sync_variant ids into src/lib/products.ts so those sizes
// become purchasable. Safe to re-run: existing products (matched by
// external_id) are read, not recreated.
//
//   PRINTFUL_API_KEY=... PRINTFUL_STORE_ID=... \
//   ARTWORK_BASE_URL=https://andyool.github.io/backwhen/artwork/print \
//   SITE_BASE_URL=https://andyool.github.io/backwhen \
//     node scripts/printful-create-products.mjs [slug ...]

import fs from "node:fs/promises";
import { createHash } from "node:crypto";
import path from "node:path";
import { pathToFileURL } from "node:url";

const key = process.env.PRINTFUL_API_KEY;
const storeId = process.env.PRINTFUL_STORE_ID;
if (!key || !storeId) {
  console.error("Set PRINTFUL_API_KEY and PRINTFUL_STORE_ID");
  process.exit(1);
}
const baseUrl = (process.env.ARTWORK_BASE_URL ?? "").replace(/\/$/, "");
const siteUrl = (process.env.SITE_BASE_URL ?? "").replace(/\/$/, "");
if (!baseUrl.startsWith("http")) {
  console.error("Set ARTWORK_BASE_URL to the public URL of public/artwork/print");
  process.exit(1);
}

const headers = { Authorization: `Bearer ${key}`, "Content-Type": "application/json", "X-PF-Store-Id": storeId };
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

const HOODIE_ID = Number(process.env.PRINTFUL_HOODIE_ID ?? 484); // AS Colour 5101
const TEE_ID = Number(process.env.PRINTFUL_TEE_ID ?? 713); // AS Colour 5082

const COLOUR_NAMES = {
  black: ["black"],
  charcoal: ["coal", "charcoal"],
  cream: ["bone", "ecru", "natural", "cream"],
};
const normaliseColour = (c) => (c ?? "").toLowerCase().replace(/^faded /, "").trim();
const normaliseSize = (s) => s.replace(/^(\d)XL$/, "$1XL").toUpperCase();

async function catalogVariants(productId) {
  const r = await api("GET", `/products/${productId}`);
  return { title: r.product.title, variants: r.variants };
}

function catalogVariantFor(catalog, colourSlug, size) {
  const names = COLOUR_NAMES[colourSlug] ?? [colourSlug];
  const v = catalog.variants.find((v) => names.includes(normaliseColour(v.color)) && normaliseSize(v.size) === normaliseSize(size));
  if (!v) throw new Error(`${catalog.title}: no variant for ${colourSlug} / ${size}`);
  return v;
}

// ---------------------------------------------------------------- catalogue

const { products, garmentLabel, makeSku } = await import(pathToFileURL(path.resolve("src/lib/products.ts")).href);
const only = process.argv.slice(2);
const wanted = products.filter((p) => only.length === 0 || only.includes(p.slug));

const hoodie = await catalogVariants(HOODIE_ID);
const tee = await catalogVariants(TEE_ID);

// Existing sync products, keyed by external_id.
const existing = new Map();
for (const sp of await api("GET", "/store/products?limit=100")) {
  if (sp.external_id) existing.set(sp.external_id, sp.id);
}

const result = {}; // externalId -> { size: sync_variant_id }

for (const product of wanted) {
  const printFile = path.resolve("public/artwork/print", `${product.slug}.png`);
  try {
    await fs.access(printFile);
  } catch {
    console.log(`\n${product.slug}: no print file, skipped (still "coming soon")`);
    continue;
  }
  const fileUrl = await versioned(`${baseUrl}/${product.slug}.png`, printFile);

  for (const g of product.garments) {
    const externalId = `${product.slug}__${g.type}__${g.colour.slug}`;
    const catalog = g.type === "hoodie" ? hoodie : tee;
    const name = `${product.name} — ${garmentLabel[g.type]}, ${g.colour.name}`;

    let detail;
    if (existing.has(externalId)) {
      detail = await api("GET", `/store/products/${existing.get(externalId)}`);
      console.log(`\n${name}: already in store (#${detail.sync_product.id})`);
    } else {
      const sync_variants = g.sizes.map((size) => ({
        external_id: makeSku(product.slug, g, size),
        variant_id: catalogVariantFor(catalog, g.colour.slug, size).id,
        retail_price: (g.priceCents / 100).toFixed(2),
        files: [{ type: "default", url: fileUrl }],
      }));
      const thumbnail = siteUrl ? `${siteUrl}${g.image}` : undefined;
      const created = await api("POST", "/store/products", {
        sync_product: { name, external_id: externalId, thumbnail },
        sync_variants,
      });
      detail = await api("GET", `/store/products/${created.id}`);
      console.log(`\n${name}: created #${created.id} with ${sync_variants.length} sizes`);
      await sleep(1500);
    }

    const ids = {};
    for (const sv of detail.sync_variants) {
      // Size comes from the catalogue variant the sync variant wraps.
      const cv = catalog.variants.find((v) => v.id === sv.variant_id);
      const size = cv ? normaliseSize(cv.size) : sv.external_id?.split("__").pop();
      if (size) ids[size] = sv.id;
    }
    result[externalId] = ids;
    console.log(`  sizes: ${Object.entries(ids).map(([s, id]) => `${s}=${id}`).join(" ")}`);
  }
}

// ---------------------------------------------------------------- write back

const file = path.resolve("src/lib/products.ts");
let src = await fs.readFile(file, "utf8");
const start = src.indexOf("// @printful-variants-start");
const end = src.indexOf("// @printful-variants-end");
if (start < 0 || end < 0) throw new Error("markers missing in products.ts");
// Merge with whatever is already recorded so a partial run never wipes ids.
const currentMatch = src.slice(start, end).match(/= (\{[\s\S]*?\});\n/);
const current = currentMatch ? JSON.parse(currentMatch[1]) : {};
const merged = { ...current, ...result };
const block =
  "// @printful-variants-start\n" +
  "// Written by `npm run printful:products` — don't edit by hand.\n" +
  "// Key: <slug>__<garment>__<colour slug>; value: size -> Printful sync_variant_id.\n" +
  `const PRINTFUL_VARIANTS: Record<string, Record<string, number>> = ${JSON.stringify(merged, null, 2)};\n`;
src = src.slice(0, start) + block + src.slice(end);
await fs.writeFile(file, src);
console.log(`\nWrote ${Object.keys(merged).length} garment entries into src/lib/products.ts`);
