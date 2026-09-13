import { NextResponse } from "next/server";
import type Stripe from "stripe";
import { stripe } from "@/lib/stripe";
import { resolveSku } from "@/lib/products";
import { createOrder, getOrderByExternalId, type PrintfulOrderItem, type PrintfulRecipient } from "@/lib/printful";
import { site } from "@/lib/site";

// Stripe -> (payment succeeded) -> this route -> Printful order.
// Register the endpoint at /api/webhooks/stripe for the event
// `checkout.session.completed`. Stripe retries on non-2xx, so we only
// return an error when retrying could help.

export async function POST(req: Request) {
  const secret = process.env.STRIPE_WEBHOOK_SECRET;
  if (!secret) return NextResponse.json({ error: "STRIPE_WEBHOOK_SECRET not set" }, { status: 500 });

  const signature = req.headers.get("stripe-signature");
  if (!signature) return NextResponse.json({ error: "Missing signature" }, { status: 400 });

  let event: Stripe.Event;
  try {
    const raw = await req.text();
    event = stripe().webhooks.constructEvent(raw, signature, secret);
  } catch (e) {
    console.error("[webhook] bad signature", e);
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  if (event.type !== "checkout.session.completed") {
    return NextResponse.json({ received: true, ignored: event.type });
  }

  const session = event.data.object;
  if (session.payment_status !== "paid") {
    return NextResponse.json({ received: true, ignored: "not paid" });
  }

  try {
    // Idempotency: Stripe may deliver the same event more than once.
    const existing = await getOrderByExternalId(session.id);
    if (existing) return NextResponse.json({ received: true, printful_order: existing.id, duplicate: true });

    const recipient = recipientFrom(session);
    if (!recipient) {
      console.error("[webhook] session has no shipping details", session.id);
      // Retrying won't add an address. Acknowledge and flag for manual handling.
      return NextResponse.json({ received: true, error: "no shipping details" });
    }

    const items = await printfulItemsFrom(session.id);
    if (items.length === 0) {
      console.error("[webhook] no mappable line items", session.id);
      return NextResponse.json({ received: true, error: "no items" });
    }

    const order = await createOrder({
      externalId: session.id,
      recipient,
      items,
      confirm: process.env.PRINTFUL_AUTO_CONFIRM === "true",
      packingSlipMessage: `Thanks for your order from ${site.name}.`,
    });

    console.log(`[webhook] Printful order ${order.id} (${order.status}) for session ${session.id}`);
    return NextResponse.json({ received: true, printful_order: order.id });
  } catch (e) {
    console.error("[webhook] Printful error", e);
    // 500 => Stripe will retry with backoff, which is what we want for transient Printful failures.
    return NextResponse.json({ error: "Printful order failed" }, { status: 500 });
  }
}

function recipientFrom(session: Stripe.Checkout.Session): PrintfulRecipient | null {
  // Newer API versions put the address under collected_information; older ones under shipping_details.
  type Details = { name?: string | null; address?: Stripe.Address | null } | null | undefined;
  const details: Details =
    session.collected_information?.shipping_details ??
    (session as unknown as { shipping_details?: Details }).shipping_details ??
    null;
  const addr = details?.address;
  if (!details || !addr?.line1 || !addr.city || !addr.country || !addr.postal_code) return null;
  return {
    name: details.name ?? session.customer_details?.name ?? "Customer",
    address1: addr.line1,
    address2: addr.line2 ?? undefined,
    city: addr.city,
    state_code: addr.state ?? undefined,
    country_code: addr.country,
    zip: addr.postal_code,
    email: session.customer_details?.email ?? undefined,
    phone: session.customer_details?.phone ?? undefined,
  };
}

async function printfulItemsFrom(sessionId: string): Promise<PrintfulOrderItem[]> {
  const lineItems = await stripe().checkout.sessions.listLineItems(sessionId, {
    limit: 100,
    expand: ["data.price.product"],
  });
  const items: PrintfulOrderItem[] = [];
  for (const li of lineItems.data) {
    const product = li.price?.product;
    const sku = typeof product === "object" && product && "metadata" in product ? product.metadata?.sku : undefined;
    if (!sku) continue;
    const r = resolveSku(sku);
    const variantId = r?.printfulVariantId;
    if (!r || !variantId) {
      console.error("[webhook] SKU has no Printful variant id", sku);
      continue;
    }
    items.push({
      sync_variant_id: variantId,
      quantity: li.quantity ?? 1,
      retail_price: (r.garment.priceCents / 100).toFixed(2),
      name: `${r.product.name} — ${r.garment.type} ${r.garment.colour.name} ${r.size}`,
    });
  }
  return items;
}
