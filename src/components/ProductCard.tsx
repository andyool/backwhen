import Link from "next/link";
import ProductImage from "./ProductImage";
import SignArt from "./SignArt";
import GarmentMock from "./GarmentMock";
import Tilt from "./fx/Tilt";
import { artExists, artworkFor } from "@/lib/art";
import { garmentLabel, products, type Garment, type Product } from "@/lib/products";
import { money } from "@/lib/format";

// One design. Carries both garments; the surrounding grid's data-garment
// attribute decides which one shows (see .shop-grid in globals.css), so the
// hoodie/tee switch costs nothing to render and hidden images never load.
export default function ProductCard({ product, priority }: { product: Product; priority?: boolean }) {
  const variant = products.findIndex((p) => p.slug === product.slug);
  const artwork = artworkFor(product.slug);

  const face = (g: Garment) => {
    const alt = `${product.name} on the back of a ${g.colour.name.toLowerCase()} ${g.type}`;
    const altFront = `${product.name} crest on the chest of a ${g.colour.name.toLowerCase()} ${g.type}`;
    const fallback =
      artwork.print || artwork.raw ? (
        <GarmentMock artwork={artwork} colour={g.colour} type={g.type} alt={alt} priority={priority} />
      ) : (
        <SignArt name={product.name} place={product.place} printLines={product.printLines} colour={g.colour} type={g.type} variant={variant} />
      );
    const hasFront = artExists(g.imageFront) || !!(artwork.crest || artwork.crestRaw);
    return (
      <div key={g.type} className="card-face" data-g={g.type}>
        <ProductImage
          src={g.image}
          alt={alt}
          priority={priority}
          hasArt={artExists(g.image)}
          sizes="(min-width: 1024px) 30vw, 50vw"
          fallback={fallback}
        />
        {hasFront && (
          <div className="card-flip absolute inset-0" aria-hidden>
            <ProductImage
              src={g.imageFront}
              alt={altFront}
              hasArt={artExists(g.imageFront)}
              sizes="(min-width: 1024px) 30vw, 50vw"
              fallback={<GarmentMock artwork={artwork} colour={g.colour} type={g.type} alt={altFront} side="front" />}
            />
          </div>
        )}
      </div>
    );
  };

  return (
    <Link
      href={`/products/${product.slug}`}
      className="product-card group block"
      data-collection={product.collection}
      data-examine={product.examine}
      data-name={product.name}
      data-href={`/products/${product.slug}`}
    >
      <Tilt max={5}>
        {product.garments.map(face)}
        <span className="hover-label" aria-hidden>
          <span className="hover-verb">Wear</span> {product.name}
        </span>
      </Tilt>
      <div className="mt-3 flex flex-col gap-0.5 sm:mt-4 sm:flex-row sm:items-baseline sm:justify-between sm:gap-4">
        <h3 className="text-[16px] leading-tight sm:text-[19px]">
          <span className="sweep">{product.name}</span>
        </h3>
        {product.garments.map((g) => (
          <span key={g.type} className="card-price small tabular-nums text-faded" data-g={g.type}>
            <span className="sr-only">{garmentLabel[g.type]}, </span>
            {money(g.priceCents)}
          </span>
        ))}
      </div>
      <p className="small mt-1 hidden text-faded sm:block">{product.line}</p>
    </Link>
  );
}
