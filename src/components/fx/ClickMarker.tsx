"use client";

import { useEffect } from "react";

// A small X where you clicked: yellow on open ground, red on something you can use.
export default function ClickMarker() {
  useEffect(() => {
    if (!window.matchMedia("(pointer: fine)").matches) return;
    const onDown = (e: PointerEvent) => {
      if (e.button !== 0) return;
      const el = e.target as HTMLElement | null;
      const hot = !!el?.closest("a, button, input, select, textarea, label, [role=button], [data-examine]");
      const x = document.createElement("span");
      x.className = `click-x ${hot ? "is-hot" : ""}`;
      x.style.left = `${e.clientX}px`;
      x.style.top = `${e.clientY}px`;
      document.body.appendChild(x);
      setTimeout(() => x.remove(), 450);
    };
    window.addEventListener("pointerdown", onDown, { passive: true });
    return () => window.removeEventListener("pointerdown", onDown);
  }, []);
  return null;
}
