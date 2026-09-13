"use client";

import Image from "next/image";
import { useState } from "react";

const PLACEHOLDER = "/products/placeholder.svg";

type Props = {
  src: string;
  alt: string;
  priority?: boolean;
  sizes?: string;
  className?: string;
};

// Swaps to a placeholder if the artwork PNG hasn't been added to /public yet.
export default function ProductImage({ src, alt, priority, sizes, className }: Props) {
  const [failed, setFailed] = useState(false);
  return (
    <div className={`relative aspect-[4/5] w-full overflow-hidden bg-flannel ${className ?? ""}`}>
      <Image
        src={failed ? PLACEHOLDER : src}
        alt={alt}
        fill
        priority={priority}
        sizes={sizes ?? "(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"}
        className="object-cover"
        onError={() => setFailed(true)}
        unoptimized={failed}
      />
    </div>
  );
}
