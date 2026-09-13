"use client";

import { Fragment, useState } from "react";

// Story text where certain phrases are topics: click one and a reply opens
// beneath, the way a conversation branches.
export default function Dialogue({ text, topics = {}, className = "" }: { text: string; topics?: Record<string, string>; className?: string }) {
  const [open, setOpen] = useState<string | null>(null);
  const terms = Object.keys(topics).filter((t) => text.includes(t));
  if (terms.length === 0) return <p className={className}>{text}</p>;

  const re = new RegExp(`(${terms.map((t) => t.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")).join("|")})`);
  const parts = text.split(re);
  const seen = new Set<string>();

  return (
    <div className={className}>
      <p>
        {parts.map((part, i) => {
          if (topics[part] !== undefined && !seen.has(part)) {
            seen.add(part);
            const active = open === part;
            return (
              <button key={i} type="button" className={`topic ${active ? "is-open" : ""}`} aria-expanded={active} onClick={() => setOpen(active ? null : part)}>
                {part}
              </button>
            );
          }
          return <Fragment key={i}>{part}</Fragment>;
        })}
      </p>
      {open && (
        <p className="topic-reply" key={open}>
          {topics[open]}
        </p>
      )}
    </div>
  );
}
