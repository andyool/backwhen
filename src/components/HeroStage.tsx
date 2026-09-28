"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { asset } from "@/lib/paths";

export type StageItem = { slug: string; name: string; line: string; image: string; price: string; garment: string };

const HOLD = 3400;

// The garment on a turntable. Every few seconds it turns around and the other
// side is the next design; swipe or tap a tick to move it yourself. The hidden
// face always holds the upcoming design, so each turn lands on a loaded image.
export default function HeroStage({ items }: { items: StageItem[] }) {
  const n = items.length;
  const mod = (i: number) => ((i % n) + n) % n;
  const [flips, setFlips] = useState(0);
  const [faces, setFaces] = useState<[number, number]>([0, 1]);
  const [paused, setPaused] = useState(false);
  const [reduced, setReduced] = useState(false);
  const root = useRef<HTMLDivElement>(null);
  const visible = useRef(true);
  const swipe = useRef<{ x: number; y: number } | null>(null);

  const shown = flips % 2;
  const index = faces[shown];
  const current = items[index];

  const goTo = useCallback(
    (to: number) => {
      const target = mod(to);
      if (target === index) return;
      const hidden = 1 - shown;
      setFaces((f) => (hidden === 0 ? [target, f[1]] : [f[0], target]));
      setFlips((x) => x + 1);
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [index, shown],
  );

  useEffect(() => {
    setReduced(window.matchMedia("(prefers-reduced-motion: reduce)").matches);
    const io = new IntersectionObserver(([e]) => (visible.current = e.isIntersecting));
    if (root.current) io.observe(root.current);
    return () => io.disconnect();
  }, []);

  // Once a turn has finished, load the next design onto the face now pointing away.
  useEffect(() => {
    const t = setTimeout(() => {
      const hidden = 1 - (flips % 2);
      setFaces((f) => {
        const next = mod(f[flips % 2] + 1);
        return hidden === 0 ? [next, f[1]] : [f[0], next];
      });
    }, 1300);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [flips]);

  const [tick, setTick] = useState(0);
  useEffect(() => {
    if (paused || reduced) return;
    const t = setTimeout(() => {
      if (visible.current && !document.hidden) setFlips((x) => x + 1);
      else setTick((k) => k + 1); // not on screen: check again later
    }, HOLD);
    return () => clearTimeout(t);
  }, [flips, paused, reduced, tick]);

  const faceA = items[faces[0]];
  const faceB = items[faces[1]];
  const step = flips;

  return (
    <div ref={root} className="stage" onPointerEnter={(e) => e.pointerType === "mouse" && setPaused(true)} onPointerLeave={() => setPaused(false)}>
      <Link
        href={`/products/${current.slug}`}
        className="stage-hit block"
        aria-label={`${current.name}, ${current.garment}, ${current.price}`}
        onPointerDown={(e) => (swipe.current = { x: e.clientX, y: e.clientY })}
        onPointerUp={(e) => {
          const s = swipe.current;
          swipe.current = null;
          if (!s) return;
          const dx = e.clientX - s.x;
          if (Math.abs(dx) > 40 && Math.abs(dx) > Math.abs(e.clientY - s.y)) {
            e.preventDefault();
            goTo(index + (dx < 0 ? 1 : -1));
          }
        }}
        draggable={false}
        data-examine="A garment on a turntable. It keeps turning."
        data-name={current.name}
      >
        <div className="stage-spot" aria-hidden />
        <div className="stage-float">
          <div className={`stage-turn ${reduced ? "is-reduced" : ""}`} style={{ ["--turn" as string]: `${step * 180}deg` }}>
            <div className="stage-face" data-active={shown === 0}>
              <Image src={asset(faceA.image)} alt="" fill priority sizes="(min-width: 1024px) 46vw, 92vw" className="object-contain" draggable={false} />
            </div>
            <div className="stage-face stage-face-b" data-active={shown === 1}>
              <Image src={asset(faceB.image)} alt="" fill priority sizes="(min-width: 1024px) 46vw, 92vw" className="object-contain" draggable={false} />
            </div>
          </div>
        </div>
        <div className="stage-floor" aria-hidden />
      </Link>

      <div className="mt-2 flex items-end justify-between gap-4 sm:mt-4">
        <div key={current.slug} className="stage-caption min-w-0">
          <p className="truncate text-[20px] leading-tight sm:text-[24px]">{current.name}</p>
          <p className="small truncate text-faded">
            {current.garment} · {current.price}
          </p>
        </div>
        <p className="small shrink-0 tabular-nums text-faded" aria-live="polite">
          {String(index + 1).padStart(2, "0")} / {String(n).padStart(2, "0")}
        </p>
      </div>
      <div className="stage-ticks mt-3" role="group" aria-label="Choose a design">
        {items.map((it, i) => (
          <button
            key={it.slug}
            type="button"
            aria-label={it.name}
            aria-current={i === index}
            onClick={() => goTo(i)}
            className={i === index ? "is-on" : ""}
          >
            <span key={i === index ? `on-${flips}` : "off"} style={i === index && !paused && !reduced ? { animationDuration: `${HOLD}ms` } : undefined} />
          </button>
        ))}
      </div>
    </div>
  );
}
