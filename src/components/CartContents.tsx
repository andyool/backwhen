"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { MAX_ITEMS, useCart } from "@/lib/cart";
import { garmentLabel, makeSku, resolveSku } from "@/lib/products";
import { money } from "@/lib/format";
import { allowedCountries, countryNames, initialCountry, saveCountry, shippingFor, zoneForCountry } from "@/lib/shipping";
import { asset, isStaticPreview } from "@/lib/paths";
import { readAttribution } from "@/lib/attribution";
import { track } from "@/lib/track";
import { say } from "@/lib/say";

// The cart, used both in the slide-over drawer and on /cart. Lines, a
// "complete the set" nudge, free-shipping progress, country, one button to pay.
export default function CartContents({ onNavigate }: { onNavigate?: () => void }) {
  const { lines, subtotalCents, setQty, remove, add, hydrated, items, count, lastAdded } = useCart();
  const [country, setCountry] = useState("AU");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => setCountry(initialCountry()), []);

  const shipping = shippingFor(country, subtotalCents);
  const zone = zoneForCountry(country);
  const totalCents = subtotalCents + (shipping?.rateCents ?? 0);
  const freeOver = zone?.freeOverCents;
  const toFree = freeOver ? Math.max(0, freeOver - subtotalCents) : null;

  // The other garment of the design just added, same size, if it isn't in the cart yet.
  const pairFor = (() => {
    const base = resolveSku(lastAdded ?? lines[lines.length - 1]?.sku ?? "");
    if (!base) return null;
    const other = base.product.garments.find((g) => g.type !== base.garment.type);
    if (!other || other.variantIds[base.size] == null) return null;
    const sku = makeSku(base.product.slug, other, base.size);
    if (items.some((i) => i.sku === sku)) return null;
    return { sku, product: base.product, garment: other, size: base.size };
  })();

  async function checkout() {
    setBusy(true);
    setError(null);
    track("InitiateCheckout", { value: totalCents / 100, num_items: count, content_ids: items.map((i) => i.sku) });
    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ items, country, attribution: readAttribution() }),
      });
      const data = (await res.json()) as { url?: string; error?: string };
      if (!res.ok || !data.url) throw new Error(data.error ?? "Couldn't start checkout. Try again in a moment.");
      window.location.assign(data.url);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Couldn't start checkout. Try again in a moment.");
      setBusy(false);
    }
  }

  if (!hydrated) return <p className="p-6 text-faded">Loading — please wait.</p>;

  if (lines.length === 0) {
    return (
      <div className="flex flex-1 flex-col items-start justify-center gap-4 p-6">
        <p className="display text-[34px]">Your inventory&rsquo;s empty.</p>
        <p className="text-faded">Twelve places. You&rsquo;ll know yours when you see it.</p>
        <Link href="/shop" className="btn-primary mt-2" onClick={onNavigate}>
          Find your place
        </Link>
      </div>
    );
  }

  return (
    <div className="flex min-h-0 flex-1 flex-col">
      {freeOver && (
        <div className="px-5 pb-4 sm:px-6">
          <p className="small text-faded">
            {toFree ? (
              <>
                Add <span className="text-bone">{money(toFree)}</span> for free shipping to {countryNames[country]}.
              </>
            ) : (
              <span className="text-bone">Free shipping to {countryNames[country]}.</span>
            )}
          </p>
          <div className="mt-2 h-[3px] w-full bg-seam" aria-hidden>
            <div className="h-full bg-olive transition-[width] duration-700" style={{ width: `${Math.min(100, (subtotalCents / freeOver) * 100)}%` }} />
          </div>
        </div>
      )}

      <ul className="flex min-h-0 flex-1 flex-col gap-5 overflow-y-auto overscroll-contain px-5 py-2 sm:px-6" data-native-scroll>
        {lines.map((l) => (
          <li key={l.sku} className="grid grid-cols-[76px_1fr] gap-4">
            <Link href={`/products/${l.product.slug}`} onClick={onNavigate} className="relative block aspect-square overflow-hidden bg-flannel">
              <Image src={asset(l.garment.image)} alt="" fill sizes="76px" className="object-contain p-1" />
            </Link>
            <div className="flex min-w-0 flex-col">
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <Link href={`/products/${l.product.slug}`} onClick={onNavigate} className="block truncate leading-tight hover:underline underline-offset-4">
                    {l.product.name}
                  </Link>
                  <p className="small mt-0.5 text-faded">
                    {garmentLabel[l.garment.type]} · {l.size}
                  </p>
                </div>
                <p className="tabular-nums">{money(l.lineTotalCents)}</p>
              </div>
              <div className="mt-2 flex items-center gap-4">
                <div className="inline-flex items-center rounded-[2px] bg-flannel" aria-label={`Quantity for ${l.product.name}`}>
                  <button type="button" className="px-3 py-1 text-faded hover:text-bone" onClick={() => setQty(l.sku, l.qty - 1)} aria-label="Decrease quantity">
                    −
                  </button>
                  <span className="min-w-[22px] text-center tabular-nums">{l.qty}</span>
                  <button
                    type="button"
                    className="px-3 py-1 text-faded hover:text-bone"
                    onClick={() => {
                      if (count >= MAX_ITEMS) say("Not enough inventory space.");
                      else setQty(l.sku, l.qty + 1);
                    }}
                    aria-label="Increase quantity"
                  >
                    +
                  </button>
                </div>
                <button type="button" className="small text-faded hover:text-bone" onClick={() => remove(l.sku)}>
                  Remove
                </button>
              </div>
            </div>
          </li>
        ))}

        {pairFor && (
          <li className="mt-1 grid grid-cols-[76px_1fr] items-center gap-4 rounded-[2px] bg-flannel/60 p-2 pr-3">
            <div className="relative aspect-square">
              <Image src={asset(pairFor.garment.image)} alt="" fill sizes="76px" className="object-contain p-1" />
            </div>
            <div className="flex items-center justify-between gap-3">
              <p className="small leading-snug">
                <span className="text-bone">Complete the set.</span>{" "}
                <span className="text-faded">
                  The matching {pairFor.garment.type === "tee" ? "tee" : "hoodie"} in {pairFor.size}, {money(pairFor.garment.priceCents)}.
                </span>
              </p>
              <button
                type="button"
                className="btn-ghost shrink-0 !px-4 !py-2 !text-[14px]"
                onClick={() => {
                  if (!add(pairFor.sku)) say("Not enough inventory space.");
                  else track("AddToCart", { value: pairFor.garment.priceCents / 100, content_ids: [pairFor.sku], content_name: pairFor.product.name });
                }}
              >
                Add
              </button>
            </div>
          </li>
        )}
      </ul>

      <div className="mt-auto border-t border-seam/70 bg-charcoal px-5 pb-[max(1.25rem,env(safe-area-inset-bottom))] pt-4 sm:px-6">
        <div className="flex items-center justify-between gap-4">
          <label htmlFor="ship-country" className="small text-faded">
            Shipping to
          </label>
          <select
            id="ship-country"
            className="rounded-[2px] bg-flannel px-2 py-1.5 text-[15px] text-bone"
            value={country}
            onChange={(e) => {
              setCountry(e.target.value);
              saveCountry(e.target.value);
            }}
          >
            {allowedCountries.map((c) => (
              <option key={c} value={c}>
                {countryNames[c] ?? c}
              </option>
            ))}
          </select>
        </div>
        <dl className="mt-3 flex flex-col gap-1 tabular-nums">
          <div className="flex justify-between">
            <dt className="text-faded">Subtotal</dt>
            <dd>{money(subtotalCents)}</dd>
          </div>
          <div className="flex justify-between">
            <dt className="text-faded">Shipping{shipping ? `, ${shipping.zone.estimate}` : ""}</dt>
            <dd>{shipping ? (shipping.rateCents === 0 ? "Free" : money(shipping.rateCents)) : "—"}</dd>
          </div>
        </dl>

        {isStaticPreview ? (
          <p className="small mt-4 rounded-[2px] bg-flannel p-4 text-faded">
            This is the preview build. Card checkout switches on at launch; until then your cart is saved in this browser.
          </p>
        ) : (
          <button type="button" className="btn-primary mt-4 w-full !py-4 !text-[17px]" onClick={checkout} disabled={busy || !shipping}>
            {busy ? "Loading — please wait." : `Checkout · ${money(totalCents)}`}
          </button>
        )}
        {error && (
          <p className="small mt-3 text-[#E3A28A]" role="alert">
            {error}
          </p>
        )}
        <p className="small mt-3 text-center text-faded">Apple Pay, Google Pay or card, on Stripe&rsquo;s secure page. GST included.</p>
      </div>
    </div>
  );
}
