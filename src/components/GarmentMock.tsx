import Image from "next/image";
import type { Colour, GarmentType } from "@/lib/products";
import type { Artwork } from "@/lib/art";
import { asset } from "@/lib/paths";

type Props = {
  artwork: Artwork;
  colour: Colour;
  type: GarmentType;
  alt: string;
  priority?: boolean;
  sizes?: string;
  /** back = the big design; front = the small crest on the left chest */
  side?: "back" | "front";
};

// The real design composited onto a flat-lay of the garment colour. Stands in
// until Printful's photographic mockups are generated; swapped automatically.
export default function GarmentMock({ artwork, colour, type, alt, priority, sizes, side = "back" }: Props) {
  const front = side === "front";
  const src = front ? artwork.crest ?? artwork.crestRaw : artwork.print ?? artwork.raw;
  if (!src) return null;
  const isPrint = front ? !!artwork.crest : !!artwork.print;
  // Raw files have the background baked in: hide it with a blend mode.
  const blend = isPrint ? undefined : colour.onDark ? ("lighten" as const) : ("multiply" as const);
  const seam = colour.onDark ? "#ffffff" : "#000000";

  return (
    <div className="absolute inset-0" style={{ background: colour.hex }}>
      <svg viewBox="0 0 800 1000" className="absolute inset-0 h-full w-full" aria-hidden preserveAspectRatio="none">
        <defs>
          <radialGradient id="gm-light" cx="50%" cy="35%" r="70%">
            <stop offset="0%" stopColor="#ffffff" stopOpacity={colour.onDark ? 0.08 : 0.25} />
            <stop offset="100%" stopColor="#000000" stopOpacity={colour.onDark ? 0.35 : 0.08} />
          </radialGradient>
        </defs>
        <rect width="800" height="1000" fill="url(#gm-light)" />
        <g fill="none" stroke={seam} strokeOpacity="0.08" strokeWidth="2">
          {type === "hoodie" ? (
            <>
              <path d="M250 0 C300 120 500 120 550 0" />
              <path d="M270 0 C310 90 490 90 530 0" />
              <path d="M0 260 L120 60 M800 260 L680 60" />
              {front && <path d="M230 720 L570 720 M260 720 L230 900 M540 720 L570 900" />}
            </>
          ) : (
            <>
              <path d="M290 0 C330 70 470 70 510 0" />
              <path d="M0 200 L140 40 M800 200 L660 40" />
            </>
          )}
        </g>
      </svg>
      <div className="cloth absolute inset-0" aria-hidden />
      {front ? (
        // Wearer's left chest is the viewer's right.
        <div className="absolute right-[17%] top-[19%] w-[22%]">
          <Image
            src={asset(src)}
            alt={alt}
            width={1000}
            height={1000}
            priority={priority}
            sizes={sizes ?? "(min-width: 1024px) 8vw, (min-width: 640px) 12vw, 24vw"}
            className="h-auto w-full"
            style={{ mixBlendMode: blend }}
          />
        </div>
      ) : (
        <div className="absolute left-[19%] top-[14%] w-[62%]">
          <Image
            src={asset(src)}
            alt={alt}
            width={1024}
            height={1536}
            priority={priority}
            sizes={sizes ?? "(min-width: 1024px) 22vw, (min-width: 640px) 32vw, 64vw"}
            className="h-auto w-full"
            style={{ mixBlendMode: blend }}
          />
        </div>
      )}
    </div>
  );
}
