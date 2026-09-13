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
  // Shown in the footer. Fill in once registered.
  abn: "",
};

export function siteUrl(): string {
  return (process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000").replace(/\/$/, "");
}
