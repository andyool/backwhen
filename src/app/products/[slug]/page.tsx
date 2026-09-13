import type { Metadata } from "next";
import { notFound } from "next/navigation";
import ProductView from "@/components/ProductView";
import ProductGrid from "@/components/ProductGrid";
import SplitText from "@/components/fx/SplitText";
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
    openGraph: { images: [asset(product.garments[0].image)] },
  };
}

export default async function ProductPage({ params }: { params: Params }) {
  const { slug } = await params;
  const product = getProduct(slug);
  if (!product) notFound();
  const collection = getCollection(product.collection);
  if (!collection) notFound();

  const more = productsIn(collection.slug).filter((p) => p.slug !== product.slug).slice(0, 3);
  const hasArt = product.garments.map((g) => artExists(g.image));
  const hasFront = product.garments.map((g) => artExists(g.imageFront));
  const variant = products.findIndex((p) => p.slug === product.slug);
  const artwork = artworkFor(product.slug);

  return (
    <>
      <ProductView product={product} collection={collection} hasArt={hasArt} hasFront={hasFront} variant={variant} artwork={artwork} />
      {more.length > 0 && (
        <section className="mx-auto mt-28 w-full max-w-page px-5 sm:px-8">
          <SplitText as="h2" text={`Nearby, in ${collection.world}`} className="mb-10 block text-[26px] sm:text-[32px]" />
          <ProductGrid products={more} />
        </section>
      )}
    </>
  );
}
