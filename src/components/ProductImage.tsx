"use client";

import Image from "next/image";
import { useState, type ReactNode } from "react";
import { asset } from "@/lib/paths";

type Props = {
  src: string;
  alt: string;
  priority?: boolean;
  sizes?: string;
  className?: string;
  /** false when the PNG isn't in /public yet (checked server-side) */
  hasArt?: boolean;
  /** Rendered instead of the PNG when it's missing or fails to load */
  fallback?: ReactNode;
};

export default function ProductImage({ src, alt, priority, sizes, className, hasArt = true, fallback }: Props) {
  const [failed, setFailed] = useState(false);
  const showFallback = (!hasArt || failed) && fallback;
  return (
    <div className={`card-img relative aspect-[4/5] w-full overflow-hidden bg-flannel ${className ?? ""}`}>
      {showFallback ? (
        <div className="card-img-inner absolute inset-0">{fallback}</div>
      ) : (
        <Image
          src={asset(src)}
          alt={alt}
          fill
          priority={priority}
          sizes={sizes ?? "(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"}
          className="card-img-inner object-contain p-[4%]"
          onError={() => setFailed(true)}
        />
      )}
      <span className="tilt-sheen" aria-hidden />
    </div>
  );
}
