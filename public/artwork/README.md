Raw designs go here, two PNGs per product, named by the product slug in
src/lib/products.ts:

  <product-slug>.png            the big design, printed on the back
  crest/<product-slug>.png      the round crest, printed small on the left chest

Then run `npm run artwork:prepare` to knock the backgrounds out into
print/<product-slug>.png and print/crest/<product-slug>.png (transparent,
print-ready). The site composites the print files onto the garment colour until
a real Printful mockup exists in public/products/ (see that folder's README and
`npm run printful:mockups`). Where each print sits is defined once, in
scripts/lib/placement.mjs.

Printful wants print files at 150 dpi or better across the print area: for a
30 cm-wide back print that is 1800 px wide, ideally 3000+; the 3.8" crest needs
~570 px, which the 1254 px crests comfortably exceed. The back designs are
1024×1536 — fine for the website, but regenerate or upscale before ordering.
