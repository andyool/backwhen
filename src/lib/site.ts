export const site = {
  name: "Backwhen",
  shortName: "Backwhen",
  /** Lower-case wordmark used in the header and footer */
  wordmark: "backwhen",
  tagline: "Merch from places that don't exist.",
  description:
    "Heavyweight hoodies and tees printed with the inns, shops and outposts you spent your teens in. Cream ink, dark fleece, no logos.",
  email: "hello@backwhen.com",
  instagram: "https://instagram.com/backwhen",
  currency: "AUD",
  // Where "Missing a place?" requests are POSTed as JSON (e.g. a Formspree form URL).
  // Empty = fall back to a prefilled email.
  requestEndpoint: process.env.NEXT_PUBLIC_REQUEST_ENDPOINT ?? "",
  // Shown in the footer. Fill in once registered.
  abn: "",
};

// The public origin, no trailing slash. An empty NEXT_PUBLIC_SITE_URL counts
// as unset (Vercel's import screen creates blank variables). On Vercel the
// deployment's own address is used when nothing is configured.
export function siteUrl(): string {
  let explicit = (process.env.NEXT_PUBLIC_SITE_URL ?? "").trim();
  if (explicit && !/^https?:\/\//i.test(explicit)) explicit = `https://${explicit}`;
  if (explicit) return explicit.replace(/\/$/, "");
  const vercel = process.env.VERCEL_PROJECT_PRODUCTION_URL || process.env.VERCEL_URL;
  if (vercel) return `https://${vercel}`;
  return "http://localhost:3000";
}

/** siteUrl() as a URL object for Next's metadataBase; never throws during a build. */
export function siteOrigin(): URL {
  try {
    return new URL(siteUrl());
  } catch {
    return new URL("http://localhost:3000");
  }
}
