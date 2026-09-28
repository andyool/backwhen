import type { Metadata } from "next";
import { notFound } from "next/navigation";
import ProductGrid from "@/components/ProductGrid";
import ShopFilter from "@/components/ShopFilter";
import PlaceRequest from "@/components/PlaceRequest";
import { collections, getCollection, productsIn } from "@/lib/products";
import { money } from "@/lib/format";

type Params = Promise<{ slug: string }>;

export function generateStaticParams() {
  return collections.map((c) => ({ slug: c.slug }));
}

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const { slug } = await params;
  const c = getCollection(slug);
  return c ? { title: c.name, description: c.blurb } : {};
}

export default async function CollectionPage({ params }: { params: Params }) {
  const { slug } = await params;
  const collection = getCollection(slug);
  if (!collection) notFound();
  const items = productsIn(slug);
  const hoodie = items[0].garments.find((g) => g.type === "hoodie")!.priceCents;
  const tee = items[0].garments.find((g) => g.type === "tee")!.priceCents;

  return (
    <div className="mx-auto w-full max-w-page px-5 sm:px-8">
      <header className="grid gap-4 pb-8 pt-4 sm:pb-10 sm:pt-8 md:grid-cols-[1fr_1fr] md:items-end md:gap-10">
        <div>
          <p className="small hero-in text-faded">{collection.world}</p>
          <h1 className="display hero-in mt-1 text-[48px] sm:text-[80px]" style={{ ["--d" as string]: "60ms" }}>
            {collection.name}
          </h1>
        </div>
        <p className="hero-in max-w-[52ch] text-faded md:justify-self-end md:text-[18px]" style={{ ["--d" as string]: "120ms" }}>
          {collection.blurb}
        </p>
      </header>
      <div data-compass={slug}>
        <ShopFilter filters={[]} prices={{ hoodie: money(hoodie), tee: money(tee) }}>
          <ProductGrid products={items} priorityCount={4} garment={null} />
        </ShopFilter>
      </div>
      <div className="mt-24 border-t border-seam pt-10" data-reveal>
        <PlaceRequest collection={collection.name} />
      </div>
    </div>
  );
}
