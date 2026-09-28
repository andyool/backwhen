import type { Metadata } from "next";
import { notFound } from "next/navigation";
import ProductView from "@/components/ProductView";
import ProductGrid from "@/components/ProductGrid";
import { artExists, artworkFor } from "@/lib/art";
import { asset } from "@/lib/paths";
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
    openGraph: { images: [asset(`/og/${product.slug}.jpg`)] },
  };
}

export default async function ProductPage({ params }: { params: Params }) {
  const { slug } = await params;
  const product = getProduct(slug);
  if (!product) notFound();
  const collection = getCollection(product.collection);
  if (!collection) notFound();

  const more = [...productsIn(collection.slug), ...products].filter((p, i, all) => p.slug !== product.slug && all.findIndex((q) => q.slug === p.slug) === i).slice(0, 4);
  const hasArt = product.garments.map((g) => artExists(g.image));
  const hasFront = product.garments.map((g) => artExists(g.imageFront));
  const variant = products.findIndex((p) => p.slug === product.slug);
  const artwork = artworkFor(product.slug);

  return (
    <>
      <ProductView product={product} collection={collection} hasArt={hasArt} hasFront={hasFront} variant={variant} artwork={artwork} />
      {more.length > 0 && (
        <section className="mx-auto mt-24 w-full max-w-page px-5 sm:mt-32 sm:px-8">
          <h2 className="display mb-8 text-[30px] sm:text-[40px]" data-reveal>
            Nearby, in {collection.world}
          </h2>
          <ProductGrid products={more} />
        </section>
      )}
    </>
  );
}
