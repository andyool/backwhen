import Link from "next/link";
import ProductImage from "./ProductImage";
import { fromPrice, garmentAvailable, type Product } from "@/lib/products";
import { money } from "@/lib/format";

export default function ProductCard({ product, priority }: { product: Product; priority?: boolean }) {
  const hero = product.garments[0];
  const available = product.garments.some(garmentAvailable);
  return (
    <Link href={`/products/${product.slug}`} className="group block">
      <ProductImage src={hero.image} alt={`${product.name} on a ${hero.colour.name.toLowerCase()} ${hero.type}`} priority={priority} />
      <div className="mt-4 flex items-baseline justify-between gap-4">
        <h3 className="text-[19px] leading-tight group-hover:underline decoration-faded/60 underline-offset-4">
          {product.name}
        </h3>
        <span className="small tabular-nums text-faded">
          {available ? `from ${money(fromPrice(product))}` : "Coming soon"}
        </span>
      </div>
      <p className="small mt-1 text-faded">{product.line}</p>
    </Link>
  );
}
