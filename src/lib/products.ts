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
  /** Short insider line: what the design means to someone who was there */
  line: string;
  /** What everyone else assumes it is. Said with a straight face. */
  cover: string;
  /** Longer copy for the product page, written to someone who was there */
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
    slug: "gielinor",
    name: "Gielinor",
    world: "Est. 2001",
    blurb:
      "Six places from the old world. The shop you sold your first dagger to, the inn you got thrown out of, the wharf you lost a summer on. You already know which one is yours.",
  },
  {
    slug: "tamriel",
    name: "Tamriel",
    world: "Est. 2002",
    blurb:
      "Six stops between the Bitter Coast and the Jerall Mountains. A census office, a cornerclub, a ferry and a vineyard that never had a bad year. If the names mean something, nothing else needs saying.",
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
  // ---------------------------------------------------------------- Gielinor
  {
    slug: "lumbridge-general-store",
    name: "Lumbridge General Store",
    place: "Across from the castle, Lumbridge",
    collection: "gielinor",
    line: "You know exactly what you sold here.",
    cover: "A general store from some farming town. Nice thatch.",
    story:
      "Everyone started here. A bronze dagger, a handful of coins, and a shopkeeper who would buy anything for less than it was worth. Thatched roof, barrels by the door, a cow watching from the field, the spire behind. You never paid full price here, and you never got it either.",
    printLines: ["Purveyors of fine goods · Est. 2001", "Across from the castle, Lumbridge"],
    examine: "A shop. Sells everything you don't need and nothing you do.",
    topics: {
      "bronze dagger": "Sold for three coins. Bought back for ten. The whole economy, right there.",
      "a cow": "Watching. Always watching.",
      "the spire": "You could hear the bell from the swamp.",
    },
    garments: set("lumbridge-general-store", "black"),
  },
  {
    slug: "blue-moon-inn",
    name: "The Blue Moon Inn",
    place: "South Varrock",
    collection: "gielinor",
    line: "Ales, beds, poor company. You remember the company.",
    cover: "An old coaching inn. Probably does a good pie.",
    story:
      "South side of the city, inside the wall. Nobody asked why you were carrying a full inventory of cabbages, and you didn't offer. Lantern in the window, a crescent moon on the sign, the same three regulars who never seemed to leave.",
    printLines: ["Ales · Beds · Poor company", "South Varrock · Open late"],
    examine: "Ales, beds, poor company. In that order.",
    topics: {
      "cabbages": "Nobody asked. Nobody ever asks.",
      "crescent moon": "Painted, not real. The real one is behind the wall.",
      "three regulars": "Still there. Almost certainly still there.",
    },
    garments: set("blue-moon-inn", "charcoal"),
  },
  {
    slug: "karamja-fishing-co",
    name: "Karamja Fishing Co.",
    place: "Musa Point wharf",
    collection: "gielinor",
    line: "Thirty coins each way. Worth it.",
    cover: "A tropical fishing charter. Someone's holiday souvenir.",
    story:
      "A whole summer on the wharf: cage, haul, cook, drop, repeat, with the volcano smoking behind you the entire time. The ferry fare never came down and you paid it every single trip. Rust and navy on cream, like something you would actually have bought at the wharf.",
    printLines: ["Lobster · Tuna · Swordfish", "Musa Point wharf · Since 2001", "Return ferry 30gp"],
    examine: "Smells of lobster and volcano.",
    topics: {
      "cage, haul, cook, drop": "Until it stopped feeling like a summer and started feeling like a job.",
      "the volcano": "Still smoking. Don't go in without something to light.",
      "ferry fare": "Thirty coins. Each way. No, it doesn't come down.",
    },
    garments: set("karamja-fishing-co", "cream", "tee"),
  },
  {
    slug: "draynor-manor",
    name: "Draynor Manor",
    place: "Draynor Village",
    collection: "gielinor",
    line: "Guided tours. Guests rarely leave.",
    cover: "A haunted-house attraction. Very gothic.",
    story:
      "Dead trees, an iron gate, crows along the roofline and a moon that never changes phase. You went in because someone said there was something upstairs. The door shut behind you. It always does. The one in the range for people who didn't run.",
    printLines: ["Guided tours · Guests rarely leave", "Draynor Village · Since 2001"],
    examine: "The door locked behind you. It always does.",
    topics: {
      "iron gate": "Opens inward. Has never once opened outward.",
      "crows": "They know something. They aren't saying.",
      "something upstairs": "There was. You don't talk about it.",
    },
    garments: set("draynor-manor", "black"),
  },
  {
    slug: "al-kharid-scimitar-works",
    name: "Al Kharid Scimitar Works",
    place: "East of the toll gate",
    collection: "gielinor",
    line: "Pay the toll. Mind the heat.",
    cover: "A desert forge. Moroccan metalworks, maybe?",
    story:
      "Ten gold at the gate, every time, no exceptions. Then sandstone, palm trees, and scimitars hanging on the forge wall like they had always been there. The tee you can wear to work: to everyone else it's a nice desert-town print.",
    printLines: ["Blades forged daily", "East of the toll gate · Al Kharid"],
    examine: "Ten coins at the gate. Blades extra.",
    topics: {
      "Ten gold": "The gatekeeper does not negotiate. You tried.",
      "scimitars": "Curved, fast, and never quite affordable.",
      "palm trees": "The only shade for miles.",
    },
    garments: set("al-kharid-scimitar-works", "black", "tee"),
  },
  {
    slug: "barbarian-village-fishing-and-firemaking",
    name: "Barbarian Village",
    place: "Fishing & Firemaking Co., on the River Lum",
    collection: "gielinor",
    line: "Two levels. One whole weekend.",
    cover: "A riverside fishing camp. Very outdoorsy.",
    story:
      "Fur-roofed huts by a fast river, a rod against a rock, a fire burning down to willow ash, the mine in the hill behind. You spent an entire weekend here for two levels, and you would do it again. You would absolutely do it again.",
    printLines: ["Trout · Salmon · Willow logs", "On the River Lum · Est. 2001"],
    examine: "Trout, salmon, and a fire that never quite catches.",
    topics: {
      "fast river": "The salmon jump. You miss. The salmon jump.",
      "willow ash": "Ninety logs to the next level, give or take a fire that won't light.",
      "the mine": "Coal, if you're patient. Company, if you're not.",
    },
    garments: set("barbarian-village-fishing-and-firemaking", "charcoal"),
  },

  // ---------------------------------------------------------------- Tamriel
  {
    slug: "census-and-excise-office",
    name: "Census & Excise Office",
    place: "Seyda Neen, Bitter Coast",
    collection: "tamriel",
    line: "All new arrivals report here. You did.",
    cover: "A colonial customs house on a foggy coast.",
    story:
      "Off the boat and into the fog: stilt houses, the lighthouse, giant mushrooms in the marsh, and a clerk who wanted your name and your sign before you had found your feet. Everybody's first stop. Nobody has forgotten it.",
    printLines: ["All new arrivals report here", "Bitter Coast · Est. 2002"],
    examine: "All new arrivals report here. Name and sign, please.",
    topics: {
      "the fog": "It lifts by noon. Mostly.",
      "the lighthouse": "Somebody keeps it lit. Nobody says who.",
      "your sign": "Choose carefully. You'll be stuck with it.",
    },
    garments: set("census-and-excise-office", "black"),
  },
  {
    slug: "south-wall-cornerclub",
    name: "The South Wall Cornerclub",
    place: "Labour Town, Balmora",
    collection: "tamriel",
    line: "Rooms, sujamma, discretion.",
    cover: "A neighbourhood tavern in an adobe town.",
    story:
      "Rounded clay houses along the river, stone footbridges, ash hills behind, and a corner tavern where certain arrangements were made. If you know why you would go there, you already know who to ask for. If you don't, it's a very nice tavern.",
    printLines: ["Rooms · Sujamma · Discretion", "Labour Town, Balmora"],
    examine: "Rooms, sujamma, discretion. Ask for no one.",
    topics: {
      "the river": "Brown, slow, and the only reason the town is there.",
      "certain arrangements": "You'd have to ask inside. Bring coin and a reason.",
      "ash hills": "Some afternoons the wind comes off them. Keep your mouth shut.",
    },
    garments: set("south-wall-cornerclub", "charcoal"),
  },
  {
    slug: "vivec-canton-ferry",
    name: "Vivec Canton Ferry",
    place: "Foreign Quarter dock",
    collection: "tamriel",
    line: "All cantons. Timetable optional.",
    cover: "A Venetian water taxi, more or less.",
    story:
      "The cantons rising out of the water, bridges strung between them, one gondola in the foreground and the mountain behind. You got lost here for a week and called it sightseeing.",
    printLines: ["Gondola service · All cantons", "Foreign Quarter dock · Since 2002"],
    examine: "Gondola service to all cantons. Timetable optional.",
    topics: {
      "cantons": "Each one a city. Bring a map or a boatman.",
      "gondola": "Faster than walking. Slower than you'd like.",
      "lost here for a week": "Everyone does. The map doesn't help.",
    },
    garments: set("vivec-canton-ferry", "black", "tee"),
  },
  {
    slug: "newlands-lodge",
    name: "The Newlands Lodge",
    place: "Cheydinhal",
    collection: "tamriel",
    line: "Fine rooms, river views. The nicest town going.",
    cover: "A riverside lodge in some alpine village.",
    story:
      "Willows trailing into the river, a covered stone bridge, steep timber roofs and mountains behind. The nicest town in the province, and you knew it the moment you walked in. You would have bought a house here if they had let you.",
    printLines: ["Fine rooms · River views", "Cheydinhal · Est. 2006"],
    examine: "Fine rooms, river views. Mind the willows.",
    topics: {
      "Willows": "Nobody trims them. That's the point.",
      "stone bridge": "Covered, so you cross in the rain without noticing the rain.",
      "bought a house here": "They did let you, eventually. It needed work.",
    },
    garments: set("newlands-lodge", "charcoal"),
  },
  {
    slug: "surilie-brothers-vineyard",
    name: "Surilie Brothers",
    place: "Vineyard & Winery, West Weald",
    collection: "tamriel",
    line: "Vintage 2006. Never a bad year.",
    cover: "A boutique winery label. Very tasteful.",
    story:
      "Vines on the hills outside the walls, the castle above, barrels and a bunch of grapes up front, all inside a wine-label oval. Two brothers, one hill, no bad years. In burgundy and olive on cream, it passes for a cellar-door souvenir anywhere.",
    printLines: ["West Weald · Skingrad", "Vintage 2006"],
    examine: "Vintage 2006. Never a bad year.",
    topics: {
      "Two brothers": "Ask which one makes it better and you'll get a look.",
      "the castle": "The count doesn't take visitors. The vineyard does.",
      "wine-label oval": "Every bottle in the county has one. This one's better drawn.",
    },
    garments: set("surilie-brothers-vineyard", "cream", "tee"),
  },
  {
    slug: "jerall-view-inn",
    name: "The Jerall View Inn",
    place: "Bruma, Jerall Mountains",
    collection: "tamriel",
    line: "Hot meals, warm beds, mead. Wear it in July.",
    cover: "A ski lodge. Very cosy.",
    story:
      "Snow on the pines, smoke from the chimneys, a lantern-lit porch and the peaks behind under a night sky. The last warm room before the pass. You stayed longer than you meant to.",
    printLines: ["Hot meals · Warm beds · Mead", "Bruma, Jerall Mountains"],
    examine: "Hot meals, warm beds, mead. In that order.",
    topics: {
      "Snow on the pines": "It doesn't melt. Not in July, not ever.",
      "the pass": "Open. Technically always open.",
      "longer than you meant to": "Everyone does. The mead helps.",
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
