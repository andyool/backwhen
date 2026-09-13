"use client";

import { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";

// A faint compass along the bottom that turns as you scroll. Elements with
// data-compass become markers that drift to the centre as you reach them.
const SPAN = 720; // px of strip per full turn
const LETTERS = ["N", "E", "S", "W"];

export default function Compass() {
  const track = useRef<HTMLDivElement>(null);
  const [markers, setMarkers] = useState<{ id: string; top: number }[]>([]);
  const path = usePathname();

  useEffect(() => {
    const collect = () =>
      setMarkers(
        Array.from(document.querySelectorAll<HTMLElement>("[data-compass]")).map((el, i) => ({
          id: el.dataset.compass || String(i),
          top: el.getBoundingClientRect().top + window.scrollY,
        })),
      );
    collect();
    const t = setTimeout(collect, 1200);
    window.addEventListener("resize", collect);
    return () => {
      clearTimeout(t);
      window.removeEventListener("resize", collect);
    };
  }, [path]);

  useEffect(() => {
    const el = track.current!;
    let raf = 0;
    const update = () => {
      raf = 0;
      el.style.setProperty("--turn", `${-(window.scrollY * 0.5) % SPAN}px`);
      el.parentElement?.style.setProperty("--scroll", `${window.scrollY}`);
    };
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div className="compass" aria-hidden>
      <div ref={track} className="compass-track">
        {[0, 1].map((rep) =>
          LETTERS.map((l, i) => (
            <span key={`${rep}-${l}`} className="compass-letter" style={{ left: `${rep * SPAN + i * (SPAN / 4)}px` }}>
              {l}
            </span>
          )),
        )}
        {Array.from({ length: 2 * 16 }, (_, i) => (
          <span key={`t${i}`} className={`compass-tick ${i % 4 === 0 ? "is-major" : ""}`} style={{ left: `${i * (SPAN / 16)}px` }} />
        ))}
      </div>
      <div className="compass-markers">
        {markers.map((m) => (
          <span key={m.id} className="compass-marker" style={{ ["--top" as string]: String(m.top) }} />
        ))}
      </div>
      <span className="compass-centre" />
    </div>
  );
}
