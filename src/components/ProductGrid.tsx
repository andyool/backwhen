import ProductCard from "./ProductCard";
import type { Product } from "@/lib/products";

export default function ProductGrid({ products, priorityCount = 0 }: { products: Product[]; priorityCount?: number }) {
  return (
    <div className="lean grid grid-cols-1 gap-x-6 gap-y-14 sm:grid-cols-2 lg:grid-cols-3">
      {products.map((p, i) => (
        <div key={p.slug} data-reveal="curtain" style={{ ["--d" as string]: `${(i % 3) * 110}ms` }}>
          <ProductCard product={p} priority={i < priorityCount} index={i} />
        </div>
      ))}
    </div>
  );
}
