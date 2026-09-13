"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useCart } from "@/lib/cart";
import { collections } from "@/lib/products";
import { site } from "@/lib/site";

export default function Header() {
  const { count, hydrated } = useCart();
  const path = usePathname();

  const nav = [
    ...collections.map((c) => ({ href: `/collections/${c.slug}`, label: c.name })),
    { href: "/about", label: "About" },
  ];

  return (
    <header className="mx-auto w-full max-w-page px-5 sm:px-8">
      <div className="flex items-center justify-between gap-6 py-6">
        <Link href="/" className="sign text-[13px] text-bone">
          {site.name}
        </Link>
        <nav className="hidden items-center gap-7 md:flex" aria-label="Main">
          {nav.map((n) => (
            <Link
              key={n.href}
              href={n.href}
              className={path.startsWith(n.href) ? "text-bone" : "text-faded hover:text-bone"}
            >
              {n.label}
            </Link>
          ))}
        </nav>
        <Link href="/cart" className="flex items-center gap-2 text-bone" aria-label={`Cart, ${count} items`}>
          <span>Cart</span>
          <span className="small inline-flex min-w-[22px] justify-center rounded-[2px] bg-flannel px-1.5 py-0.5 tabular-nums">
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
    </header>
  );
}
