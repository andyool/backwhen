"use client";

import { useState } from "react";
import Link from "next/link";
import ProductImage from "./ProductImage";
import BuyPanel from "./BuyPanel";
import { garmentLabel, type Collection, type Product } from "@/lib/products";

export default function ProductView({ product, collection }: { product: Product; collection: Collection }) {
  const [garmentIndex, setGarmentIndex] = useState(0);
  const garment = product.garments[garmentIndex];

  return (
    <article className="mx-auto grid w-full max-w-page gap-10 px-5 pt-4 sm:px-8 lg:grid-cols-[3fr_2fr] lg:gap-16">
      <div>
        <ProductImage
          key={garment.image}
          src={garment.image}
          alt={`${product.name} artwork on a ${garment.colour.name.toLowerCase()} ${garment.type}`}
          priority
          sizes="(min-width: 1024px) 60vw, 100vw"
        />
      </div>

      <div className="lg:sticky lg:top-8 lg:self-start">
        <p className="small text-faded">
          <Link href={`/collections/${collection.slug}`} className="hover:text-bone">
            {collection.name}
          </Link>
        </p>
        <h1 className="display mt-2 text-[40px] sm:text-[48px]">{product.name}</h1>
        <p className="mt-2 text-faded">{product.place}</p>

        <div className="mt-8">
          <BuyPanel product={product} onGarmentChange={setGarmentIndex} />
        </div>

        <div className="mt-12 flex flex-col gap-8 text-[16px]">
          <section>
            <h2 className="mb-2 text-[20px]">The place</h2>
            <p className="text-faded">{product.story}</p>
          </section>
          <section>
            <h2 className="mb-2 text-[20px]">On the print</h2>
            <ul className="text-faded">
              {product.printLines.map((l) => (
                <li key={l}>{l}</li>
              ))}
            </ul>
          </section>
          <section>
            <h2 className="mb-2 text-[20px]">{garmentLabel[garment.type]}</h2>
            <p className="text-faded">
              {garment.type === "hoodie"
                ? "Heavyweight brushed fleece, dropped shoulder, double-lined hood, kangaroo pocket. Large back print, small chest print."
                : "Heavy 100% cotton, boxy fit, ribbed collar. Large back print, small chest print."}
            </p>
            <p className="mt-3 text-faded">
              Printed to order and shipped from the print house nearest you — usually Brisbane for Australia, and a local partner for the US, UK and Europe. Turnaround is 2–5 business days before it ships.
            </p>
          </section>
        </div>
      </div>
    </article>
  );
}
