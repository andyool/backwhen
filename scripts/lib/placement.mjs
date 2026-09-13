// Where the two prints sit on the garment. Shared by printful-mockups.mjs
// (what the pictures show) and printful-create-products.mjs (what gets
// printed) so they can never disagree.
//
// `pf` is a Printful printfile ({ width, height, dpi }) for the placement;
// `img` is the print file's pixel size.

// Back: the big design at ~80% of the print width, a little below the top.
export function backPosition(pf, img) {
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

// Front: a ~3.8" crest on the wearer's left chest (the viewer's right), its
// centre ~3.5" off the centre line. Print areas are 150 dpi.
export function crestPosition(pf, img) {
  const dpi = pf.dpi ?? 150;
  const scale = (3.8 * dpi) / Math.max(img.width, img.height);
  const width = Math.round(img.width * scale);
  const height = Math.round(img.height * scale);
  const centreX = pf.width / 2 + 3.5 * dpi;
  return {
    area_width: pf.width,
    area_height: pf.height,
    width,
    height,
    left: Math.min(pf.width - width, Math.round(centreX - width / 2)),
    top: Math.round(1.6 * dpi),
  };
}

