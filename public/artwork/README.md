Raw designs go here, one PNG per product, named by the product slug in
src/lib/products.ts:

  <product-slug>.png            e.g. blue-moon-inn.png

Then run `npm run artwork:prepare` to knock the background out into
print/<product-slug>.png (transparent, print-ready). The site composites the
print file onto the garment colour until a real Printful mockup exists in
public/products/ (see that folder's README and `npm run printful:mockups`).

Printful wants print files at 150 dpi or better across the print area: for a
30 cm-wide chest print that is 1800 px wide, ideally 3000+. The first batch is
1024×1536 — fine for the website, but regenerate or upscale before ordering.
