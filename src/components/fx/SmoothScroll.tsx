"use client";

import { useEffect } from "react";

// Inertial wheel scrolling on top of native scroll (sticky elements keep
// working). Touch and reduced-motion stay native.
export default function SmoothScroll() {
  useEffect(() => {
    const root = document.documentElement;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    if (!window.matchMedia("(pointer: fine)").matches) return;

    let target = window.scrollY;
    let current = window.scrollY;
    let raf = 0;
    let animating = false;

    const max = () => root.scrollHeight - window.innerHeight;

    const loop = () => {
      const diff = target - current;
      current += diff * 0.11;
      if (Math.abs(diff) < 0.4) {
        current = target;
        animating = false;
      }
      window.scrollTo(0, current);
      if (animating) raf = requestAnimationFrame(loop);
    };

    const onWheel = (e: WheelEvent) => {
      if (e.ctrlKey || e.metaKey) return;
      const el = e.target as HTMLElement | null;
      if (el?.closest("[data-native-scroll]")) return;
      e.preventDefault();
      const unit = e.deltaMode === 1 ? 16 : e.deltaMode === 2 ? window.innerHeight : 1;
      if (!animating) {
        current = window.scrollY;
        target = current;
      }
      target = Math.max(0, Math.min(max(), target + e.deltaY * unit));
      if (!animating) {
        animating = true;
        raf = requestAnimationFrame(loop);
      }
    };

    const onScroll = () => {
      if (!animating) {
        current = window.scrollY;
        target = current;
      }
    };

    window.addEventListener("wheel", onWheel, { passive: false });
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("wheel", onWheel);
      window.removeEventListener("scroll", onScroll);
    };
  }, []);
  return null;
}
