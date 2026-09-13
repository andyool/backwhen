import Link from "next/link";
import ProductGrid from "@/components/ProductGrid";
import Fog from "@/components/fx/Fog";
import SplitText from "@/components/fx/SplitText";
import Magnetic from "@/components/fx/Magnetic";
import Marquee from "@/components/fx/Marquee";
import DrawSign from "@/components/fx/DrawSign";
import Counter from "@/components/fx/Counter";
import { collections, products, productsIn } from "@/lib/products";
import { site } from "@/lib/site";

export default function HomePage() {
  const places = products.map((p) => p.name);
  const lines = products.flatMap((p) => p.printLines[0]);

  return (
    <>
      {/* ------------------------------------------------------------ hero */}
      <section className="relative bleed-header flex min-h-[100svh] flex-col justify-end overflow-hidden">
        <div className="absolute inset-0 -z-10">
          <Fog />
          <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-charcoal to-transparent" />
        </div>
        <div className="mx-auto w-full max-w-page px-5 pb-16 sm:px-8 sm:pb-20">
          <SplitText
            as="p"
            text="Cabins for rent. Ales, beds, poor company. All new arrivals report here."
            className="display-soft block max-w-[30ch] text-[22px] text-faded sm:text-[30px]"
            stagger={28}
          />
          <SplitText
            as="h1"
            text="Merch from places that don’t exist."
            className="display mt-6 block max-w-[12ch] text-[15vw] sm:text-[88px] lg:text-[124px]"
            stagger={70}
            delay={250}
          />
          <div className="mt-10 grid gap-8 md:grid-cols-[1fr_auto] md:items-end">
            <p className="max-w-[46ch] text-[18px] text-faded sm:text-[20px]" data-reveal style={{ ["--d" as string]: "700ms" }}>
              The general store, the inn, the fishing wharf, the census office. Drawn like an old shop sign, printed in cream ink on heavyweight fleece. No logos. If you know, you know.
            </p>
            <div className="flex flex-wrap gap-3" data-reveal style={{ ["--d" as string]: "850ms" }}>
              {collections.map((c) => (
                <Magnetic key={c.slug}>
                  <Link href={`/collections/${c.slug}`} className="btn-ghost">
                    {c.name}
                  </Link>
                </Magnetic>
              ))}
            </div>
          </div>
        </div>
        <p className="small absolute bottom-6 right-5 hidden items-center gap-3 text-faded/70 sm:right-8 md:flex" data-reveal="fade" style={{ ["--d" as string]: "1400ms" }}>
          <span className="drift inline-block h-10 w-px bg-faded/50" />
          Scroll
        </p>
      </section>

      {/* ------------------------------------------------------------ ticker */}
      <section className="border-y border-seam/60 py-5" data-reveal="fade">
        <Marquee duration={70}>
          {places.map((p) => (
            <span key={p} className="sign flex items-center gap-12 text-[13px] text-faded">
              {p}
              <span className="h-1 w-1 rounded-full bg-olive" aria-hidden />
            </span>
          ))}
        </Marquee>
        <Marquee duration={90} reverse className="mt-3">
          {lines.map((l, i) => (
            <span key={i} className="display-soft flex items-center gap-12 text-[18px] text-faded/70">
              {l}
              <span className="h-px w-8 bg-seam" aria-hidden />
            </span>
          ))}
        </Marquee>
      </section>

      {/* ------------------------------------------------------------ collections */}
      {collections.map((c, i) => (
        <section key={c.slug} className="mx-auto w-full max-w-page px-5 pt-24 sm:px-8 sm:pt-32" data-compass={c.slug}>
          <div className="mb-10 grid gap-4 md:grid-cols-[auto_1fr_auto] md:items-end md:gap-10">
            <p className="display-soft text-[64px] leading-none text-faded/40 sm:text-[96px]" data-reveal="fade">
              {String(i + 1).padStart(2, "0")}
            </p>
            <div>
              <p className="text-faded" data-reveal>
                {c.world}
              </p>
              <SplitText as="h2" text={c.name} className="display block text-[40px] sm:text-[56px]" stagger={60} />
            </div>
            <Link href={`/collections/${c.slug}`} className="sweep self-end text-faded hover:text-bone" data-reveal style={{ ["--d" as string]: "200ms" }}>
              All {productsIn(c.slug).length} places
            </Link>
          </div>
          <ProductGrid products={productsIn(c.slug).slice(0, 3)} priorityCount={i === 0 ? 3 : 0} />
        </section>
      ))}

      {/* ------------------------------------------------------------ how it's made */}
      <section className="mx-auto mt-32 grid w-full max-w-page gap-12 px-5 sm:px-8 lg:grid-cols-2 lg:gap-20" data-compass="made">
        <div className="lg:sticky lg:top-32 lg:self-start">
          <DrawSign className="w-full max-w-[560px] text-bone/80" />
        </div>
        <div className="flex flex-col gap-16 lg:pt-10">
          <div data-reveal>
            <SplitText as="h2" text="Drawn from the town, not the box art." className="display block text-[36px] sm:text-[52px]" stagger={50} />
          </div>
          <div className="grid gap-10 sm:grid-cols-2">
            <div data-reveal>
              <p className="display text-[64px] text-bone sm:text-[80px]">
                <Counter to={products.length} />
              </p>
              <p className="mt-1 text-faded">places, so far</p>
            </div>
            <div data-reveal style={{ ["--d" as string]: "100ms" }}>
              <p className="display text-[64px] text-bone sm:text-[80px]">
                <Counter to={1} />
              </p>
              <p className="mt-1 text-faded">colour of ink</p>
            </div>
            <div data-reveal style={{ ["--d" as string]: "200ms" }}>
              <p className="display text-[64px] text-bone sm:text-[80px]">
                <Counter to={0} />
              </p>
              <p className="mt-1 text-faded">logos, characters or box art</p>
            </div>
            <div data-reveal style={{ ["--d" as string]: "300ms" }}>
              <p className="display text-[64px] text-bone sm:text-[80px]">
                <Counter to={2001} />
              </p>
              <p className="mt-1 text-faded">the year it all starts</p>
            </div>
          </div>
          <div className="flex flex-col gap-8">
            <div data-reveal>
              <h3 className="text-[22px]">Made to order</h3>
              <p className="mt-2 text-faded">
                Nothing sits in a warehouse. Each piece is printed after you order it, at the print house nearest you, and posted within a week.
              </p>
            </div>
            <div data-reveal>
              <h3 className="text-[22px]">Reads as vintage</h3>
              <p className="mt-2 text-faded">
                One-colour engraved artwork, a fake address, an est. date. To anyone else it&rsquo;s a nice old lumber-mill hoodie. To you it&rsquo;s 2004.
              </p>
            </div>
            <div data-reveal>
              <h3 className="text-[22px]">Made in WA</h3>
              <p className="mt-2 text-faded">
                {site.name} is one person in Western Australia who spent too long in these places. Every design is drawn from the town itself, not the box art.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ------------------------------------------------------------ closing */}
      <section className="mx-auto mt-36 w-full max-w-page px-5 sm:px-8" data-compass="end">
        <SplitText as="p" text="If you know, you know." className="display-soft block text-[13vw] text-bone sm:text-[96px] lg:text-[140px]" stagger={90} />
        <div className="mt-8 flex flex-wrap items-center gap-6" data-reveal style={{ ["--d" as string]: "400ms" }}>
          <Magnetic>
            <Link href={`/collections/${collections[0].slug}`} className="btn-primary">
              Start with {collections[0].world}
            </Link>
          </Magnetic>
          <Link href="/about" className="sweep text-faded hover:text-bone">
            Why this exists
          </Link>
        </div>
      </section>

      <p className="sr-only">{products.length} designs available.</p>
    </>
  );
}
