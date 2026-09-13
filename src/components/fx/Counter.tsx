"use client";

import { useEffect, useRef } from "react";

// Counts from 0 to `to` when scrolled into view.
export default function Counter({ to, className = "", suffix = "" }: { to: number; className?: string; suffix?: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  useEffect(() => {
    const el = ref.current!;
    const io = new IntersectionObserver(([e]) => {
      if (!e.isIntersecting) return;
      io.disconnect();
      const start = performance.now();
      const dur = 1400;
      const tick = (now: number) => {
        const t = Math.min(1, (now - start) / dur);
        const eased = 1 - Math.pow(1 - t, 4);
        el.textContent = `${Math.round(to * eased)}${suffix}`;
        if (t < 1) requestAnimationFrame(tick);
      };
      requestAnimationFrame(tick);
    });
    io.observe(el);
    return () => io.disconnect();
  }, [to, suffix]);
  return (
    <span ref={ref} className={`tabular-nums ${className}`}>
      0{suffix}
    </span>
  );
}
