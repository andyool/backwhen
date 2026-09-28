"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useCart } from "@/lib/cart";
import { collections } from "@/lib/products";
import { zones } from "@/lib/shipping";
import { money } from "@/lib/format";
import { site } from "@/lib/site";

const freeAu = zones.find((z) => z.id === "au")?.freeOverCents;

export default function Header() {
  const { count, hydrated, openDrawer } = useCart();
  const path = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [bump, setBump] = useState(false);
  const prev = useRef(count);
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    const el = ref.current!;
    const ro = new ResizeObserver(() => {
      document.documentElement.style.setProperty("--header-h", `${el.offsetHeight}px`);
    });
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (hydrated && count !== prev.current) {
      prev.current = count;
      setBump(true);
      const t = setTimeout(() => setBump(false), 520);
      return () => clearTimeout(t);
    }
  }, [count, hydrated]);

  const nav = [
    { href: "/shop", label: "Shop all" },
    ...collections.map((c) => ({ href: `/collections/${c.slug}`, label: c.name })),
    { href: "/about", label: "Why no logos" },
  ];

  return (
    <>
      <p className="announce">
        <span>
          No logos. Nothing explained.<span className="announce-extra"> At your door in about a week.</span>
        </span>
        {freeAu && <span className="announce-extra">Free shipping in Australia over {money(freeAu)}</span>}
      </p>
      <header ref={ref} className={`site-header ${scrolled ? "is-scrolled" : ""}`}>
        <div className="mx-auto flex w-full max-w-page items-center justify-between gap-6 px-5 py-3.5 sm:px-8 sm:py-4">
          <Link href="/" className="wordmark text-[26px] text-bone" aria-label={`${site.name} home`}>
            {Array.from(site.wordmark).map((ch, i) => (
              <span key={i} style={{ animationDelay: `${i * 35}ms` }} aria-hidden>
                {ch}
              </span>
            ))}
          </Link>
          <nav className="hidden items-center gap-8 lg:flex" aria-label="Main">
            {nav.map((n) => (
              <Link key={n.href} href={n.href} className={`sweep ${path.startsWith(n.href) ? "is-active text-bone" : "text-faded hover:text-bone"}`}>
                {n.label}
              </Link>
            ))}
          </nav>
          <div className="flex items-center gap-5">
            <Link href="/shop" className={`sweep lg:hidden ${path.startsWith("/shop") ? "text-bone" : "text-faded"}`}>
              Shop
            </Link>
            <button type="button" onClick={openDrawer} className="flex items-center gap-2 text-bone" aria-label={`Cart, ${count} items`}>
              <span className="sweep">Cart</span>
              <span className={`cart-count small tabular-nums ${count > 0 ? "has-items" : ""} ${bump ? "badge-bump" : ""}`}>{hydrated ? count : 0}</span>
            </button>
          </div>
        </div>
      </header>
    </>
  );
}
