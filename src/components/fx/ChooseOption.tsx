"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { say } from "@/lib/say";

type Target = { x: number; y: number; name: string; examine: string; href: string; el: HTMLElement };

// Right-click anything carrying data-examine and choose what to do with it.
export default function ChooseOption() {
  const [t, setT] = useState<Target | null>(null);
  const router = useRouter();

  useEffect(() => {
    if (!window.matchMedia("(pointer: fine)").matches) return;
    const onMenu = (e: MouseEvent) => {
      const el = (e.target as HTMLElement | null)?.closest<HTMLElement>("[data-examine]");
      if (!el) return;
      e.preventDefault();
      setT({
        x: e.clientX,
        y: e.clientY,
        name: el.dataset.name ?? "",
        examine: el.dataset.examine ?? "",
        href: el.dataset.href ?? el.closest("a")?.getAttribute("href") ?? "",
        el,
      });
    };
    const close = () => setT(null);
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && close();
    window.addEventListener("contextmenu", onMenu);
    window.addEventListener("click", close);
    window.addEventListener("scroll", close, { passive: true });
    window.addEventListener("keydown", onKey);
    return () => {
      window.removeEventListener("contextmenu", onMenu);
      window.removeEventListener("click", close);
      window.removeEventListener("scroll", close);
      window.removeEventListener("keydown", onKey);
    };
  }, []);

  if (!t) return null;
  const left = Math.min(t.x, window.innerWidth - 240);
  const top = Math.min(t.y, window.innerHeight - 170);

  const options: { label: React.ReactNode; run: () => void }[] = [
    { label: <><span className="opt-verb">Wear</span> {t.name}</>, run: () => t.href && router.push(t.href) },
    { label: <><span className="opt-verb">Examine</span> {t.name}</>, run: () => say(t.examine) },
    { label: <span className="opt-verb">Walk here</span>, run: () => t.el.scrollIntoView({ behavior: "smooth", block: "center" }) },
    { label: <span className="opt-verb">Cancel</span>, run: () => {} },
  ];

  return (
    <div className="choose-option" style={{ left, top }} role="menu" onContextMenu={(e) => e.preventDefault()}>
      <p className="choose-option-title">Choose option</p>
      {options.map((o, i) => (
        <button key={i} type="button" role="menuitem" className="choose-option-item" onClick={o.run}>
          {o.label}
        </button>
      ))}
    </div>
  );
}
