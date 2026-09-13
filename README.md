# Backwhen — storefront

Next.js 15 + Tailwind, Stripe Checkout for payment, Printful for print-on-demand fulfilment.
No database: the catalogue lives in `src/lib/products.ts`, the cart lives in the shopper's browser,
and every order is a Stripe Checkout Session that a webhook turns into a Printful order.

```
Browser ──► /api/checkout ──► Stripe Checkout (hosted page)
                                     │  checkout.session.completed
                                     ▼
                         /api/webhooks/stripe ──► Printful order (draft or confirmed)
```

## Run it locally

```bash
npm install
cp .env.example .env.local     # fill in the keys
npm run dev                    # http://localhost:3000
```

The site runs without any keys — you just can't check out.

## Artwork and mockups

Three tiers of product image, best available wins:

1. `public/products/<slug>-<hoodie|tee>-<colour>.png` — a Printful photographic mockup.
2. `public/artwork/print/<slug>.png` — the transparent print file, composited onto the garment colour
   by the site (`src/components/GarmentMock.tsx`).
3. A generated engraved-sign placeholder (`src/components/SignArt.tsx`).

```bash
# 1. drop raw designs in public/artwork/<slug>.png, then knock the backgrounds out
npm run artwork:prepare

# 2. once the print files are reachable on a public URL (deploy first), generate Printful mockups
PRINTFUL_API_KEY=... ARTWORK_BASE_URL=https://yourdomain/artwork/print npm run printful:mockups

# find Printful catalog ids if the AS Colour defaults don't match your store
PRINTFUL_API_KEY=... npm run printful:mockups -- --list "as colour"
```

## Wiring up Stripe

1. Get test keys from https://dashboard.stripe.com/test/apikeys → `STRIPE_SECRET_KEY`.
2. Forward webhooks to your machine while developing:
   ```bash
   stripe listen --forward-to localhost:3000/api/webhooks/stripe
   ```
   It prints a `whsec_...` → `STRIPE_WEBHOOK_SECRET`.
3. In production, add an endpoint in the Stripe dashboard for `https://yourdomain/api/webhooks/stripe`,
   subscribed to `checkout.session.completed`, and use its signing secret.
4. Test card: `4242 4242 4242 4242`, any future expiry, any CVC.

Prices are sent to Stripe from the server on every checkout; nothing from the browser is trusted.
GST is treated as included in the price (`tax_behavior: inclusive`).

## Wiring up Printful

1. Create a Printful store (choose "API" as the platform) and an API token with `orders` and `sync_products`
   scopes → `PRINTFUL_API_KEY`.
2. Create a store in Printful (Manual order / API platform) and note its id (`GET /stores`).
3. Run `npm run printful:products` (needs `PRINTFUL_STORE_ID`, `ARTWORK_BASE_URL`, `SITE_BASE_URL`). It
   creates one sync product per design × garment × colour with the print file placed, and writes the
   `sync_variant_id`s into the generated block in `src/lib/products.ts`. Re-running is safe: existing
   products are read, not duplicated. Designs without a print file stay "coming soon".
4. Leave `PRINTFUL_AUTO_CONFIRM=false` at first: orders arrive in Printful as **drafts** you confirm by hand
   after checking them. Flip it to `true` once you trust the pipeline.

Printful charges your card on file when an order is confirmed; you've already been paid by Stripe by then.

## Place requests

Each collection page has a "Missing a place?" field (150 characters, one click). It POSTs JSON to
`NEXT_PUBLIC_REQUEST_ENDPOINT` — create a free form at https://formspree.io, paste its URL as the
`REQUEST_ENDPOINT` repository variable on GitHub (and in `.env.local` for local dev). Until that is set,
the button opens a prefilled email to `site.email` instead.

## Shipping

Flat rates per zone in `src/lib/shipping.ts`. The shopper picks their country in the cart, the rate is
quoted, and Stripe's address form is locked to that country. Adjust the numbers once you've seen
Printful's actual charges for a month.

## Deploy

Push to GitHub, import into Vercel, add the env vars from `.env.example`, set `NEXT_PUBLIC_SITE_URL`
to the real domain. Add the production Stripe webhook after the first deploy so you have the URL.

## Where things live

| Path | What |
|---|---|
| `src/lib/products.ts` | The catalogue: designs, garments, prices, Printful ids |
| `src/lib/shipping.ts` | Shipping zones and rates |
| `src/lib/site.ts` | Brand name, tagline, contact details |
| `src/lib/cart.tsx` | Cart state (localStorage) |
| `src/app/api/checkout` | Builds the Stripe Checkout session |
| `src/app/api/webhooks/stripe` | Turns paid sessions into Printful orders |
| `src/components/` | Header, footer, product grid, buy panel, cart |

## Not done yet (on purpose)

- No email beyond Stripe's receipt and Printful's tracking email. Add Resend if you want branded ones.
- No discount UI — Stripe promotion codes are enabled on the checkout page instead.
- No reviews, no accounts, no analytics. Add Plausible or Fathom in `layout.tsx` when you're ready.
