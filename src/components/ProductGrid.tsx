import ProductCard from "./ProductCard";
import type { GarmentType, Product } from "@/lib/products";

// Shows one garment for every design: `garment`, or whatever a surrounding
// ShopFilter picks when `garment` is null.
export default function ProductGrid({ products, priorityCount = 0, garment = "hoodie" }: { products: Product[]; priorityCount?: number; garment?: GarmentType | null }) {
  return (
    <div className="shop-grid" data-garment={garment ?? undefined}>
      {products.map((p, i) => (
        <div key={p.slug} className="shop-cell" data-collection={p.collection} data-reveal style={{ ["--d" as string]: `${(i % 4) * 70}ms` }}>
          <ProductCard product={p} priority={i < priorityCount} />
        </div>
      ))}
    </div>
  );
}
