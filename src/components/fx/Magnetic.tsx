"use client";

import { useRef, type ReactNode } from "react";

// Pulls its child toward the pointer while hovered, springs back on leave.
export default function Magnetic({ children, strength = 0.35, className = "" }: { children: ReactNode; strength?: number; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);

  function move(e: React.PointerEvent) {
    const el = ref.current;
    if (!el || e.pointerType !== "mouse") return;
    const r = el.getBoundingClientRect();
    const dx = e.clientX - (r.left + r.width / 2);
    const dy = e.clientY - (r.top + r.height / 2);
    el.style.transition = "transform 120ms cubic-bezier(0.16, 1, 0.3, 1)";
    el.style.transform = `translate3d(${dx * strength}px, ${dy * strength}px, 0)`;
  }
  function leave() {
    const el = ref.current;
    if (!el) return;
    el.style.transition = "transform 600ms cubic-bezier(0.34, 1.56, 0.64, 1)";
    el.style.transform = "translate3d(0, 0, 0)";
  }

  return (
    <div ref={ref} className={`inline-block will-change-transform ${className}`} onPointerMove={move} onPointerLeave={leave}>
      {children}
    </div>
  );
}
