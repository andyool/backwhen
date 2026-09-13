"use client";

import { useEffect, useState } from "react";
import { SAY_EVENT } from "@/lib/say";

type Line = { id: number; text: string };

// Short messages, bottom-left, gone after a few seconds. Fed by say().
export default function Chatbox() {
  const [lines, setLines] = useState<Line[]>([]);

  useEffect(() => {
    let n = 0;
    const onSay = (e: Event) => {
      const text = (e as CustomEvent<string>).detail;
      const id = ++n;
      setLines((l) => [...l.slice(-3), { id, text }]);
      setTimeout(() => setLines((l) => l.filter((x) => x.id !== id)), 5200);
    };
    window.addEventListener(SAY_EVENT, onSay);
    return () => window.removeEventListener(SAY_EVENT, onSay);
  }, []);

  if (lines.length === 0) return null;
  return (
    <div className="chatbox" role="status" aria-live="polite">
      {lines.map((l) => (
        <p key={l.id} className="chatbox-line">
          {l.text}
        </p>
      ))}
    </div>
  );
}
