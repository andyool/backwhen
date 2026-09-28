# CLAUDE.md — project brief for Claude Code

You are continuing a custom e-commerce storefront that was designed and scaffolded in a chat session
(no network there, so it has never been installed or built). Read this file fully before touching code.

## What this is

A nostalgia apparel brand selling hoodies and tees printed with in-world businesses and locations from
old games — the Lumbridge General Store, the Blue Moon Inn, the Seyda Neen Census & Excise Office — drawn
as vintage one-colour engraved shop signs so they pass as real lumber-mill / mountain-lodge merch to
anyone who doesn't know. No logos, no characters, no box art. Brand name: **Backwhen**
(everything brand-related is in `src/lib/site.ts`).

Owner: Andreas, a teacher in Western Australia running this alongside a full-time job. Optimise for
"runs itself" over "feature-rich".

## Architecture (deliberate — don't replace it)

- Next.js 15 App Router, TypeScript, Tailwind 3. No database, no CMS, no auth.
- Catalogue is code: `src/lib/products.ts`. 12 designs × (hoodie | tee) × size. Each design comes in ONE
  colour (`set(slug, colour)`), and the hoodie and tee of a design are always the matching pair from
  `hoodieColours` / `teeColours` (black ↔ faded black, coal ↔ faded coal, ecru ↔ faded bone). Never
  put a cream design on a dark hoodie — the owner asked for the two garments to match (2026-09-13).
- Every garment carries two prints: the big design on the **back**, and the round crest from
  `public/artwork/crest/` small on the **left chest**. Placement geometry lives once in
  `scripts/lib/placement.mjs`, used by both the mockup and the product-creation scripts. Mockups are
  `public/products/<slug>-<type>-<colour>-back.png` and `-front.png` (`Garment.image` = back, the hero
  everywhere; `Garment.imageFront` = front, shown on card hover and the product page's Front view).
- Cart lives in the shopper's browser (`src/lib/cart.tsx`, localStorage). Nothing server-side.
- Payment: Stripe Checkout (hosted page). `src/app/api/checkout/route.ts` rebuilds every price from the
  catalogue server-side — never trust prices from the browser. GST is inclusive.
- Fulfilment: Printful print-on-demand. `src/app/api/webhooks/stripe/route.ts` receives
  `checkout.session.completed`, checks Printful for a duplicate (`external_id` = Stripe payment intent id; Printful caps it at 32 chars),
  then creates the Printful order. Draft unless `PRINTFUL_AUTO_CONFIRM=true`. Return 500 only when a
  Stripe retry could help.
- Shipping: flat rates per zone in `src/lib/shipping.ts`; the shopper picks a country in the cart and
  Stripe's address form is locked to it.
- Every purchasable size needs a Printful `sync_variant_id`; `null` = "coming soon". The ids live in the
  generated `PRINTFUL_VARIANTS` block in `products.ts`, written by `npm run printful:products` (which
  also creates the sync products in the store from the print files). Don't hand-edit that block.

The decision to build custom rather than Shopify was made knowingly (owner dislikes platform fees).
Do not suggest moving to Shopify. Do not add a database unless a feature genuinely can't work without one.

## Design system (keep it)

- Palette in `tailwind.config.ts`: `charcoal #1C1A17` page, `flannel #2A2723` raised, `bone #E8DFC8` text,
  `faded #A69E8A` secondary, `olive #7A7F4E` the one accent (from the ad that inspired the brand),
  `rust #A5552E` reserved for cream-tee designs. These are the garments' own colours, not a theme.
- One typeface: Fraunces via `next/font`, with optical-size variation doing the hierarchy
  (`.display`, `.display-soft`, `.sign`, `.small` in `globals.css`). Do not add a second font.
- Restraint rules loosened in the 2026-09-28 overhaul (owner asked for a complete redesign for
  clarity, speed and wow): the garment tiles use a soft radial spotlight (`.tile`, `.product-card
  .card-img`), the hero garment floats with a drop shadow, filter chips are pill-shaped. Still: no
  icons for their own sake, no ALL-CAPS eyebrow labels, spacing does the structure.
- Conversion layer (2026-09-28 overhaul — keep it, it's why the site exists): product first, above the
  fold on a phone. Home = `HeroStage` (garment on a CSS-3D turntable that turns to the next design every
  3.4s, swipeable, ticks) → `ShopFilter` grid (collection chips + Hoodies/Tees switch; server-rendered
  cards carry both garments and CSS hides one via `data-garment`/`data-g`, so the switch never
  re-renders) → insight line → `Loupe` artwork → how it works → `Faq` → closing. `/shop` lists all 12.
  Product page: swipe rail gallery (desktop grid), Hoodie/Tee options with prices, sizes, size guide
  (`src/lib/sizes.ts`, cm from Printful's tables), trust ticks, Web Share button, accordions, and a
  sticky `.buybar` on phones. Add to cart opens `CartDrawer` (slide-over; `CartContents` is shared with
  `/cart`): free-shipping progress, "complete the set" (the other garment of the last-added design in
  the same size, one tap), country auto-guessed from time zone (`initialCountry`), one Checkout button.
  The shop's garment choice persists in sessionStorage (`GARMENT_PREF_KEY`) and product pages open on
  it; `?g=tee` in a link forces the tee (use it in tee ads).
- Ads plumbing: `Analytics.tsx` loads the Meta / TikTok pixels only when `NEXT_PUBLIC_META_PIXEL_ID` /
  `NEXT_PUBLIC_TIKTOK_PIXEL_ID` are set; `track()` in `src/lib/track.ts` sends ViewContent, AddToCart,
  InitiateCheckout, Purchase (success page, once per order). `src/lib/attribution.ts` keeps utm_* and
  click ids for 30 days and the checkout route writes them into the Stripe session metadata, so every
  sale shows its campaign in the Stripe dashboard. Share images live in `public/og/`
  (`node scripts/make-og.mjs` after adding designs).
- Motion layer: everything lives in `src/components/fx/` and `globals.css`, no animation libraries.
  `Fog` (WebGL contour-line field behind the hero and 404), `SplitText` + `RevealObserver`
  (`data-reveal` attribute + `--d` delay drives scroll reveals below the fold), `.hero-in` (pure-CSS
  entrance for anything above the fold — never hide first-screen content behind JS), `Tilt` on cards,
  `Magnetic` buttons, `Marquee`, `DrawSign` (about page), film grain via `body::after`, a 0.35s page
  fade. Removed in the overhaul because they cost ad traffic time or felt laggy: the session
  preloader, the inertial `SmoothScroll`, the page wipe, the scroll progress bar, `Parallax`,
  `Counter`. Don't bring them back. All motion respects `prefers-reduced-motion`. Performance rule
  learned the hard way: nothing may change per scroll frame on large layers (no skew-with-velocity, no
  animated or blended full-page grain, no live SVG `feTurbulence` filters on cards — cloth texture is a
  tiled data-URI image via `.cloth`). `SignArt` renders a generated engraved-sign mock-up on the
  garment colour whenever the artwork PNG is missing (`src/lib/art.ts` checks the disk server-side).
- Nods (added 2026-09-13 at the owner's request: "if you know, you know", through design and function, never
  franchise words). Keep them, add more in the same spirit, never name a game. Right-click on anything
  with `data-examine` opens a "Choose option" menu (Wear / Examine / Walk here / Cancel, `ChooseOption`);
  Examine and other one-liners print in the bottom-left `Chatbox` via `say()`. Product cards show a
  "Wear <name>" hover label (verb then target). Clicks flash a small X (`ClickMarker`: yellow on ground,
  red on something usable). The cart is "Inventory" and holds 28 items (`MAX_ITEMS`, shown as n / 28),
  overflow says "Not enough inventory space." Product stories are `Dialogue`: phrases in `topics` open a
  reply beneath. A faint `Compass` strip along the bottom (desktop) turns with scroll, markers from
  `data-compass`. The checkout button reads "Loading — please wait." while Stripe opens. The giant
  footer wordmark says "Nothing interesting happens." on click. 404 says "You can't reach that."
  `examine` and `topics` live per product in `products.ts`; write new ones in the same dry voice.
- Copy approach (rewritten 2026-09-28 at the owner's request): everything is built on "if you know, you
  know" (the site tagline). Talk to the person who was there, in the second person; never explain the
  reference, never say "game", never name one. Outsiders are "everyone else" and the joke is that they
  see a nice old lodge hoodie. Each product has `line` (what it means to you), `cover` (what everyone
  else assumes it is — shown as "They'll think: … You'll know." and in the home page's "Two ways to read a
  hoodie"), and `story` (a memory, not a product description). Collections are shown by their in-world
  names (Gielinor, Tamriel; slugs `gielinor` / `tamriel`, old `/collections/runescape` and
  `/collections/elder-scrolls` redirect in next.config.ts). Still a dry outfitter's voice: short
  sentences, understated. Functional facts (price, shipping, sizing, returns) stay plain and exact.
  Buttons say what happens ("Find your place", "Add to cart").
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

- Generate Printful mockups into `public/products/` with `npm run printful:mockups` once the site is
  deployed (needs a public URL for `public/artwork/print/`). All twelve designs landed 2026-09-13 in
  `public/artwork/` (crests in `public/artwork/crest/`) with Printful mockups in `public/products/`.
  Image tiers: Printful mockup → composited print file (`GarmentMock`, `side="front"|"back"`) →
  generated `SignArt`. After changing artwork or placement: `npm run artwork:prepare`, push (Pages
  hosts the print files), delete the affected mockups and re-run `printful:mockups`, then
  `npm run printful:products -- --recreate` (and `--prune` if a garment's colour changed).
- All 24 sync products (12 designs × hoodie/tee) exist in store "backwhen" (18747782) since 2026-09-13, created from
  ~1000px print files — replace with 3000px+ artwork before real orders (re-upload via Printful
  dashboard or delete + re-run `printful:products`). Tee colour "black" is
  AS Colour "Faded black" (slug unchanged); hoodie sizes stop at 2XL. Printful account has
  stores 9110344 ("Personal orders", native — used for mockups) and 9112209 (Etsy); make a proper API
  store for Backwhen orders. Mockup garments: AS Colour 5101 hoodie (#484), AS Colour 5082 oversized
  faded tee (#713); no 5080 heavy tee in Printful's catalogue.
- Branded order/shipping emails (Resend) — Stripe's receipt and Printful's tracking email cover it for launch.
- Meta Conversions API (server-side Purchase from the Stripe webhook) once the pixel is live — needs
  a CAPI access token; improves attribution when iOS blocks the browser pixel.
- Australian-only collection (Round the Twist, The Castle, Summer Bay) and Redwall as later collections —
  same `Collection` shape.
- Shipping rates calibrated to Printful's actual charges after the first month.

## Legal note (context, not a task)

Designs use in-world place and business names only — no game names printed on garments, no logos,
no characters, original artwork. That's the whole point of the aesthetic and also the brand's legal
posture. Don't add game names, logos or character art to the product images or the site chrome.
The footer disclaimer exists on purpose.
