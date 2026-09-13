"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import ProductImage from "./ProductImage";
import SignArt from "./SignArt";
import GarmentMock from "./GarmentMock";
import BuyPanel from "./BuyPanel";
import Parallax from "./fx/Parallax";
import Tilt from "./fx/Tilt";
import SplitText from "./fx/SplitText";
import { garmentLabel, type Collection, type Product } from "@/lib/products";
import type { Artwork } from "@/lib/art";
import { asset } from "@/lib/paths";

export default function ProductView({
  product,
  collection,
  hasArt,
  variant,
  artwork,
}: {
  product: Product;
  collection: Collection;
  /** per garment, same order as product.garments: does the Printful mockup PNG exist */
  hasArt: boolean[];
  variant: number;
  artwork: Artwork;
}) {
  const [garmentIndex, setGarmentIndex] = useState(0);
  const [view, setView] = useState<"garment" | "print">("garment");
  const garment = product.garments[garmentIndex];
  const hasDesign = !!(artwork.print || artwork.raw);
  const alt = `${product.name} artwork on a ${garment.colour.name.toLowerCase()} ${garment.type}`;

  return (
    <article className="mx-auto grid w-full max-w-page gap-10 px-5 pt-4 sm:px-8 lg:grid-cols-[3fr_2fr] lg:gap-16">
      <div data-reveal="curtain">
        <Parallax speed={0.08}>
          <Tilt max={4}>
            {view === "print" && artwork.raw ? (
              <div className="card-img curtain relative aspect-[2/3] w-full overflow-hidden bg-flannel">
                <Image src={asset(artwork.raw)} alt={`${product.name} design`} fill sizes="(min-width: 1024px) 60vw, 100vw" className="card-img-inner object-cover" priority />
                <span className="tilt-sheen" aria-hidden />
              </div>
            ) : (
              <ProductImage
                key={garment.image}
                src={garment.image}
                alt={alt}
                priority
                sizes="(min-width: 1024px) 60vw, 100vw"
                hasArt={hasArt[garmentIndex]}
                className="curtain"
                fallback={
                  hasDesign ? (
                    <GarmentMock artwork={artwork} colour={garment.colour} type={garment.type} alt={alt} priority sizes="(min-width: 1024px) 40vw, 64vw" />
                  ) : (
                    <SignArt name={product.name} place={product.place} printLines={product.printLines} colour={garment.colour} type={garment.type} variant={variant} />
                  )
                }
              />
            )}
          </Tilt>
          {artwork.raw && (
            <div className="mt-4 flex gap-2" data-reveal style={{ ["--d" as string]: "500ms" }}>
              <button
                type="button"
                onClick={() => setView("garment")}
                aria-pressed={view === "garment"}
                className={`pop rounded-[2px] px-4 py-2 text-[15px] transition-colors duration-300 ${view === "garment" ? "bg-bone text-charcoal" : "bg-flannel text-bone hover:bg-seam"}`}
              >
                On the {garment.type}
              </button>
              <button
                type="button"
                onClick={() => setView("print")}
                aria-pressed={view === "print"}
                className={`pop rounded-[2px] px-4 py-2 text-[15px] transition-colors duration-300 ${view === "print" ? "bg-bone text-charcoal" : "bg-flannel text-bone hover:bg-seam"}`}
              >
                The print
              </button>
            </div>
          )}
        </Parallax>
      </div>

      <div className="lg:sticky lg:top-28 lg:self-start">
        <p className="small text-faded" data-reveal>
          <Link href={`/collections/${collection.slug}`} className="sweep hover:text-bone">
            {collection.name}
          </Link>
        </p>
        <SplitText as="h1" text={product.name} className="display mt-2 block text-[40px] sm:text-[48px]" delay={120} stagger={60} />
        <p className="mt-2 text-faded" data-reveal style={{ ["--d" as string]: "260ms" }}>
          {product.place}
        </p>

        <div className="mt-8" data-reveal style={{ ["--d" as string]: "360ms" }}>
          <BuyPanel product={product} onGarmentChange={setGarmentIndex} />
        </div>

        <div className="mt-12 flex flex-col gap-8 text-[16px]">
          <section data-reveal>
            <h2 className="mb-2 text-[20px]">The place</h2>
            <p className="text-faded">{product.story}</p>
          </section>
          <section data-reveal>
            <h2 className="mb-2 text-[20px]">On the print</h2>
            <ul className="text-faded">
              {product.printLines.map((l) => (
                <li key={l}>{l}</li>
              ))}
            </ul>
          </section>
          <section data-reveal>
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
