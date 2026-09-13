import Link from "next/link";
import ProductGrid from "@/components/ProductGrid";
import { collections, products, productsIn } from "@/lib/products";
import { site } from "@/lib/site";

export default function HomePage() {
  return (
    <>
      <section className="mx-auto w-full max-w-page px-5 pb-16 pt-10 sm:px-8 sm:pt-16">
        <p className="display-soft text-[28px] text-faded sm:text-[36px]">Cabins for rent. Ales, beds, poor company. All new arrivals report here.</p>
        <h1 className="display mt-6 max-w-[14ch] text-[56px] sm:text-[88px] lg:text-[112px]">
          Merch from places that don&rsquo;t exist.
        </h1>
        <p className="mt-8 max-w-[46ch] text-[18px] text-faded sm:text-[20px]">
          The general store, the inn, the fishing wharf, the census office. Drawn like an old shop sign, printed in cream ink on heavyweight fleece. No logos. If you know, you know.
        </p>
        <div className="mt-10 flex flex-wrap gap-3">
          {collections.map((c) => (
            <Link key={c.slug} href={`/collections/${c.slug}`} className="btn-ghost">
              {c.name}
            </Link>
          ))}
        </div>
      </section>

      {collections.map((c, i) => (
        <section key={c.slug} className={`mx-auto w-full max-w-page px-5 sm:px-8 ${i === 0 ? "" : "mt-24"}`}>
          <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
            <div>
              <p className="text-faded">{c.world}</p>
              <h2 className="display text-[36px] sm:text-[44px]">{c.name}</h2>
            </div>
            <Link href={`/collections/${c.slug}`} className="link text-faded">
              All {productsIn(c.slug).length} places
            </Link>
          </div>
          <ProductGrid products={productsIn(c.slug).slice(0, 3)} priorityCount={i === 0 ? 3 : 0} />
        </section>
      ))}

      <section className="mx-auto mt-28 w-full max-w-page px-5 sm:px-8">
        <div className="grid gap-10 bg-flannel px-6 py-12 sm:px-10 md:grid-cols-3">
          <div>
            <h2 className="text-[22px]">Made to order</h2>
            <p className="mt-2 text-faded">
              Nothing sits in a warehouse. Each piece is printed after you order it, at the print house nearest you, and posted within a week.
            </p>
          </div>
          <div>
            <h2 className="text-[22px]">Reads as vintage</h2>
            <p className="mt-2 text-faded">
              One-colour engraved artwork, a fake address, an est. date. To anyone else it&rsquo;s a nice old lumber-mill hoodie. To you it&rsquo;s 2004.
            </p>
          </div>
          <div>
            <h2 className="text-[22px]">Made in WA</h2>
            <p className="mt-2 text-faded">
              {site.shortName} is one person in Western Australia who spent too long in these places. Every design is drawn from the town itself, not the box art.
            </p>
          </div>
        </div>
      </section>

      <p className="sr-only">{products.length} designs available.</p>
    </>
  );
}
