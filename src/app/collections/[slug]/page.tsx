import type { Metadata } from "next";
import { notFound } from "next/navigation";
import ProductGrid from "@/components/ProductGrid";
import { collections, getCollection, productsIn } from "@/lib/products";

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

  return (
    <div className="mx-auto w-full max-w-page px-5 sm:px-8">
      <header className="max-w-[60ch] pb-12 pt-6">
        <p className="text-faded">{collection.world}</p>
        <h1 className="display mt-1 text-[44px] sm:text-[60px]">{collection.name}</h1>
        <p className="mt-5 text-[18px] text-faded">{collection.blurb}</p>
      </header>
      <ProductGrid products={items} priorityCount={3} />
    </div>
  );
}
