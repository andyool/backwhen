"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import ProductImage from "./ProductImage";
import SignArt from "./SignArt";
import GarmentMock from "./GarmentMock";
import type { Artwork } from "@/lib/art";
import { products } from "@/lib/products";
import { useCart } from "@/lib/cart";
import { garmentLabel } from "@/lib/products";
import { money } from "@/lib/format";
import { allowedCountries, countryNames, shippingFor } from "@/lib/shipping";
import { isStaticPreview } from "@/lib/paths";

const COUNTRY_KEY = "backwhen-country";

export default function CartView({ artwork }: { artwork: Record<string, Artwork> }) {
  const { lines, subtotalCents, setQty, remove, hydrated, items } = useCart();
  const [country, setCountry] = useState("AU");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    try {
      const saved = window.localStorage.getItem(COUNTRY_KEY);
      if (saved && allowedCountries.includes(saved)) setCountry(saved);
    } catch {}
  }, []);

  function chooseCountry(c: string) {
    setCountry(c);
    try {
      window.localStorage.setItem(COUNTRY_KEY, c);
    } catch {}
  }

  const shipping = shippingFor(country, subtotalCents);
  const totalCents = subtotalCents + (shipping?.rateCents ?? 0);

  async function checkout() {
    setBusy(true);
    setError(null);
    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ items, country }),
      });
      const data = (await res.json()) as { url?: string; error?: string };
      if (!res.ok || !data.url) throw new Error(data.error ?? "Couldn't start checkout.");
      window.location.assign(data.url);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Couldn't start checkout.");
      setBusy(false);
    }
  }

  if (!hydrated) return <p className="text-faded">Loading your cart…</p>;

  if (lines.length === 0) {
    return (
      <div className="max-w-[48ch]">
        <p className="text-[20px]">Nothing in here yet.</p>
        <p className="mt-2 text-faded">Pick a place to start.</p>
        <Link href="/" className="btn-ghost mt-6">
          Browse the collections
        </Link>
      </div>
    );
  }

  return (
    <div className="grid gap-12 lg:grid-cols-[3fr_2fr] lg:gap-16">
      <ul className="flex flex-col gap-8">
        {lines.map((l) => (
          <li key={l.sku} className="grid grid-cols-[96px_1fr] gap-5 sm:grid-cols-[128px_1fr]" data-reveal>
            <Link href={`/products/${l.product.slug}`}>
              <ProductImage
                src={l.garment.image}
                alt=""
                sizes="128px"
                fallback={
                  artwork[l.product.slug]?.print || artwork[l.product.slug]?.raw ? (
                    <GarmentMock artwork={artwork[l.product.slug]} colour={l.garment.colour} type={l.garment.type} alt="" sizes="128px" />
                  ) : (
                  <SignArt
                    name={l.product.name}
                    place={l.product.place}
                    printLines={l.product.printLines}
                    colour={l.garment.colour}
                    type={l.garment.type}
                    variant={products.findIndex((p) => p.slug === l.product.slug)}
                  />
                  )
                }
              />
            </Link>
            <div className="flex flex-col">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <Link href={`/products/${l.product.slug}`} className="text-[19px] leading-tight hover:underline underline-offset-4">
                    {l.product.name}
                  </Link>
                  <p className="small mt-1 text-faded">
                    {garmentLabel[l.garment.type]}, {l.garment.colour.name.toLowerCase()}, {l.size}
                  </p>
                </div>
                <p className="tabular-nums">{money(l.lineTotalCents)}</p>
              </div>
              <div className="mt-auto flex items-center gap-4 pt-4">
                <div className="inline-flex items-center rounded-[2px] bg-flannel" aria-label={`Quantity for ${l.product.name}`}>
                  <button type="button" className="px-3 py-1.5 text-faded hover:text-bone" onClick={() => setQty(l.sku, l.qty - 1)} aria-label="Decrease quantity">
                    −
                  </button>
                  <span className="min-w-[28px] text-center tabular-nums">{l.qty}</span>
                  <button type="button" className="px-3 py-1.5 text-faded hover:text-bone" onClick={() => setQty(l.sku, l.qty + 1)} aria-label="Increase quantity">
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
      </ul>

      <aside className="h-fit bg-flannel p-6 sm:p-8 lg:sticky lg:top-28" data-reveal style={{ ["--d" as string]: "150ms" }}>
        <h2 className="text-[22px]">Summary</h2>

        <label className="mt-6 block">
          <span className="small text-faded">Shipping to</span>
          <select
            className="mt-1 w-full rounded-[2px] bg-charcoal px-3 py-2.5 text-bone"
            value={country}
            onChange={(e) => chooseCountry(e.target.value)}
          >
            {allowedCountries.map((c) => (
              <option key={c} value={c}>
                {countryNames[c] ?? c}
              </option>
            ))}
          </select>
        </label>

        <dl className="mt-6 flex flex-col gap-2 tabular-nums">
          <div className="flex justify-between">
            <dt className="text-faded">Subtotal</dt>
            <dd>{money(subtotalCents)}</dd>
          </div>
          <div className="flex justify-between">
            <dt className="text-faded">Shipping</dt>
            <dd>{shipping ? (shipping.rateCents === 0 ? "Free" : money(shipping.rateCents)) : "—"}</dd>
          </div>
          {shipping?.zone.freeOverCents && shipping.rateCents > 0 && (
            <p className="small text-faded">
              Free shipping over {money(shipping.zone.freeOverCents)} — add {money(shipping.zone.freeOverCents - subtotalCents)} more.
            </p>
          )}
          <div className="mt-2 flex justify-between border-t border-seam pt-3 text-[20px]">
            <dt>Total</dt>
            <dd>{money(totalCents)}</dd>
          </div>
        </dl>
        <p className="small mt-2 text-faded">GST included. {shipping ? `Delivery ${shipping.zone.estimate} after printing.` : ""}</p>

        {isStaticPreview ? (
          <p className="small mt-6 rounded-[2px] bg-charcoal p-4 text-faded">
            This is the preview build. Card checkout switches on at launch; until then your cart is saved in this browser.
          </p>
        ) : (
          <button type="button" className="btn-primary mt-6 w-full" onClick={checkout} disabled={busy || !shipping}>
            {busy ? "Opening secure checkout…" : "Pay with card"}
          </button>
        )}
        {error && (
          <p className="small mt-3 text-[#E3A28A]" role="alert">
            {error}
          </p>
        )}
        <p className="small mt-4 text-faded">Card details are entered on Stripe&rsquo;s secure page and never touch this site.</p>
      </aside>
    </div>
  );
}
