"use client";

import { useRef, useState, type ReactNode } from "react";

// A round magnifier that follows the pointer (or finger) over an image, so the
// engraving can be looked at line by line. `src` is the full-resolution file.
export default function Loupe({ src, zoom = 2.6, size = 180, children, className = "" }: { src: string; zoom?: number; size?: number; children: ReactNode; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const [pos, setPos] = useState<{ x: number; y: number; w: number; h: number } | null>(null);

  function move(e: React.PointerEvent) {
    const r = ref.current!.getBoundingClientRect();
    setPos({ x: e.clientX - r.left, y: e.clientY - r.top, w: r.width, h: r.height });
  }

  return (
    <div
      ref={ref}
      className={`loupe-host relative touch-pan-y ${className}`}
      onPointerMove={move}
      onPointerDown={move}
      onPointerLeave={() => setPos(null)}
      onPointerUp={(e) => e.pointerType !== "mouse" && setPos(null)}
    >
      {children}
      {pos && (
        <div
          className="loupe"
          aria-hidden
          style={{
            width: size,
            height: size,
            left: pos.x - size / 2,
            top: pos.y - size / 2,
            backgroundImage: `url(${src})`,
            backgroundSize: `${pos.w * zoom}px ${pos.h * zoom}px`,
            backgroundPosition: `${-(pos.x * zoom - size / 2)}px ${-(pos.y * zoom - size / 2)}px`,
          }}
        />
      )}
    </div>
  );
}
