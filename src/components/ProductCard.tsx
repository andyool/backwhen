import Link from "next/link";
import ProductImage from "./ProductImage";
import SignArt from "./SignArt";
import GarmentMock from "./GarmentMock";
import Tilt from "./fx/Tilt";
import { artExists, artworkFor } from "@/lib/art";
import { fromPrice, garmentAvailable, products, type Product } from "@/lib/products";
import { money } from "@/lib/format";

export default function ProductCard({ product, priority, index = 0 }: { product: Product; priority?: boolean; index?: number }) {
  const hero = product.garments[0];
  const available = product.garments.some(garmentAvailable);
  const variant = products.findIndex((p) => p.slug === product.slug);
  const delay = `${(index % 3) * 110}ms`;
  const artwork = artworkFor(product.slug);
  const alt = `${product.name} on a ${hero.colour.name.toLowerCase()} ${hero.type}`;
  const fallback =
    artwork.print || artwork.raw ? (
      <GarmentMock artwork={artwork} colour={hero.colour} type={hero.type} alt={alt} priority={priority} />
    ) : (
      <SignArt name={product.name} place={product.place} printLines={product.printLines} colour={hero.colour} type={hero.type} variant={variant} />
    );
  return (
    <Link href={`/products/${product.slug}`} className="group block">
      <Tilt>
        <ProductImage
          src={hero.image}
          alt={alt}
          priority={priority}
          hasArt={artExists(hero.image)}
          className="curtain"
          fallback={fallback}
        />
      </Tilt>
      <div className="mt-4 flex items-baseline justify-between gap-4" data-reveal style={{ ["--d" as string]: delay }}>
        <h3 className="text-[19px] leading-tight">
          <span className="sweep">{product.name}</span>
        </h3>
        <span className="small tabular-nums text-faded">{available ? `from ${money(fromPrice(product))}` : "Coming soon"}</span>
      </div>
      <p className="small mt-1 text-faded" data-reveal style={{ ["--d" as string]: delay }}>
        {product.line}
      </p>
    </Link>
  );
}
