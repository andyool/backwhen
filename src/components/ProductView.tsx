"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import ProductImage from "./ProductImage";
import SignArt from "./SignArt";
import GarmentMock from "./GarmentMock";
import Dialogue from "./Dialogue";
import Loupe from "./Loupe";
import { garmentAvailable, garmentLabel, makeSku, type Collection, type Product } from "@/lib/products";
import type { Artwork } from "@/lib/art";
import { asset } from "@/lib/paths";
import { money } from "@/lib/format";
import { useCart } from "@/lib/cart";
import { sizeTables } from "@/lib/sizes";
import { zones } from "@/lib/shipping";
import { GARMENT_PREF_KEY } from "@/lib/prefs";
import { track } from "@/lib/track";
import { say } from "@/lib/say";

const freeAu = zones.find((z) => z.id === "au")?.freeOverCents;

export default function ProductView({
  product,
  collection,
  hasArt,
  hasFront,
  variant,
  artwork,
}: {
  product: Product;
  collection: Collection;
  /** per garment, same order as product.garments: does the Printful back mockup PNG exist */
  hasArt: boolean[];
  /** same, for the front (chest crest) mockup */
  hasFront: boolean[];
  variant: number;
  artwork: Artwork;
}) {
  const { add, openDrawer } = useCart();
  const [garmentIndex, setGarmentIndex] = useState(0);
  const [size, setSize] = useState<string | null>(null);
  const [nudge, setNudge] = useState(false);
  const [slide, setSlide] = useState(0);
  const [showBar, setShowBar] = useState(false);
  const buyRef = useRef<HTMLButtonElement>(null);
  const sizesRef = useRef<HTMLFieldSetElement>(null);
  const railRef = useRef<HTMLDivElement>(null);

  const garment = product.garments[garmentIndex];
  const available = garmentAvailable(garment);
  const colourName = garment.colour.name.toLowerCase();

  // Open on the garment asked for (?g=tee from an ad, or the shop's hoodie/tee switch), else the hoodie.
  useEffect(() => {
    let want: string | null = null;
    try {
      want = new URLSearchParams(window.location.search).get("g") ?? sessionStorage.getItem(GARMENT_PREF_KEY);
    } catch {}
    const i = product.garments.findIndex((g) => g.type === (want === "tee" ? "tee" : "hoodie"));
    if (i >= 0) setGarmentIndex(i);
  }, [product]);

  useEffect(() => {
    track("ViewContent", { value: garment.priceCents / 100, content_ids: [product.slug], content_name: product.name });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [product.slug]);

  // The sticky bar shows once the main button has scrolled away.
  useEffect(() => {
    const el = buyRef.current;
    if (!el) return;
    const io = new IntersectionObserver(([e]) => setShowBar(!e.isIntersecting && e.boundingClientRect.top < 0));
    io.observe(el);
    return () => io.disconnect();
  }, []);

  function chooseGarment(i: number) {
    setGarmentIndex(i);
    if (size && !product.garments[i].sizes.includes(size)) setSize(null);
    try {
      sessionStorage.setItem(GARMENT_PREF_KEY, product.garments[i].type);
    } catch {}
  }

  function addToCart() {
    if (!size) {
      setNudge(true);
      setTimeout(() => setNudge(false), 900);
      sizesRef.current?.scrollIntoView({ behavior: "smooth", block: "center" });
      return;
    }
    const sku = makeSku(product.slug, garment, size);
    if (!add(sku)) {
      say("Not enough inventory space.");
      return;
    }
    track("AddToCart", { value: garment.priceCents / 100, content_ids: [sku], content_name: product.name });
    openDrawer();
  }

  async function share() {
    const url = `${window.location.origin}${window.location.pathname}`;
    const text = `${product.name}. ${product.line}`;
    try {
      if (navigator.share) {
        await navigator.share({ title: product.name, text, url });
        return;
      }
      await navigator.clipboard.writeText(url);
      say("Link copied. Send it to someone who'd get it.");
    } catch {
      /* dismissed */
    }
  }

  // ------------------------------------------------------------ gallery
  const hasDesign = !!(artwork.print || artwork.raw);
  const hasCrest = !!(artwork.crest || artwork.crestRaw);
  const slides: { key: string; label: string; node: React.ReactNode }[] = [
    {
      key: "back",
      label: "Back",
      node: (
        <ProductImage
          key={garment.image}
          src={garment.image}
          alt={`${product.name} across the back of a ${colourName} ${garment.type}`}
          priority
          sizes="(min-width: 1024px) 55vw, 100vw"
          hasArt={hasArt[garmentIndex]}
          className="tile pdp-img"
          fallback={
            hasDesign ? (
              <GarmentMock artwork={artwork} colour={garment.colour} type={garment.type} alt="" priority side="back" />
            ) : (
              <SignArt name={product.name} place={product.place} printLines={product.printLines} colour={garment.colour} type={garment.type} variant={variant} />
            )
          }
        />
      ),
    },
  ];
  if (hasCrest || hasFront[garmentIndex]) {
    slides.push({
      key: "front",
      label: "Front",
      node: (
        <ProductImage
          key={garment.imageFront}
          src={garment.imageFront}
          alt={`${product.name} crest on the chest of a ${colourName} ${garment.type}`}
          sizes="(min-width: 1024px) 28vw, 100vw"
          hasArt={hasFront[garmentIndex]}
          className="tile pdp-img"
          fallback={<GarmentMock artwork={artwork} colour={garment.colour} type={garment.type} alt="" side="front" />}
        />
      ),
    });
  }
  if (artwork.raw) {
    slides.push({
      key: "print",
      label: "The print",
      node: (
        <Loupe src={asset(artwork.raw)} className="aspect-[4/5] w-full overflow-hidden bg-black">
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="relative aspect-[2/3] h-full">
              <Image src={asset(artwork.raw)} alt={`${product.name} artwork`} fill sizes="(min-width: 1024px) 28vw, 100vw" className="object-cover" />
            </div>
          </div>
        </Loupe>
      ),
    });
  }
  if (artwork.crestRaw) {
    slides.push({
      key: "crest",
      label: "The crest",
      node: (
        <div className="relative aspect-[4/5] w-full overflow-hidden bg-black">
          <Image src={asset(artwork.crestRaw)} alt={`${product.name} crest artwork`} fill sizes="(min-width: 1024px) 28vw, 100vw" className="object-contain p-[10%]" />
        </div>
      ),
    });
  }

  function onRailScroll() {
    const el = railRef.current;
    if (!el) return;
    setSlide(Math.round(el.scrollLeft / el.clientWidth));
  }
  function goSlide(i: number) {
    const el = railRef.current;
    if (!el) return;
    el.scrollTo({ left: i * el.clientWidth, behavior: "smooth" });
  }

  const table = sizeTables[garment.type];

  return (
    <>
      <article className="mx-auto grid w-full max-w-page gap-8 sm:px-8 lg:grid-cols-[1.25fr_1fr] lg:gap-14">
        {/* gallery: swipe rail on phones, a grid on desktop */}
        <div data-examine={product.examine} data-name={product.name} data-href={`/products/${product.slug}`}>
          <div ref={railRef} onScroll={onRailScroll} className="pdp-rail" data-native-scroll>
            {slides.map((s, i) => (
              <figure key={s.key} className={`pdp-slide ${i === 0 ? "is-hero" : ""}`}>
                {s.node}
                <figcaption className="sr-only">{s.label}</figcaption>
              </figure>
            ))}
          </div>
          <div className="mt-3 flex items-center justify-between px-5 lg:hidden">
            <div className="flex gap-1.5">
              {slides.map((s, i) => (
                <button key={s.key} type="button" onClick={() => goSlide(i)} aria-label={s.label} className={`pdp-dot ${slide === i ? "is-on" : ""}`} />
              ))}
            </div>
            <p className="small text-faded">{slides[slide]?.label}</p>
          </div>
        </div>

        {/* buy panel */}
        <div className="px-5 sm:px-0 lg:sticky lg:top-24 lg:self-start">
          <p className="small hero-in text-faded">
            <Link href={`/collections/${collection.slug}`} className="sweep hover:text-bone">
              {collection.name}
            </Link>{" "}
            · {product.place}
          </p>
          <h1 className="display hero-in mt-2 text-[40px] sm:text-[52px]" style={{ ["--d" as string]: "50ms" }}>
            {product.name}
          </h1>
          <p className="hero-in mt-2 text-[18px] text-faded" style={{ ["--d" as string]: "90ms" }}>
            {product.line}
          </p>

          <div className="hero-in mt-7 flex flex-col gap-6" style={{ ["--d" as string]: "140ms" }}>
            <fieldset>
              <legend className="sr-only">Garment</legend>
              <div className="grid grid-cols-2 gap-2">
                {product.garments.map((g, i) => (
                  <button key={g.type} type="button" onClick={() => chooseGarment(i)} aria-pressed={i === garmentIndex} className="option pop">
                    <span className="relative h-12 w-12 shrink-0">
                      <Image src={asset(g.image)} alt="" fill sizes="48px" className="object-contain" />
                    </span>
                    <span className="flex flex-col items-start text-left leading-tight">
                      <span>{g.type === "hoodie" ? "Hoodie" : "Tee"}</span>
                      <span className="small tabular-nums opacity-70">{money(g.priceCents)}</span>
                    </span>
                  </button>
                ))}
              </div>
              <p className="small mt-2 text-faded">Colour: {garment.colour.name}, matched to the ink.</p>
            </fieldset>

            <fieldset ref={sizesRef} className={nudge ? "shake" : ""}>
              <div className="mb-2 flex items-baseline justify-between">
                <legend className={`small ${nudge ? "text-bone" : "text-faded"}`}>{nudge ? "Pick a size first." : "Size"}</legend>
                <a href="#size-guide" className="small link text-faded" onClick={() => {
                  const d = document.getElementById("size-guide") as HTMLDetailsElement | null;
                  if (d) d.open = true;
                }}>
                  Size guide
                </a>
              </div>
              <div className="flex flex-wrap gap-2">
                {garment.sizes.map((s) => {
                  const enabled = garment.variantIds[s] !== null;
                  return (
                    <button
                      key={s}
                      type="button"
                      disabled={!enabled}
                      onClick={() => setSize(s)}
                      aria-pressed={size === s}
                      className="size pop"
                    >
                      {s}
                    </button>
                  );
                })}
              </div>
            </fieldset>

            {available ? (
              <button ref={buyRef} type="button" className="btn-primary w-full !py-4 !text-[17px]" onClick={addToCart}>
                {size ? `Add to cart · ${money(garment.priceCents)}` : "Add to cart"}
              </button>
            ) : (
              <p className="small rounded-[2px] bg-flannel p-4 text-faded">This one isn&rsquo;t on the press yet. Follow along on Instagram for the release.</p>
            )}

            <ul className="small flex flex-col gap-1.5 text-faded">
              <li className="tick">Printed for you, ships in 2–5 business days</li>
              {freeAu && <li className="tick">Free shipping in Australia over {money(freeAu)}</li>}
              <li className="tick">Arrives damaged or misprinted? Replaced free</li>
              <li className="tick">Apple Pay, Google Pay or card via Stripe</li>
            </ul>

            <button type="button" onClick={share} className="sweep self-start text-[15px] text-faded hover:text-bone">
              Send it to someone who&rsquo;d get it
            </button>
          </div>

          <div className="mt-10 border-t border-seam">
            <details className="acc" open>
              <summary>The place</summary>
              <Dialogue text={product.story} topics={product.topics} className="acc-body text-faded" />
            </details>
            <details className="acc" id="size-guide">
              <summary>Size &amp; fit</summary>
              <div className="acc-body">
                <p className="text-faded">{table.fit}</p>
                <table className="mt-4 w-full text-left tabular-nums">
                  <thead className="small text-faded">
                    <tr>
                      <th className="py-1 font-normal">Size</th>
                      <th className="py-1 font-normal">Chest width</th>
                      <th className="py-1 font-normal">Length</th>
                      <th className="py-1 font-normal">Sleeve</th>
                    </tr>
                  </thead>
                  <tbody>
                    {table.rows.map((r) => (
                      <tr key={r.size} className={`border-t border-seam/70 ${size === r.size ? "text-bone" : "text-faded"}`}>
                        <td className="py-1.5">{r.size}</td>
                        <td>{r.width}</td>
                        <td>{r.length}</td>
                        <td>{r.sleeve}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                <p className="small mt-3 text-faded">Centimetres, measured flat. Chest width is armpit to armpit; double it for the full chest.</p>
              </div>
            </details>
            <details className="acc">
              <summary>Garment &amp; print</summary>
              <div className="acc-body text-faded">
                <p>
                  {garment.type === "hoodie"
                    ? "Heavyweight brushed fleece, dropped shoulder, double-lined hood, kangaroo pocket."
                    : "Heavy 100% cotton with a faded wash, boxy oversized fit, ribbed collar."}{" "}
                  Large print across the back, the crest small on the left chest.
                </p>
                <ul className="mt-3">
                  {product.printLines.map((l) => (
                    <li key={l}>{l}</li>
                  ))}
                </ul>
              </div>
            </details>
            <details className="acc">
              <summary>Shipping &amp; returns</summary>
              <div className="acc-body text-faded">
                <p>Printed to order in 2–5 business days, then shipped from the print house nearest you with tracking — usually Brisbane for Australia, and local partners for the US, UK and Europe.</p>
                <p className="mt-3">
                  No change-of-mind returns, since it&rsquo;s made for you. Damaged, misprinted or wrong: replaced free. <Link href="/shipping" className="link">Full details</Link>.
                </p>
              </div>
            </details>
          </div>
        </div>
      </article>

      {/* sticky buy bar, phones only */}
      {available && (
        <div className={`buybar lg:hidden ${showBar ? "is-on" : ""}`} aria-hidden={!showBar} inert={!showBar}>
          <div className="min-w-0">
            <p className="truncate leading-tight">{product.name}</p>
            <p className="small text-faded">
              {garmentLabel[garment.type]} · {size ?? "choose size"} · {money(garment.priceCents)}
            </p>
          </div>
          <button type="button" className="btn-primary shrink-0 !px-5 !py-3" onClick={addToCart}>
            {size ? "Add to cart" : "Choose size"}
          </button>
        </div>
      )}
    </>
  );
}
