import type { Metadata } from "next";
import { notFound } from "next/navigation";
import ProductView from "@/components/ProductView";
import ProductGrid from "@/components/ProductGrid";
import { getCollection, getProduct, products, productsIn } from "@/lib/products";

type Params = Promise<{ slug: string }>;

export function generateStaticParams() {
  return products.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const { slug } = await params;
  const product = getProduct(slug);
  if (!product) return {};
  return {
    title: product.name,
    description: `${product.line} ${product.story}`,
    openGraph: { images: [product.garments[0].image] },
  };
}

export default async function ProductPage({ params }: { params: Params }) {
  const { slug } = await params;
  const product = getProduct(slug);
  if (!product) notFound();
  const collection = getCollection(product.collection);
  if (!collection) notFound();

  const more = productsIn(collection.slug).filter((p) => p.slug !== product.slug).slice(0, 3);

  return (
    <>
      <ProductView product={product} collection={collection} />
      {more.length > 0 && (
        <section className="mx-auto mt-24 w-full max-w-page px-5 sm:px-8">
          <h2 className="mb-8 text-[26px]">Nearby, in {collection.world}</h2>
          <ProductGrid products={more} />
        </section>
      )}
    </>
  );
}
