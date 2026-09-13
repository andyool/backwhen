import Link from "next/link";
import { site } from "@/lib/site";
import { collections } from "@/lib/products";

export default function Footer() {
  return (
    <footer className="mt-24 bg-flannel">
      <div className="mx-auto grid w-full max-w-page gap-10 px-5 py-14 sm:px-8 md:grid-cols-[2fr_1fr_1fr]">
        <div>
          <p className="sign text-[13px]">{site.name}</p>
          <p className="mt-4 max-w-[40ch] text-faded">{site.tagline} Printed to order, shipped from the nearest print house to you.</p>
        </div>
        <div className="flex flex-col gap-2">
          {collections.map((c) => (
            <Link key={c.slug} href={`/collections/${c.slug}`} className="text-faded hover:text-bone">
              {c.name}
            </Link>
          ))}
          <Link href="/about" className="text-faded hover:text-bone">About</Link>
        </div>
        <div className="flex flex-col gap-2">
          <Link href="/shipping" className="text-faded hover:text-bone">Shipping &amp; returns</Link>
          <Link href="/privacy" className="text-faded hover:text-bone">Privacy</Link>
          <a href={`mailto:${site.email}`} className="text-faded hover:text-bone">{site.email}</a>
          <a href={site.instagram} className="text-faded hover:text-bone" rel="noreferrer">Instagram</a>
        </div>
      </div>
      <div className="mx-auto w-full max-w-page px-5 pb-8 sm:px-8">
        <p className="small text-faded/70">
          Prices in AUD, GST included. {site.abn ? `ABN ${site.abn}. ` : ""}
          Made in Western Australia. Not affiliated with any game studio; place names are used as fan tribute.
        </p>
      </div>
    </footer>
  );
}
