"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import { MAX_ITEMS, useCart } from "@/lib/cart";
import CartContents from "./CartContents";

// Slide-over cart. Opens on add-to-cart and from the header, so nobody has to
// leave the page they're on to see what they've got or to pay.
export default function CartDrawer() {
  const { drawerOpen, closeDrawer, count, hydrated } = useCart();
  const panel = useRef<HTMLDivElement>(null);
  const path = usePathname();

  // Close on navigation.
  useEffect(() => closeDrawer(), [path, closeDrawer]);

  useEffect(() => {
    if (!drawerOpen) return;
    const prevOverflow = document.documentElement.style.overflow;
    document.documentElement.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && closeDrawer();
    window.addEventListener("keydown", onKey);
    const t = setTimeout(() => panel.current?.querySelector<HTMLElement>("button, a")?.focus({ preventScroll: true }), 60);
    return () => {
      document.documentElement.style.overflow = prevOverflow;
      window.removeEventListener("keydown", onKey);
      clearTimeout(t);
    };
  }, [drawerOpen, closeDrawer]);

  return (
    <div className={`drawer ${drawerOpen ? "is-open" : ""}`} aria-hidden={!drawerOpen} inert={!drawerOpen}>
      <button type="button" className="drawer-scrim" onClick={closeDrawer} aria-label="Close cart" tabIndex={-1} />
      <div ref={panel} className="drawer-panel" role="dialog" aria-modal="true" aria-label="Cart">
        <div className="flex items-baseline justify-between px-5 pb-4 pt-5 sm:px-6">
          <p className="display text-[28px]">
            Inventory{" "}
            <span className="small align-middle tabular-nums text-faded">
              {hydrated ? count : 0} / {MAX_ITEMS}
            </span>
          </p>
          <button type="button" onClick={closeDrawer} className="sweep text-faded hover:text-bone">
            Close
          </button>
        </div>
        {drawerOpen && <CartContents onNavigate={closeDrawer} />}
      </div>
    </div>
  );
}
