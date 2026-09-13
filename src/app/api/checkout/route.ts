import { NextResponse } from "next/server";
import type Stripe from "stripe";
import { stripe } from "@/lib/stripe";
import { resolveSku, garmentLabel } from "@/lib/products";
import { shippingFor, zoneForCountry } from "@/lib/shipping";
import { site, siteUrl } from "@/lib/site";

type Body = { items?: { sku: string; qty: number }[]; country?: string };

export async function POST(req: Request) {
  let body: Body;
  try {
    body = (await req.json()) as Body;
  } catch {
    return NextResponse.json({ error: "Request body must be JSON." }, { status: 400 });
  }

  const country = (body.country ?? "").toUpperCase();
  if (!zoneForCountry(country)) {
    return NextResponse.json({ error: "We don't ship to that country yet." }, { status: 400 });
  }

  const items = (body.items ?? []).filter((i) => i && typeof i.sku === "string" && Number.isInteger(i.qty) && i.qty > 0);
  if (items.length === 0) {
    return NextResponse.json({ error: "Your cart is empty." }, { status: 400 });
  }

  // Never trust prices from the browser: rebuild every line from the catalogue.
  const lineItems: Stripe.Checkout.SessionCreateParams.LineItem[] = [];
  let subtotalCents = 0;
  for (const item of items) {
    const r = resolveSku(item.sku);
    if (!r) return NextResponse.json({ error: `Unknown item: ${item.sku}` }, { status: 400 });
    if (r.printfulVariantId === null) {
      return NextResponse.json(
        { error: `${r.product.name} (${garmentLabel[r.garment.type]}, ${r.size}) isn't available yet.` },
        { status: 400 },
      );
    }
    const qty = Math.min(10, item.qty);
    subtotalCents += r.garment.priceCents * qty;
    lineItems.push({
      quantity: qty,
      price_data: {
        currency: "aud",
        unit_amount: r.garment.priceCents,
        // GST is included in the price; Stripe just needs to know it's inclusive.
        tax_behavior: "inclusive",
        product_data: {
          name: r.product.name,
          description: `${garmentLabel[r.garment.type]} · ${r.garment.colour.name} · ${r.size}`,
          images: [`${siteUrl()}${r.garment.image}`],
          metadata: { sku: r.sku, printful_variant_id: String(r.printfulVariantId) },
        },
      },
    });
  }

  const shipping = shippingFor(country, subtotalCents);
  if (!shipping) return NextResponse.json({ error: "We don't ship to that country yet." }, { status: 400 });

  let session: Stripe.Checkout.Session;
  try {
    session = await stripe().checkout.sessions.create({
      mode: "payment",
      line_items: lineItems,
      currency: "aud",
      // Lock the address country to the one used to quote shipping.
      shipping_address_collection: { allowed_countries: [country as Stripe.Checkout.SessionCreateParams.ShippingAddressCollection.AllowedCountry] },
      shipping_options: [
        {
          shipping_rate_data: {
            type: "fixed_amount",
            display_name:
              shipping.rateCents === 0 ? `Free shipping to ${shipping.zone.label}` : `Shipping to ${shipping.zone.label}`,
            fixed_amount: { amount: shipping.rateCents, currency: "aud" },
            delivery_estimate: deliveryEstimate(shipping.zone.estimate),
          },
        },
      ],
      phone_number_collection: { enabled: true },
      allow_promotion_codes: true,
      billing_address_collection: "auto",
      success_url: `${siteUrl()}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${siteUrl()}/cart`,
      metadata: { site: site.shortName, country },
      // Printful's order is created by the webhook, so the session id is our order reference.
    });
  } catch (e) {
    console.error("[checkout] Stripe error", e);
    return NextResponse.json({ error: "Couldn't start checkout. Try again in a moment." }, { status: 502 });
  }

  return NextResponse.json({ url: session.url });
}

// "4–8 business days" -> Stripe's delivery estimate shape
function deliveryEstimate(text: string): Stripe.Checkout.SessionCreateParams.ShippingOption.ShippingRateData.DeliveryEstimate | undefined {
  const m = text.match(/(\d+)\D+(\d+)/);
  if (!m) return undefined;
  return {
    minimum: { unit: "business_day", value: Number(m[1]) },
    maximum: { unit: "business_day", value: Number(m[2]) },
  };
}
