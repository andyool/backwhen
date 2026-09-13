// The catalogue. One entry per design; each design is sold on one or more
// garments. Prices are in AUD cents and include GST.
//
// PRINTFUL: every size of every garment needs a Printful *sync variant id*
// before it can be ordered. Create the product in your Printful store with
// the artwork placed, then run `npm run printful:variants` (see README) and
// paste the ids into `variantIds` below. Until then the item shows as
// "coming soon" and can't be added to the cart.

export type GarmentType = "hoodie" | "tee";

export type Colour = {
  slug: string;
  name: string;
  hex: string;
  /** Text colour for swatch contrast */
  onDark?: boolean;
};

export type Garment = {
  type: GarmentType;
  colour: Colour;
  priceCents: number;
  /** Path under /public. Falls back to a placeholder if the file is missing. */
  image: string;
  sizes: string[];
  /** size -> Printful sync_variant_id. null = not set up yet. */
  variantIds: Record<string, number | null>;
};

export type Collection = {
  slug: string;
  name: string;
  world: string;
  blurb: string;
};

export type Product = {
  slug: string;
  /** The business, as it appears on the garment */
  name: string;
  /** The town or region line */
  place: string;
  collection: Collection["slug"];
  /** Short line used on cards */
  line: string;
  /** Longer copy for the product page */
  story: string;
  /** The small-type lines printed beneath the artwork */
  printLines: string[];
  garments: Garment[];
};

export const collections: Collection[] = [
  {
    slug: "runescape",
    name: "RuneScape",
    world: "Gielinor",
    blurb:
      "Six businesses from the old world. The general store you sold your first bronze dagger to, the inn you got kicked out of, the fishing wharf you spent a whole summer on.",
  },
  {
    slug: "elder-scrolls",
    name: "The Elder Scrolls",
    world: "Morrowind & Cyrodiil",
    blurb:
      "Six stops between the Bitter Coast and the Jerall Mountains. Census offices, cornerclubs, ferries and a vineyard that never made a bad year.",
  },
];

// Garment colours as AS Colour names them. Slugs are part of the SKU, so the
// tee's "Faded black" keeps the slug "black".
const colours = {
  black: { slug: "black", name: "Black", hex: "#141414", onDark: true },
  fadedBlack: { slug: "black", name: "Faded black", hex: "#353331", onDark: true },
  charcoal: { slug: "charcoal", name: "Washed charcoal", hex: "#3A3733", onDark: true },
  cream: { slug: "cream", name: "Cream", hex: "#EFE7D3" },
} satisfies Record<string, Colour>;

// Sizes AS Colour actually makes: 5101 hoodie stops at 2XL, 5082 tee goes to 3XL.
const HOODIE_SIZES = ["S", "M", "L", "XL", "2XL"];
const TEE_SIZES = ["S", "M", "L", "XL", "2XL", "3XL"];

const HOODIE_PRICE = 8900;
const TEE_PRICE = 4900;

// @printful-variants-start
// Written by `npm run printful:products` — don't edit by hand.
// Key: <slug>__<garment>__<colour slug>; value: size -> Printful sync_variant_id.
const PRINTFUL_VARIANTS: Record<string, Record<string, number>> = {
  "lumbridge-general-store__hoodie__black": {
    "S": 5497826523,
    "M": 5497826524,
    "L": 5497826525,
    "XL": 5497826526,
    "2XL": 5497826527
  },
  "lumbridge-general-store__tee__black": {
    "S": 5497826528,
    "M": 5497826529,
    "L": 5497826530,
    "XL": 5497826531,
    "2XL": 5497826532,
    "3XL": 5497826533
  },
  "blue-moon-inn__hoodie__charcoal": {
    "S": 5497826540,
    "M": 5497826541,
    "L": 5497826542,
    "XL": 5497826543,
    "2XL": 5497826544
  },
  "blue-moon-inn__tee__black": {
    "S": 5497826588,
    "M": 5497826589,
    "L": 5497826590,
    "XL": 5497826591,
    "2XL": 5497826592,
    "3XL": 5497826593
  },
  "karamja-fishing-co__tee__cream": {
    "S": 5497826594,
    "M": 5497826595,
    "L": 5497826596,
    "XL": 5497826597,
    "2XL": 5497826598,
    "3XL": 5497826599
  },
  "karamja-fishing-co__hoodie__charcoal": {
    "S": 5497826600,
    "M": 5497826601,
    "L": 5497826602,
    "XL": 5497826603,
    "2XL": 5497826604
  },
  "draynor-manor__hoodie__black": {
    "S": 5497826606,
    "M": 5497826607,
    "L": 5497826608,
    "XL": 5497826609,
    "2XL": 5497826610
  },
  "draynor-manor__tee__black": {
    "S": 5497826626,
    "M": 5497826631,
    "L": 5497826632,
    "XL": 5497826633,
    "2XL": 5497826634,
    "3XL": 5497826635
  },
  "al-kharid-scimitar-works__tee__black": {
    "S": 5497826765,
    "M": 5497826766,
    "L": 5497826767,
    "XL": 5497826768,
    "2XL": 5497826769,
    "3XL": 5497826770
  },
  "al-kharid-scimitar-works__hoodie__black": {
    "S": 5497826797,
    "M": 5497826801,
    "L": 5497826808,
    "XL": 5497826809,
    "2XL": 5497826811
  },
  "barbarian-village-fishing-and-firemaking__hoodie__charcoal": {
    "S": 5497827141,
    "M": 5497827142,
    "L": 5497827143,
    "XL": 5497827144,
    "2XL": 5497827145
  },
  "barbarian-village-fishing-and-firemaking__tee__black": {
    "S": 5497827146,
    "M": 5497827147,
    "L": 5497827148,
    "XL": 5497827149,
    "2XL": 5497827150,
    "3XL": 5497827151
  }
};
// @printful-variants-end

function idsFor(slug: string, type: GarmentType, colourSlug: string, sizes: string[]): Record<string, number | null> {
  const ids = PRINTFUL_VARIANTS[`${slug}__${type}__${colourSlug}`] ?? {};
  return Object.fromEntries(sizes.map((s) => [s, ids[s] ?? null]));
}

function hoodie(slug: string, colour: Colour): Garment {
  return {
    type: "hoodie",
    colour,
    priceCents: HOODIE_PRICE,
    image: `/products/${slug}-hoodie-${colour.slug}.png`,
    sizes: HOODIE_SIZES,
    variantIds: idsFor(slug, "hoodie", colour.slug, HOODIE_SIZES),
  };
}

function tee(slug: string, colour: Colour): Garment {
  return {
    type: "tee",
    colour,
    priceCents: TEE_PRICE,
    image: `/products/${slug}-tee-${colour.slug}.png`,
    sizes: TEE_SIZES,
    variantIds: idsFor(slug, "tee", colour.slug, TEE_SIZES),
  };
}

export const products: Product[] = [
  // ---------------------------------------------------------------- RuneScape
  {
    slug: "lumbridge-general-store",
    name: "Lumbridge General Store",
    place: "Across from the castle, Lumbridge",
    collection: "runescape",
    line: "Purveyors of fine goods since 2001.",
    story:
      "Every journey started here, usually with a bronze dagger and 25 coins. The shop hasn't changed: thatched roof, barrels by the door, a cow watching from the field, the spire behind. Printed in bone ink on a heavyweight hoodie, with the store name on the chest.",
    printLines: ["Purveyors of fine goods · Est. 2001", "Across from the castle, Lumbridge"],
    garments: [hoodie("lumbridge-general-store", colours.black), tee("lumbridge-general-store", colours.fadedBlack)],
  },
  {
    slug: "blue-moon-inn",
    name: "The Blue Moon Inn",
    place: "South Varrock",
    collection: "runescape",
    line: "Ales, beds, poor company. Open late.",
    story:
      "The inn on the south side of Varrock where nobody asked why you were carrying a full inventory of cabbages. Lantern light in the windows, the city wall behind, a crescent moon on the sign. Washed charcoal fleece, bone ink.",
    printLines: ["Ales · Beds · Poor company", "South Varrock · Open late"],
    garments: [hoodie("blue-moon-inn", colours.charcoal), tee("blue-moon-inn", colours.fadedBlack)],
  },
  {
    slug: "karamja-fishing-co",
    name: "Karamja Fishing Co.",
    place: "Musa Point wharf",
    collection: "runescape",
    line: "Lobster, tuna, swordfish. Return ferry 30gp.",
    story:
      "A summer of lobsters and a volcano smoking in the background. The badge is printed in rust and navy on a cream tee, the kind you'd have bought from the wharf itself if the wharf sold tees. Return ferry not included.",
    printLines: ["Lobster · Tuna · Swordfish", "Musa Point wharf · Since 2001", "Return ferry 30gp"],
    garments: [tee("karamja-fishing-co", colours.cream), hoodie("karamja-fishing-co", colours.charcoal)],
  },
  {
    slug: "draynor-manor",
    name: "Draynor Manor",
    place: "Draynor Village",
    collection: "runescape",
    line: "Guided tours. Guests rarely leave.",
    story:
      "Dead trees, a wrought-iron gate, crows on the roofline and a full moon behind cloud. The gothic one in the range, for the people who didn't run when the door shut behind them. Black hoodie, bone ink.",
    printLines: ["Guided tours · Guests rarely leave", "Draynor Village · Since 2001"],
    garments: [hoodie("draynor-manor", colours.black), tee("draynor-manor", colours.fadedBlack)],
  },
  {
    slug: "al-kharid-scimitar-works",
    name: "Al Kharid Scimitar Works",
    place: "East of the toll gate",
    collection: "runescape",
    line: "Blades forged daily.",
    story:
      "Ten gold at the gate, then a sandstone forge with the scimitars hanging on the wall and palm trees outside. The tee in the range you can wear to work. Black, bone ink, forge glow picked out in the line work.",
    printLines: ["Blades forged daily", "East of the toll gate · Al Kharid"],
    garments: [tee("al-kharid-scimitar-works", colours.fadedBlack), hoodie("al-kharid-scimitar-works", colours.black)],
  },
  {
    slug: "barbarian-village-fishing-and-firemaking",
    name: "Barbarian Village",
    place: "Fishing & Firemaking Co., on the River Lum",
    collection: "runescape",
    line: "Trout, salmon, willow logs.",
    story:
      "Fur-roofed huts by a fast river, a rod leaning on a rock, a fire burning down to willow ash, the mine entrance in the hill behind. The place you spent an entire weekend for two levels. Washed charcoal, bone ink.",
    printLines: ["Trout · Salmon · Willow logs", "On the River Lum · Est. 2001"],
    garments: [hoodie("barbarian-village-fishing-and-firemaking", colours.charcoal), tee("barbarian-village-fishing-and-firemaking", colours.fadedBlack)],
  },

  // ------------------------------------------------------------ Elder Scrolls
  {
    slug: "census-and-excise-office",
    name: "Census & Excise Office",
    place: "Seyda Neen, Bitter Coast",
    collection: "elder-scrolls",
    line: "All new arrivals report here.",
    story:
      "Off the boat, into the fog: stilt houses, the lighthouse, giant mushrooms in the marsh and a clerk who wants to know your name and your sign. The first stop for everyone. Black hoodie, bone ink.",
    printLines: ["All new arrivals report here", "Bitter Coast · Est. 2002"],
    garments: [hoodie("census-and-excise-office", colours.black), tee("census-and-excise-office", colours.fadedBlack)],
  },
  {
    slug: "south-wall-cornerclub",
    name: "The South Wall Cornerclub",
    place: "Labour Town, Balmora",
    collection: "elder-scrolls",
    line: "Rooms, sujamma, discretion.",
    story:
      "Rounded adobe houses on the Odai, stone footbridges, ash hills behind, and a corner tavern where certain arrangements were made. Washed charcoal fleece, bone ink, and a name that will only mean something to the right people.",
    printLines: ["Rooms · Sujamma · Discretion", "Labour Town, Balmora"],
    garments: [hoodie("south-wall-cornerclub", colours.charcoal), tee("south-wall-cornerclub", colours.fadedBlack)],
  },
  {
    slug: "vivec-canton-ferry",
    name: "Vivec Canton Ferry",
    place: "Foreign Quarter dock",
    collection: "elder-scrolls",
    line: "Gondola service, all cantons.",
    story:
      "The cantons rising out of the lake, bridges between them, a single gondola in the foreground and the mountain behind. Ferry timetables not guaranteed. Black tee, bone ink.",
    printLines: ["Gondola service · All cantons", "Foreign Quarter dock · Since 2002"],
    garments: [tee("vivec-canton-ferry", colours.fadedBlack), hoodie("vivec-canton-ferry", colours.black)],
  },
  {
    slug: "newlands-lodge",
    name: "The Newlands Lodge",
    place: "Cheydinhal",
    collection: "elder-scrolls",
    line: "Fine rooms, river views.",
    story:
      "Willows trailing into the river, a stone bridge, steep timber roofs and mountains behind. The nicest town in the province and the nicest lodge in it. Washed charcoal, bone ink.",
    printLines: ["Fine rooms · River views", "Cheydinhal · Est. 2006"],
    garments: [hoodie("newlands-lodge", colours.charcoal), tee("newlands-lodge", colours.fadedBlack)],
  },
  {
    slug: "surilie-brothers-vineyard",
    name: "Surilie Brothers",
    place: "Vineyard & Winery, West Weald",
    collection: "elder-scrolls",
    line: "Vintage 2006.",
    story:
      "Vines on the hills outside the walls, the castle above, barrels and a bunch of grapes in the foreground, set inside a wine-label oval. Printed in burgundy and olive on a cream tee. Pairs with anything.",
    printLines: ["West Weald · Skingrad", "Vintage 2006"],
    garments: [tee("surilie-brothers-vineyard", colours.cream), hoodie("surilie-brothers-vineyard", colours.charcoal)],
  },
  {
    slug: "jerall-view-inn",
    name: "The Jerall View Inn",
    place: "Bruma, Jerall Mountains",
    collection: "elder-scrolls",
    line: "Hot meals, warm beds, mead.",
    story:
      "Snow on the pines, smoke from the chimneys, a lantern-lit porch and the peaks behind under a night sky. The one to wear in July. Black hoodie, bone ink.",
    printLines: ["Hot meals · Warm beds · Mead", "Bruma, Jerall Mountains"],
    garments: [hoodie("jerall-view-inn", colours.black), tee("jerall-view-inn", colours.fadedBlack)],
  },
];

// ----------------------------------------------------------------- lookups

export const garmentLabel: Record<GarmentType, string> = {
  hoodie: "Heavyweight hoodie",
  tee: "Heavy tee",
};

export function getCollection(slug: string): Collection | undefined {
  return collections.find((c) => c.slug === slug);
}

export function getProduct(slug: string): Product | undefined {
  return products.find((p) => p.slug === slug);
}

export function productsIn(collectionSlug: string): Product[] {
  return products.filter((p) => p.collection === collectionSlug);
}

export function fromPrice(p: Product): number {
  return Math.min(...p.garments.map((g) => g.priceCents));
}

export function garmentAvailable(g: Garment): boolean {
  return Object.values(g.variantIds).some((id) => id !== null);
}

// A SKU uniquely identifies one purchasable size of one garment of one design.
export function makeSku(productSlug: string, g: Garment, size: string): string {
  return [productSlug, g.type, g.colour.slug, size].join("__");
}

export type ResolvedSku = {
  sku: string;
  product: Product;
  garment: Garment;
  size: string;
  printfulVariantId: number | null;
};

export function resolveSku(sku: string): ResolvedSku | null {
  const [slug, type, colourSlug, size] = sku.split("__");
  const product = getProduct(slug);
  if (!product) return null;
  const garment = product.garments.find((g) => g.type === type && g.colour.slug === colourSlug);
  if (!garment || !garment.sizes.includes(size)) return null;
  return { sku, product, garment, size, printfulVariantId: garment.variantIds[size] ?? null };
}
