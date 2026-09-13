"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { useCart } from "@/lib/cart";
import { garmentAvailable, garmentLabel, makeSku, type Product } from "@/lib/products";
import { money } from "@/lib/format";

export default function BuyPanel({ product, onGarmentChange }: { product: Product; onGarmentChange?: (index: number) => void }) {
  const { add } = useCart();
  const [garmentIndex, setGarmentIndex] = useState(0);
  const [size, setSize] = useState<string | null>(null);
  const [added, setAdded] = useState(false);

  const garment = product.garments[garmentIndex];
  const available = garmentAvailable(garment);

  const types = useMemo(() => Array.from(new Set(product.garments.map((g) => g.type))), [product]);

  function choose(index: number) {
    setGarmentIndex(index);
    setSize(null);
    setAdded(false);
    onGarmentChange?.(index);
  }

  function addToCart() {
    if (!size) return;
    add(makeSku(product.slug, garment, size));
    setAdded(true);
  }

  const sizeMissing = available && !size;

  return (
    <div className="flex flex-col gap-7">
      <p className="text-[22px] tabular-nums">{money(garment.priceCents)}</p>

      <fieldset>
        <legend className="small mb-2 text-faded">Garment</legend>
        <div className="flex flex-wrap gap-2">
          {types.map((t) => {
            const index = product.garments.findIndex((g) => g.type === t);
            const active = garment.type === t;
            return (
              <button
                key={t}
                type="button"
                onClick={() => choose(index)}
                aria-pressed={active}
                className={`rounded-[2px] px-4 py-2 text-[15px] ${
                  active ? "bg-bone text-charcoal" : "bg-flannel text-bone hover:bg-seam"
                }`}
              >
                {garmentLabel[t]}
              </button>
            );
          })}
        </div>
      </fieldset>

      <fieldset>
        <legend className="small mb-2 text-faded">Colour</legend>
        <div className="flex flex-wrap gap-2">
          {product.garments.map((g, i) =>
            g.type === garment.type ? (
              <button
                key={g.colour.slug}
                type="button"
                onClick={() => choose(i)}
                aria-pressed={i === garmentIndex}
                className={`flex items-center gap-2 rounded-[2px] py-1.5 pl-1.5 pr-3 text-[15px] ${
                  i === garmentIndex ? "bg-bone text-charcoal" : "bg-flannel text-bone hover:bg-seam"
                }`}
              >
                <span className="inline-block h-6 w-6 rounded-[2px]" style={{ background: g.colour.hex }} aria-hidden />
                {g.colour.name}
              </button>
            ) : null,
          )}
        </div>
      </fieldset>

      <fieldset>
        <legend className="small mb-2 text-faded">Size</legend>
        <div className="flex flex-wrap gap-2">
          {garment.sizes.map((s) => {
            const enabled = garment.variantIds[s] !== null;
            return (
              <button
                key={s}
                type="button"
                disabled={!enabled}
                onClick={() => {
                  setSize(s);
                  setAdded(false);
                }}
                aria-pressed={size === s}
                className={`min-w-[52px] rounded-[2px] px-3 py-2 text-[15px] tabular-nums disabled:cursor-not-allowed disabled:text-faded/40 disabled:line-through ${
                  size === s ? "bg-bone text-charcoal" : "bg-flannel text-bone hover:bg-seam"
                }`}
              >
                {s}
              </button>
            );
          })}
        </div>
        <p className="small mt-2 text-faded">Unisex fit. Between sizes? Size up — the fleece doesn't shrink but you'll want the room.</p>
      </fieldset>

      {available ? (
        <div className="flex flex-col gap-3">
          <button type="button" className="btn-primary" onClick={addToCart} disabled={sizeMissing} aria-live="polite">
            {added ? "Added to cart" : sizeMissing ? "Choose a size" : "Add to cart"}
          </button>
          {added && (
            <Link href="/cart" className="link self-start text-[15px]">
              Go to cart
            </Link>
          )}
        </div>
      ) : (
        <p className="small rounded-[2px] bg-flannel p-4 text-faded">
          This one isn't on the press yet. Follow along on Instagram for the release.
        </p>
      )}
    </div>
  );
}
