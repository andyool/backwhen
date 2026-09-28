import Link from "next/link";
import Image from "next/image";
import ProductGrid from "@/components/ProductGrid";
import ShopFilter from "@/components/ShopFilter";
import HeroStage, { type StageItem } from "@/components/HeroStage";
import Loupe from "@/components/Loupe";
import Faq from "@/components/Faq";
import Fog from "@/components/fx/Fog";
import SplitText from "@/components/fx/SplitText";
import Magnetic from "@/components/fx/Magnetic";
import Marquee from "@/components/fx/Marquee";
import { collections, garmentLabel, products, productsIn } from "@/lib/products";
import { zones } from "@/lib/shipping";
import { money } from "@/lib/format";
import { asset } from "@/lib/paths";
import { site } from "@/lib/site";

const HOODIE = products[0].garments.find((g) => g.type === "hoodie")!.priceCents;
const TEE = products[0].garments.find((g) => g.type === "tee")!.priceCents;
const freeAu = zones.find((z) => z.id === "au")?.freeOverCents;

// Dark garments first: they carry the bone ink best at hero size.
const stage: StageItem[] = [...products]
  .sort((a, b) => Number(a.garments[0].colour.slug === "cream") - Number(b.garments[0].colour.slug === "cream"))
  .map((p) => {
    const g = p.garments.find((x) => x.type === "hoodie") ?? p.garments[0];
    return { slug: p.slug, name: p.name, line: p.line, image: g.image, price: money(g.priceCents), garment: garmentLabel[g.type] };
  });

const featured = products.find((p) => p.slug === "census-and-excise-office") ?? products[0];

export default function HomePage() {
  const filters = [
    { key: "all", label: "All", count: products.length },
    ...collections.map((c) => ({ key: c.slug, label: c.name, count: productsIn(c.slug).length })),
  ];

  return (
    <>
      {/* ------------------------------------------------------------ hero */}
      <section className="relative bleed-header overflow-hidden">
        <div className="absolute inset-0 -z-10">
          <Fog />
          <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-charcoal to-transparent" />
        </div>
        <div className="mx-auto grid w-full max-w-page items-center gap-x-12 gap-y-6 px-5 pb-12 pt-6 sm:px-8 lg:min-h-[calc(100svh-var(--header-h,72px))] lg:grid-cols-[1fr_1.05fr] lg:pb-16 lg:pt-10">
          <div>
            <p className="small hero-in text-faded" style={{ ["--d" as string]: "0ms" }}>
              {products.length} places · Hoodies {money(HOODIE)} · Tees {money(TEE)}
            </p>
            <h1 className="display hero-in mt-3 text-[12.5vw] leading-[0.95] sm:text-[72px] lg:text-[96px] xl:text-[108px]" style={{ ["--d" as string]: "60ms" }}>
              Merch from places that don&rsquo;t exist.
            </h1>
            <p className="hero-in mt-5 hidden max-w-[44ch] text-[19px] text-faded sm:block" style={{ ["--d" as string]: "140ms" }}>
              The inns, shops and wharves you spent your teens in, drawn like old shop signs and printed on heavyweight hoodies and tees. No logos. If you know, you know.
            </p>
            <div className="hero-in mt-8 hidden flex-wrap items-center gap-3 lg:flex" style={{ ["--d" as string]: "220ms" }}>
              <Magnetic>
                <Link href="#shop" className="btn-primary !px-8 !py-4 !text-[17px]">
                  Shop all {products.length} places
                </Link>
              </Magnetic>
              <Link href="#look-closer" className="sweep ml-3 text-faded hover:text-bone">
                Look closer
              </Link>
            </div>
            <ul className="small hero-in mt-10 hidden gap-x-6 gap-y-2 text-faded lg:flex lg:flex-wrap" style={{ ["--d" as string]: "300ms" }}>
              <li className="tick">Printed to order</li>
              {freeAu && <li className="tick">Free AU shipping over {money(freeAu)}</li>}
              <li className="tick">Apple Pay · Google Pay · card</li>
            </ul>
          </div>

          <div className="hero-in" style={{ ["--d" as string]: "120ms" }}>
            <HeroStage items={stage} />
          </div>

          <div className="hero-in lg:hidden" style={{ ["--d" as string]: "200ms" }}>
            <Link href="#shop" className="btn-primary w-full !py-4 !text-[17px]">
              Shop all {products.length} places
            </Link>
            <p className="small mt-3 text-center text-faded">
              Printed to order{freeAu ? ` · Free AU shipping over ${money(freeAu)}` : ""}
            </p>
          </div>
        </div>
      </section>

      {/* ------------------------------------------------------------ shop */}
      <section id="shop" className="mx-auto w-full max-w-page scroll-mt-24 px-5 pt-10 sm:px-8 sm:pt-16" data-compass="shop">
        <div className="mb-8 flex flex-col gap-2 sm:mb-10">
          <SplitText as="h2" text="Pick your place." className="display block text-[40px] sm:text-[60px]" stagger={60} />
          <p className="max-w-[52ch] text-faded" data-reveal>
            Big engraved print on the back, the place&rsquo;s crest small on the chest. Hover or tap through to see both.
          </p>
        </div>
        <ShopFilter filters={filters} prices={{ hoodie: money(HOODIE), tee: money(TEE) }}>
          <ProductGrid products={products} priorityCount={4} garment={null} />
        </ShopFilter>
      </section>

      {/* ------------------------------------------------------------ insight */}
      <section className="mx-auto mt-28 w-full max-w-page px-5 sm:mt-40 sm:px-8" data-compass="insight">
        <p className="display-soft max-w-[18ch] text-[34px] leading-[1.08] text-faded sm:text-[64px]" data-reveal>
          To anyone else, it&rsquo;s a nice old lodge hoodie.
        </p>
        <p className="display mt-3 text-[48px] leading-none sm:text-[104px]" data-reveal style={{ ["--d" as string]: "200ms" }}>
          To you, it&rsquo;s 2004.
        </p>
      </section>

      {/* ------------------------------------------------------------ look closer */}
      <section id="look-closer" className="mx-auto mt-24 grid w-full max-w-page scroll-mt-24 items-center gap-10 px-5 sm:mt-32 sm:px-8 lg:grid-cols-[1fr_1fr] lg:gap-20" data-compass="closer">
        <div data-reveal="scale">
          <Loupe src={asset(`/artwork/${featured.slug}.png`)} className="mx-auto aspect-[2/3] w-full max-w-[520px] overflow-hidden bg-black">
            <Image src={asset(`/artwork/${featured.slug}.png`)} alt={`${featured.name} artwork`} fill sizes="(min-width: 1024px) 40vw, 90vw" className="object-cover" />
          </Loupe>
          <p className="small mt-3 text-center text-faded">Drag across it. {featured.name}, {featured.place}.</p>
        </div>
        <div className="flex flex-col gap-10">
          <div>
            <SplitText as="h2" text="Drawn from the town, not the box art." className="display block text-[36px] sm:text-[52px]" stagger={50} />
            <p className="mt-5 max-w-[46ch] text-[18px] text-faded" data-reveal>
              Every design is drawn line by line from the place itself — the rooflines, the bridges, the lighthouse in the fog — then set like a 1970s lodge would have printed its own merch: a name, an address line, an est. date.
            </p>
          </div>
          <dl className="grid grid-cols-3 gap-6 border-t border-seam pt-8" data-reveal>
            {[
              ["places so far", products.length],
              ["logos", 0],
              ["characters", 0],
            ].map(([label, value]) => (
              <div key={label} className="flex flex-col-reverse">
                <dt className="small text-faded">{label}</dt>
                <dd className="display text-[44px] sm:text-[64px]">{value}</dd>
              </div>
            ))}
          </dl>
          <ol className="flex flex-col gap-6">
            {[
              ["Pick a place", "Hoodie or tee, your size. One colour per design, matched to the ink."],
              ["Printed for you", "It goes on the press after you order, so nothing sits in a warehouse. 2–5 business days."],
              ["Shipped from nearby", "From the print house closest to you, Brisbane for most of Australia, with tracking."],
            ].map(([t, d], i) => (
              <li key={t} className="grid grid-cols-[44px_1fr] gap-4" data-reveal style={{ ["--d" as string]: `${i * 90}ms` }}>
                <span className="display-soft text-[28px] leading-none text-faded">{String(i + 1).padStart(2, "0")}</span>
                <div>
                  <p className="text-[19px]">{t}</p>
                  <p className="mt-1 text-faded">{d}</p>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* ------------------------------------------------------------ faq */}
      <section className="mx-auto mt-28 grid w-full max-w-page gap-8 px-5 sm:mt-40 sm:px-8 lg:grid-cols-[1fr_1.4fr] lg:gap-20" data-compass="faq">
        <div>
          <SplitText as="h2" text="Before you ask." className="display block text-[36px] sm:text-[52px]" stagger={60} />
          <p className="mt-4 max-w-[36ch] text-faded" data-reveal>
            Anything else: <a className="link" href={`mailto:${site.email}`}>{site.email}</a>. A person answers.
          </p>
        </div>
        <Faq />
      </section>

      {/* ------------------------------------------------------------ closing */}
      <section className="mt-28 sm:mt-40" data-compass="end">
        <div className="border-y border-seam/60 py-5" aria-hidden>
          <Marquee duration={80}>
            {products.map((p) => (
              <span key={p.slug} className="sign flex items-center gap-12 text-[13px] text-faded">
                {p.name}
                <span className="h-1 w-1 rounded-full bg-olive" />
              </span>
            ))}
          </Marquee>
        </div>
        <div className="mx-auto w-full max-w-page px-5 pt-20 sm:px-8">
          <SplitText as="p" text="If you know, you know." className="display-soft block text-[13vw] text-bone sm:text-[96px] lg:text-[128px]" stagger={90} />
          <div className="mt-8 flex flex-wrap items-center gap-6" data-reveal style={{ ["--d" as string]: "300ms" }}>
            <Magnetic>
              <Link href="#shop" className="btn-primary !px-8 !py-4 !text-[17px]">
                Find your place
              </Link>
            </Magnetic>
            <Link href="/about" className="sweep text-faded hover:text-bone">
              Why this exists
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
