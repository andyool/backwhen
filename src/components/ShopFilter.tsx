"use client";

import { useEffect, useState, type ReactNode } from "react";
import { GARMENT_PREF_KEY } from "@/lib/prefs";

type Option = { key: string; label: string; count: number };

// Filter chips and a hoodie/tee switch over a server-rendered grid. Only data
// attributes change; CSS does the hiding, so nothing re-renders.
export default function ShopFilter({
  filters,
  prices,
  children,
}: {
  /** Collection chips; leave empty for a single collection */
  filters: Option[];
  prices: { hoodie: string; tee: string };
  children: ReactNode;
}) {
  const [filter, setFilter] = useState("all");
  const [garment, setGarment] = useState<"hoodie" | "tee">("hoodie");

  useEffect(() => {
    try {
      const saved = sessionStorage.getItem(GARMENT_PREF_KEY);
      if (saved === "tee" || saved === "hoodie") setGarment(saved);
    } catch {}
  }, []);

  function pick(g: "hoodie" | "tee") {
    setGarment(g);
    try {
      sessionStorage.setItem(GARMENT_PREF_KEY, g);
    } catch {}
  }

  return (
    <div>
      <div className="mb-8 flex flex-wrap items-center justify-between gap-x-6 gap-y-4 sm:mb-10">
        {filters.length > 0 && (
          <div className="no-scrollbar -mx-5 flex gap-2 overflow-x-auto px-5 sm:mx-0 sm:px-0" role="group" aria-label="Filter by world">
            {filters.map((f) => (
              <button key={f.key} type="button" onClick={() => setFilter(f.key)} aria-pressed={filter === f.key} className="chip pop">
                {f.label} <span className="tabular-nums text-faded">{f.count}</span>
              </button>
            ))}
          </div>
        )}
        <div className="segmented" role="group" aria-label="Garment">
          <button type="button" onClick={() => pick("hoodie")} aria-pressed={garment === "hoodie"}>
            Hoodies <span className="tabular-nums">{prices.hoodie}</span>
          </button>
          <button type="button" onClick={() => pick("tee")} aria-pressed={garment === "tee"}>
            Tees <span className="tabular-nums">{prices.tee}</span>
          </button>
          <span className="segmented-thumb" data-pos={garment} aria-hidden />
        </div>
      </div>
      <div className="shop-filter" data-filter={filter} data-garment={garment}>
        {filters.length > 0 && (
          <style>
            {filters
              .filter((f) => f.key !== "all")
              .map((f) => `.shop-filter[data-filter="${f.key}"] .shop-cell:not([data-collection="${f.key}"]){display:none}`)
              .join("")}
          </style>
        )}
        {children}
      </div>
    </div>
  );
}
