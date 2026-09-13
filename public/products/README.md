Garment mockups live here, two per garment, named exactly as in
src/lib/products.ts:

  <product-slug>-<hoodie|tee>-<black|charcoal|cream>-back.png    the big design
  <product-slug>-<hoodie|tee>-<black|charcoal|cream>-front.png   the left-chest crest

e.g. lumbridge-general-store-hoodie-black-back.png

Recommended: 1600×2000 (4:5). `npm run printful:mockups` generates both from
Printful's mockup generator once the print files are on a public URL. Until a
file exists the site composites the print file onto the garment colour.
