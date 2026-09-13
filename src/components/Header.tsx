"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useCart } from "@/lib/cart";
import { collections } from "@/lib/products";
import { site } from "@/lib/site";

export default function Header() {
  const { count, hydrated } = useCart();
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
    ...collections.map((c) => ({ href: `/collections/${c.slug}`, label: c.name })),
    { href: "/about", label: "About" },
  ];

  return (
    <header ref={ref} className={`site-header ${scrolled ? "is-scrolled" : ""}`}>
      <div className="mx-auto w-full max-w-page px-5 sm:px-8">
        <div className="site-header-row flex items-center justify-between gap-6 py-6">
          <Link href="/" className="wordmark text-[26px] text-bone" aria-label={`${site.name} home`}>
            {Array.from(site.wordmark).map((ch, i) => (
              <span key={i} style={{ animationDelay: `${i * 35}ms` }} aria-hidden>
                {ch}
              </span>
            ))}
          </Link>
          <nav className="hidden items-center gap-8 md:flex" aria-label="Main">
            {nav.map((n) => (
              <Link
                key={n.href}
                href={n.href}
                className={`sweep ${path.startsWith(n.href) ? "is-active text-bone" : "text-faded hover:text-bone"}`}
              >
                {n.label}
              </Link>
            ))}
          </nav>
          <Link href="/cart" className="sweep flex items-center gap-2 text-bone" aria-label={`Cart, ${count} items`}>
            <span>Cart</span>
            <span
              className={`small inline-flex min-w-[22px] justify-center rounded-[2px] bg-flannel px-1.5 py-0.5 tabular-nums ${bump ? "badge-bump" : ""}`}
            >
              {hydrated ? count : "–"}
            </span>
          </Link>
        </div>
        <nav className="-mt-2 flex gap-5 pb-4 md:hidden" aria-label="Main">
          {nav.map((n) => (
            <Link key={n.href} href={n.href} className={path.startsWith(n.href) ? "text-bone" : "text-faded"}>
              {n.label}
            </Link>
          ))}
        </nav>
      </div>
    </header>
  );
}
