import Link from "next/link";
import { site } from "@/lib/site";
import { collections } from "@/lib/products";
import BackToTop from "./BackToTop";
import NothingInteresting from "./NothingInteresting";

export default function Footer() {
  return (
    <footer className="relative mt-32 overflow-hidden bg-flannel">
      <div className="mx-auto grid w-full max-w-page gap-10 px-5 pt-16 sm:px-8 md:grid-cols-[2fr_1fr_1fr]">
        <div data-reveal>
          <p className="wordmark text-[22px]">{site.wordmark}</p>
          <p className="mt-4 max-w-[40ch] text-faded">{site.tagline} Printed to order, shipped from the nearest print house to you.</p>
        </div>
        <div className="flex flex-col items-start gap-2" data-reveal style={{ ["--d" as string]: "80ms" }}>
          {collections.map((c) => (
            <Link key={c.slug} href={`/collections/${c.slug}`} className="sweep text-faded hover:text-bone">
              {c.name}
            </Link>
          ))}
          <Link href="/about" className="sweep text-faded hover:text-bone">
            About
          </Link>
        </div>
        <div className="flex flex-col items-start gap-2" data-reveal style={{ ["--d" as string]: "160ms" }}>
          <Link href="/shipping" className="sweep text-faded hover:text-bone">
            Shipping &amp; returns
          </Link>
          <Link href="/privacy" className="sweep text-faded hover:text-bone">
            Privacy
          </Link>
          <a href={`mailto:${site.email}`} className="sweep text-faded hover:text-bone">
            {site.email}
          </a>
          <a href={site.instagram} className="sweep text-faded hover:text-bone" rel="noreferrer">
            Instagram
          </a>
        </div>
      </div>

      <div className="mx-auto mt-14 flex w-full max-w-page items-end justify-between gap-6 px-5 sm:px-8">
        <p className="small max-w-[60ch] text-faded/70">
          Prices in AUD, GST included. {site.abn ? `ABN ${site.abn}. ` : ""}
          Made in Western Australia. Not affiliated with any game studio; place names are used as fan tribute.
        </p>
        <BackToTop />
      </div>

      <div className="mx-auto w-full max-w-page overflow-hidden px-5 sm:px-8" aria-hidden>
        <NothingInteresting className="giant -mb-[0.12em] mt-6 block w-full whitespace-nowrap text-left text-bone/90" data-reveal="fade">
          {site.wordmark}
        </NothingInteresting>
      </div>
    </footer>
  );
}
