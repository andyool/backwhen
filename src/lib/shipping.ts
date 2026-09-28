// Flat-rate shipping, charged on top of GST-inclusive prices.
// Printful's real cost varies by garment and destination; these are set to
// cover the typical single-hoodie rate per zone. Adjust after the first
// month of orders.

export type ShippingZone = {
  id: string;
  label: string;
  countries: string[]; // ISO 3166-1 alpha-2
  rateCents: number;
  freeOverCents?: number;
  estimate: string;
};

export const zones: ShippingZone[] = [
  {
    id: "au",
    label: "Australia",
    countries: ["AU"],
    rateCents: 995,
    freeOverCents: 15000,
    estimate: "4–8 business days",
  },
  {
    id: "nz",
    label: "New Zealand",
    countries: ["NZ"],
    rateCents: 1495,
    estimate: "6–12 business days",
  },
  {
    id: "na",
    label: "United States & Canada",
    countries: ["US", "CA"],
    rateCents: 1495,
    estimate: "5–10 business days",
  },
  {
    id: "eu",
    label: "United Kingdom & Europe",
    countries: ["GB", "IE", "DE", "FR", "NL", "BE", "ES", "IT", "SE", "DK", "NO", "FI", "AT", "CH", "PL", "PT"],
    rateCents: 1795,
    estimate: "6–12 business days",
  },
];

export const countryNames: Record<string, string> = {
  AU: "Australia", NZ: "New Zealand", US: "United States", CA: "Canada",
  GB: "United Kingdom", IE: "Ireland", DE: "Germany", FR: "France", NL: "Netherlands",
  BE: "Belgium", ES: "Spain", IT: "Italy", SE: "Sweden", DK: "Denmark", NO: "Norway",
  FI: "Finland", AT: "Austria", CH: "Switzerland", PL: "Poland", PT: "Portugal",
};

export const allowedCountries = zones.flatMap((z) => z.countries);

export function zoneForCountry(country: string): ShippingZone | undefined {
  return zones.find((z) => z.countries.includes(country));
}

export function shippingFor(
  country: string,
  subtotalCents: number,
): { zone: ShippingZone; rateCents: number } | null {
  const zone = zoneForCountry(country);
  if (!zone) return null;
  const free = zone.freeOverCents !== undefined && subtotalCents >= zone.freeOverCents;
  return { zone, rateCents: free ? 0 : zone.rateCents };
}

const COUNTRY_KEY = "backwhen-country";

/** The shopper's country: what they picked last time, else a guess from the
 *  browser's time zone and language, else Australia. */
export function initialCountry(): string {
  if (typeof window === "undefined") return "AU";
  try {
    const saved = window.localStorage.getItem(COUNTRY_KEY);
    if (saved && allowedCountries.includes(saved)) return saved;
  } catch {}
  try {
    const tz = Intl.DateTimeFormat().resolvedOptions().timeZone ?? "";
    if (tz.startsWith("Australia/")) return "AU";
    if (tz === "Pacific/Auckland" || tz === "Pacific/Chatham") return "NZ";
    const region = (navigator.language.split("-")[1] ?? "").toUpperCase();
    if (region && allowedCountries.includes(region)) return region;
    if (tz.startsWith("America/")) return "US";
    if (tz === "Europe/London") return "GB";
  } catch {}
  return "AU";
}

export function saveCountry(country: string) {
  try {
    window.localStorage.setItem(COUNTRY_KEY, country);
  } catch {}
}
