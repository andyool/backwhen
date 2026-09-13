// Lists every sync product + variant in your Printful store so you can paste
// the ids into src/lib/products.ts.
//
//   PRINTFUL_API_KEY=... node scripts/printful-variants.mjs
//
// Output is grouped by product; match each variant's size to the `variantIds`
// map for the matching garment.

const key = process.env.PRINTFUL_API_KEY;
if (!key) {
  console.error("Set PRINTFUL_API_KEY");
  process.exit(1);
}
const headers = { Authorization: `Bearer ${key}` };
if (process.env.PRINTFUL_STORE_ID) headers["X-PF-Store-Id"] = process.env.PRINTFUL_STORE_ID;

async function get(path) {
  const res = await fetch(`https://api.printful.com${path}`, { headers });
  const body = await res.json();
  if (!res.ok) throw new Error(JSON.stringify(body));
  return body.result;
}

const list = await get("/store/products?limit=100");
for (const p of list) {
  const detail = await get(`/store/products/${p.id}`);
  console.log(`\n${detail.sync_product.name}  (sync_product ${p.id})`);
  for (const v of detail.sync_variants) {
    console.log(`  ${String(v.id).padEnd(12)} ${v.name}`);
  }
}
