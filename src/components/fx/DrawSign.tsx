"use client";

import { useEffect, useRef } from "react";

// An engraved inn, drawn line by line as it scrolls through the viewport.
const PATHS = [
  // ground
  "M40 440 H560",
  "M70 470 Q300 452 530 470",
  // main building
  "M120 440 V250 L300 130 L480 250 V440",
  "M140 250 H460",
  // roof shading
  "M170 232 L300 148 L430 232",
  // door
  "M270 440 V330 Q300 300 330 330 V440",
  // windows
  "M170 300 H230 V370 H170 Z M200 300 V370 M170 335 H230",
  "M370 300 H430 V370 H370 Z M400 300 V370 M370 335 H430",
  // chimney and smoke
  "M400 140 V180 M430 165 V200",
  "M415 120 C405 105 425 95 415 80 C405 65 425 55 415 40",
  // hanging sign
  "M480 290 H540 M540 290 V310 M510 310 H540 V370 H480 V310 H510 M500 290 V310",
  "M490 340 H530",
  // lantern
  "M120 300 H90 V320 M90 320 L80 330 V352 L90 362 H100 L110 352 V330 L100 320",
  // trees
  "M60 440 V380 M60 380 L40 400 M60 380 L80 400 M60 350 L45 372 M60 350 L75 372",
  "M560 440 V350 M560 350 L535 380 M560 350 L585 380 M560 310 L540 340 M560 310 L580 340",
  // moon
  "M500 90 A30 30 0 1 0 520 130 A22 22 0 1 1 500 90",
];

export default function DrawSign({ className = "" }: { className?: string }) {
  const ref = useRef<SVGSVGElement>(null);

  useEffect(() => {
    const svg = ref.current!;
    const paths = Array.from(svg.querySelectorAll<SVGPathElement>("path"));
    const n = paths.length;
    let raf = 0;
    const update = () => {
      raf = 0;
      const r = svg.getBoundingClientRect();
      const vh = window.innerHeight;
      // 0 when the top enters the viewport bottom, 1 when the svg is 70% up the screen
      const p = Math.min(1, Math.max(0, (vh - r.top) / (vh * 0.75 + r.height * 0.4)));
      paths.forEach((path, i) => {
        const start = i / n;
        const end = (i + 1.6) / n;
        const local = Math.min(1, Math.max(0, (p - start) / (end - start)));
        path.style.strokeDashoffset = String(1 - local);
      });
    };
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);

  return (
    <svg ref={ref} viewBox="0 0 600 500" className={`draw-sign ${className}`} aria-hidden>
      <g fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
        {PATHS.map((d, i) => (
          <path key={i} d={d} pathLength={1} style={{ strokeDasharray: 1, strokeDashoffset: 1 }} />
        ))}
      </g>
    </svg>
  );
}
