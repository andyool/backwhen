"use client";

import { useEffect } from "react";
import { useCart } from "@/lib/cart";
import { track } from "@/lib/track";

// Empties the cart once payment is confirmed and reports the sale to the ad
// pixels (once per order, even if the page is reloaded).
export default function ClearCart({ reference, valueCents }: { reference?: string | null; valueCents?: number | null }) {
  const { clear, hydrated, items } = useCart();
  useEffect(() => {
    if (!hydrated) return;
    const key = `backwhen-tracked-${reference ?? ""}`;
    let seen = false;
    try {
      seen = sessionStorage.getItem(key) === "1";
      sessionStorage.setItem(key, "1");
    } catch {}
    if (!seen && valueCents != null) {
      track("Purchase", { value: valueCents / 100, content_ids: items.map((i) => i.sku), num_items: items.reduce((n, i) => n + i.qty, 0) });
    }
    clear();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [hydrated]);
  return null;
}
