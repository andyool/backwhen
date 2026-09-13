import type { Metadata } from "next";
import { notFound } from "next/navigation";
import ProductGrid from "@/components/ProductGrid";
import SplitText from "@/components/fx/SplitText";
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
  const index = collections.findIndex((c) => c.slug === slug) + 1;

  return (
    <div className="mx-auto w-full max-w-page px-5 sm:px-8">
      <header className="grid gap-6 pb-14 pt-6 md:grid-cols-[1fr_2fr] md:items-end">
        <div>
          <p className="display-soft text-[64px] text-faded/50 sm:text-[96px]" data-reveal="fade">
            {String(index).padStart(2, "0")}
          </p>
          <p className="text-faded" data-reveal>
            {collection.world}
          </p>
          <SplitText as="h1" text={collection.name} className="display mt-1 block text-[52px] sm:text-[72px]" delay={100} />
        </div>
        <p className="max-w-[52ch] text-[18px] text-faded md:justify-self-end md:text-[20px]" data-reveal style={{ ["--d" as string]: "300ms" }}>
          {collection.blurb}
        </p>
      </header>
      <ProductGrid products={items} priorityCount={3} />
    </div>
  );
}
