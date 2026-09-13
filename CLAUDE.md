# CLAUDE.md — project brief for Claude Code

You are continuing a custom e-commerce storefront that was designed and scaffolded in a chat session
(no network there, so it has never been installed or built). Read this file fully before touching code.

## What this is

A nostalgia apparel brand selling hoodies and tees printed with in-world businesses and locations from
old games — the Lumbridge General Store, the Blue Moon Inn, the Seyda Neen Census & Excise Office — drawn
as vintage one-colour engraved shop signs so they pass as real lumber-mill / mountain-lodge merch to
anyone who doesn't know. No logos, no characters, no box art. Working brand name: **Elsewhere Supply Co.**
(placeholder; everything brand-related is in `src/lib/site.ts`).

Owner: Andreas, a teacher in Western Australia running this alongside a full-time job. Optimise for
"runs itself" over "feature-rich".

## Architecture (deliberate — don't replace it)

- Next.js 15 App Router, TypeScript, Tailwind 3. No database, no CMS, no auth.
- Catalogue is code: `src/lib/products.ts`. 12 designs × (hoodie | tee) × colour × size.
- Cart lives in the shopper's browser (`src/lib/cart.tsx`, localStorage). Nothing server-side.
- Payment: Stripe Checkout (hosted page). `src/app/api/checkout/route.ts` rebuilds every price from the
  catalogue server-side — never trust prices from the browser. GST is inclusive.
- Fulfilment: Printful print-on-demand. `src/app/api/webhooks/stripe/route.ts` receives
  `checkout.session.completed`, checks Printful for a duplicate (`external_id` = Stripe session id),
  then creates the Printful order. Draft unless `PRINTFUL_AUTO_CONFIRM=true`. Return 500 only when a
  Stripe retry could help.
- Shipping: flat rates per zone in `src/lib/shipping.ts`; the shopper picks a country in the cart and
  Stripe's address form is locked to it.
- Every purchasable size needs a Printful `sync_variant_id` in `variantIds`; `null` = "coming soon".
  `npm run printful:variants` lists them.

The decision to build custom rather than Shopify was made knowingly (owner dislikes platform fees).
Do not suggest moving to Shopify. Do not add a database unless a feature genuinely can't work without one.

## Design system (keep it)

- Palette in `tailwind.config.ts`: `charcoal #1C1A17` page, `flannel #2A2723` raised, `bone #E8DFC8` text,
  `faded #A69E8A` secondary, `olive #7A7F4E` the one accent (from the ad that inspired the brand),
  `rust #A5552E` reserved for cream-tee designs. These are the garments' own colours, not a theme.
- One typeface: Fraunces via `next/font`, with optical-size variation doing the hierarchy
  (`.display`, `.display-soft`, `.sign`, `.small` in `globals.css`). Do not add a second font.
- No cards, no drop shadows, no borders as decoration, no gradient washes, no icons for their own sake,
  no ALL-CAPS eyebrow labels, no "→" on links. Images bleed; spacing does the structure.
- Copy voice: dry outfitter's catalogue. "Ales, beds, poor company." Errors explain and direct, never
  apologise. Buttons say what happens ("Pay with card", "Add to cart").
- Mobile first: most traffic will come from Instagram ads on phones.

## Conventions

- Australian English in all user-facing copy (colour, jumper, organise). Prices AUD, `money()` in
  `src/lib/format.ts`.
- Keep components small and server-rendered unless they need state. Client components are marked.
- SKU format is `productSlug__garmentType__colourSlug__size` (`makeSku` / `resolveSku`). Don't change it —
  it's what's stored in carts and Stripe product metadata.
- Don't hardcode brand strings; import from `site.ts`.
- Owner works iteratively and gives targeted corrections. Do the task asked, report what changed in a
  few lines, don't editorialise or pad.

## First session — do these in order

1. `npm install`, then `npm run build`. Fix any type or lint errors (expect a couple: Stripe v18
   type names, `next/font` Fraunces `axes`, Next 15 async `params`). Don't change behaviour to fix
   types; adjust types.
2. `npm run dev`, open every route (`/`, `/collections/runescape`, `/collections/elder-scrolls`,
   `/products/lumbridge-general-store`, `/cart`, `/about`, `/shipping`, `/privacy`, `/nope`).
   Screenshot desktop and 390px mobile. Fix layout bugs. Report anything that looks off against the
   design system above rather than silently restyling it.
3. Confirm the cart round-trips: add two items, reload, change quantity, change country, remove.
4. With Stripe test keys in `.env.local` and `stripe listen --forward-to localhost:3000/api/webhooks/stripe`,
   complete a test purchase with 4242 4242 4242 4242. Confirm the webhook logs a Printful draft order
   (or a clear "SKU has no Printful variant id" if ids aren't in yet — that's the expected state on day one).
5. Commit. Then stop and report; the owner will give the next round of changes.

## Backlog (only when asked)

- Add real artwork PNGs to `public/products/` (naming in that folder's README) and remove placeholder fallback if desired.
- Fill `variantIds` from `npm run printful:variants` once Printful products exist.
- Branded order/shipping emails (Resend) — Stripe's receipt and Printful's tracking email cover it for launch.
- Size guide table on the product page (measurements from the Printful/AS Colour spec).
- Plausible or Fathom analytics; Meta pixel for ads (owner's marketing runs on Instagram).
- Australian-only collection (Round the Twist, The Castle, Summer Bay) and Redwall as later collections —
  same `Collection` shape.
- Shipping rates calibrated to Printful's actual charges after the first month.

## Legal note (context, not a task)

Designs use in-world place and business names only — no game names printed on garments, no logos,
no characters, original artwork. That's the whole point of the aesthetic and also the brand's legal
posture. Don't add game names, logos or character art to the product images or the site chrome.
The footer disclaimer exists on purpose.
