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
  /** Printful mockup of the back (the big design), under /public. Composited/generated fallbacks stand in when missing. */
  image: string;
  /** Printful mockup of the front (the small left-chest crest), under /public. */
  imageFront: string;
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
  /** What "Examine" says. Short, dry, one line. */
  examine: string;
  /** Phrases in `story` that open a reply when clicked, dialogue-style. Must appear verbatim in `story`. */
  topics?: Record<string, string>;
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

// Garment colours as AS Colour names them. Every design is sold in ONE colour,
// and the hoodie and tee of that design are the matching pair below (the 5082
// tee is only made in "faded" shades, so its names differ). Slugs are part of
// the SKU, so a colour keeps its slug across both garments.
export type ColourSlug = "black" | "charcoal" | "cream";

const hoodieColours: Record<ColourSlug, Colour> = {
  black: { slug: "black", name: "Black", hex: "#141414", onDark: true },
  charcoal: { slug: "charcoal", name: "Coal", hex: "#2B2B2D", onDark: true },
  cream: { slug: "cream", name: "Ecru", hex: "#F5EFDD" },
};
const teeColours: Record<ColourSlug, Colour> = {
  black: { slug: "black", name: "Faded black", hex: "#3E3E3E", onDark: true },
  charcoal: { slug: "charcoal", name: "Faded coal", hex: "#45463F", onDark: true },
  cream: { slug: "cream", name: "Faded bone", hex: "#F0EADF" },
};

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
    "S": 5498055508,
    "M": 5498055509,
    "L": 5498055510,
    "XL": 5498055511,
    "2XL": 5498055512
  },
  "lumbridge-general-store__tee__black": {
    "S": 5498055522,
    "M": 5498055523,
    "L": 5498055524,
    "XL": 5498055525,
    "2XL": 5498055526,
    "3XL": 5498055527
  },
  "blue-moon-inn__hoodie__charcoal": {
    "S": 5498055561,
    "M": 5498055563,
    "L": 5498055564,
    "XL": 5498055565,
    "2XL": 5498055566
  },
  "karamja-fishing-co__tee__cream": {
    "S": 5498055608,
    "M": 5498055609,
    "L": 5498055610,
    "XL": 5498055611,
    "2XL": 5498055612,
    "3XL": 5498055613
  },
  "draynor-manor__hoodie__black": {
    "S": 5498055633,
    "M": 5498055634,
    "L": 5498055635,
    "XL": 5498055636,
    "2XL": 5498055637
  },
  "draynor-manor__tee__black": {
    "S": 5498055642,
    "M": 5498055643,
    "L": 5498055644,
    "XL": 5498055645,
    "2XL": 5498055646,
    "3XL": 5498055647
  },
  "al-kharid-scimitar-works__tee__black": {
    "S": 5498055801,
    "M": 5498055803,
    "L": 5498055805,
    "XL": 5498055806,
    "2XL": 5498055808,
    "3XL": 5498055809
  },
  "al-kharid-scimitar-works__hoodie__black": {
    "S": 5498055841,
    "M": 5498055842,
    "L": 5498055843,
    "XL": 5498055844,
    "2XL": 5498055845
  },
  "barbarian-village-fishing-and-firemaking__hoodie__charcoal": {
    "S": 5498056310,
    "M": 5498056311,
    "L": 5498056312,
    "XL": 5498056313,
    "2XL": 5498056314
  },
  "census-and-excise-office__hoodie__black": {
    "S": 5498056329,
    "M": 5498056330,
    "L": 5498056331,
    "XL": 5498056332,
    "2XL": 5498056333
  },
  "census-and-excise-office__tee__black": {
    "S": 5498056340,
    "M": 5498056341,
    "L": 5498056345,
    "XL": 5498056346,
    "2XL": 5498056347,
    "3XL": 5498056348
  },
  "south-wall-cornerclub__hoodie__charcoal": {
    "S": 5498056352,
    "M": 5498056353,
    "L": 5498056354,
    "XL": 5498056355,
    "2XL": 5498056356
  },
  "vivec-canton-ferry__tee__black": {
    "S": 5498056421,
    "M": 5498056425,
    "L": 5498056427,
    "XL": 5498056428,
    "2XL": 5498056429,
    "3XL": 5498056432
  },
  "vivec-canton-ferry__hoodie__black": {
    "S": 5498056552,
    "M": 5498056553,
    "L": 5498056554,
    "XL": 5498056555,
    "2XL": 5498056556
  },
  "newlands-lodge__hoodie__charcoal": {
    "S": 5498056557,
    "M": 5498056558,
    "L": 5498056559,
    "XL": 5498056560,
    "2XL": 5498056561
  },
  "surilie-brothers-vineyard__tee__cream": {
    "S": 5498057367,
    "M": 5498057368,
    "L": 5498057369,
    "XL": 5498057370,
    "2XL": 5498057371,
    "3XL": 5498057372
  },
  "jerall-view-inn__hoodie__black": {
    "S": 5498057389,
    "M": 5498057390,
    "L": 5498057391,
    "XL": 5498057392,
    "2XL": 5498057393
  },
  "jerall-view-inn__tee__black": {
    "S": 5498057396,
    "M": 5498057397,
    "L": 5498057398,
    "XL": 5498057399,
    "2XL": 5498057400,
    "3XL": 5498057401
  },
  "blue-moon-inn__tee__charcoal": {
    "S": 5498055602,
    "M": 5498055603,
    "L": 5498055604,
    "XL": 5498055605,
    "2XL": 5498055606,
    "3XL": 5498055607
  },
  "karamja-fishing-co__hoodie__cream": {
    "S": 5498055615,
    "M": 5498055616,
    "L": 5498055617,
    "XL": 5498055618,
    "2XL": 5498055619
  },
  "barbarian-village-fishing-and-firemaking__tee__charcoal": {
    "S": 5498056320,
    "M": 5498056321,
    "L": 5498056322,
    "XL": 5498056323,
    "2XL": 5498056324,
    "3XL": 5498056325
  },
  "south-wall-cornerclub__tee__charcoal": {
    "S": 5498056369,
    "M": 5498056370,
    "L": 5498056372,
    "XL": 5498056373,
    "2XL": 5498056374,
    "3XL": 5498056375
  },
  "newlands-lodge__tee__charcoal": {
    "S": 5498056582,
    "M": 5498056584,
    "L": 5498056585,
    "XL": 5498056588,
    "2XL": 5498056590,
    "3XL": 5498056591
  },
  "surilie-brothers-vineyard__hoodie__cream": {
    "S": 5498057380,
    "M": 5498057381,
    "L": 5498057382,
    "XL": 5498057383,
    "2XL": 5498057384
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
    image: `/products/${slug}-hoodie-${colour.slug}-back.png`,
    imageFront: `/products/${slug}-hoodie-${colour.slug}-front.png`,
    sizes: HOODIE_SIZES,
    variantIds: idsFor(slug, "hoodie", colour.slug, HOODIE_SIZES),
  };
}

function tee(slug: string, colour: Colour): Garment {
  return {
    type: "tee",
    colour,
    priceCents: TEE_PRICE,
    image: `/products/${slug}-tee-${colour.slug}-back.png`,
    imageFront: `/products/${slug}-tee-${colour.slug}-front.png`,
    sizes: TEE_SIZES,
    variantIds: idsFor(slug, "tee", colour.slug, TEE_SIZES),
  };
}

/** Both garments of a design in the same colour. `first` is the one shown on cards and picked by default. */
function set(slug: string, colour: ColourSlug, first: GarmentType = "hoodie"): Garment[] {
  const pair = [hoodie(slug, hoodieColours[colour]), tee(slug, teeColours[colour])];
  return first === "hoodie" ? pair : pair.reverse();
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
    examine: "A shop. Sells everything you don't need and nothing you do.",
    topics: {
      "bronze dagger": "Sold for three coins. Bought back for ten. This is the whole economy.",
      "a cow": "Watching. Always watching.",
      "spire": "You could hear the bell from the swamp.",
    },
    garments: set("lumbridge-general-store", "black"),
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
    examine: "Ales, beds, poor company. In that order.",
    topics: {
      "cabbages": "Nobody asked. Nobody ever asks.",
      "crescent moon": "Painted, not real. The real one is behind the wall.",
    },
    garments: set("blue-moon-inn", "charcoal"),
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
    examine: "Smells of lobster and volcano.",
    topics: {
      "lobsters": "Caged, hauled, cooked, dropped. Repeat until it stops feeling like a summer.",
      "volcano": "Still smoking. Don't go in without something to light.",
      "Return ferry": "Thirty coins. Each way. No, the price doesn't come down.",
    },
    garments: set("karamja-fishing-co", "cream", "tee"),
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
    examine: "The door locked behind you. It always does.",
    topics: {
      "wrought-iron gate": "Opens inward. Has never once opened outward.",
      "crows": "They know something. They aren't saying.",
      "full moon": "Same phase every night. Nobody has mentioned it.",
    },
    garments: set("draynor-manor", "black"),
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
    examine: "Ten coins at the gate. Blades extra.",
    topics: {
      "Ten gold": "The toll. The gatekeeper does not negotiate.",
      "scimitars": "Curved, fast, and yours for a price.",
      "palm trees": "The only shade for miles.",
    },
    garments: set("al-kharid-scimitar-works", "black", "tee"),
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
    examine: "Trout, salmon, and a fire that never quite catches.",
    topics: {
      "willow ash": "Ninety logs to the next level, give or take a fire that won't light.",
      "mine entrance": "Coal, if you're patient. Company, if you're not.",
      "fast river": "The salmon jump. You miss. The salmon jump.",
    },
    garments: set("barbarian-village-fishing-and-firemaking", "charcoal"),
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
    examine: "All new arrivals report here. Name and sign, please.",
    topics: {
      "the fog": "It lifts by noon, mostly.",
      "lighthouse": "Somebody keeps it lit. Nobody says who.",
      "your sign": "Choose carefully. You'll be stuck with it.",
    },
    garments: set("census-and-excise-office", "black"),
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
    examine: "Rooms, sujamma, discretion. Ask for no one.",
    topics: {
      "Odai": "The river. Brown, slow, and the reason the town exists.",
      "certain arrangements": "You'd have to ask inside. Bring coin and a reason.",
      "ash hills": "The wind comes off them some afternoons. Keep your mouth shut.",
    },
    garments: set("south-wall-cornerclub", "charcoal"),
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
    examine: "Gondola service to all cantons. Timetable optional.",
    topics: {
      "cantons": "Nine of them, each a city. Bring a map or a boatman.",
      "gondola": "Faster than walking. Slower than you'd like.",
      "the mountain": "Best seen from a distance. Preferably a moving one.",
    },
    garments: set("vivec-canton-ferry", "black", "tee"),
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
    examine: "Fine rooms, river views. Mind the willows.",
    topics: {
      "Willows": "They trail into the river and nobody trims them. That's the point.",
      "stone bridge": "Covered, so you can cross in the rain without noticing the rain.",
      "nicest town": "Ask the locals. They'll agree, quietly.",
    },
    garments: set("newlands-lodge", "charcoal"),
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
    examine: "Vintage 2006. Never a bad year.",
    topics: {
      "Vines": "Two brothers, one hill, no bad years. Ask which brother and you'll get a look.",
      "the castle": "The count doesn't take visitors. The vineyard does.",
      "wine-label oval": "Every bottle in the county has one. This one is better drawn.",
    },
    garments: set("surilie-brothers-vineyard", "cream", "tee"),
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
    examine: "Hot meals, warm beds, mead. In that order.",
    topics: {
      "Snow on the pines": "It doesn't melt. Not in July, not ever.",
      "the peaks": "The pass is open. The pass is always, technically, open.",
      "July": "Wear it anyway. Nobody here will judge.",
    },
    garments: set("jerall-view-inn", "black"),
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
