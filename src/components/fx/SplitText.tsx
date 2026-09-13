import type { ElementType, ReactNode } from "react";

type Props = {
  text: string;
  as?: ElementType;
  className?: string;
  /** ms between words */
  stagger?: number;
  /** ms before the first word */
  delay?: number;
  /** "chars" splits every letter; "words" (default) keeps words whole */
  by?: "words" | "chars";
};

// Server-safe: renders each word (or letter) inside an overflow mask so it can
// rise into place. Reveal is driven by data-reveal + CSS.
export default function SplitText({ text, as, className = "", stagger = 45, delay = 0, by = "words" }: Props) {
  const Tag = (as ?? "span") as ElementType;
  const units = by === "chars" ? Array.from(text) : text.split(" ");
  let i = 0;
  const nodes: ReactNode[] = units.map((u, idx) => {
    const isSpace = u === " ";
    const node = (
      <span key={idx} className="split-mask" aria-hidden>
        <span className="split-unit" style={{ transitionDelay: `${delay + i * stagger}ms` }}>
          {isSpace ? " " : u}
        </span>
      </span>
    );
    if (!isSpace) i += 1;
    return by === "words" && idx < units.length - 1 ? [node, " "] : node;
  });
  return (
    <Tag className={`split ${className}`} data-reveal="split">
      <span className="sr-only">{text}</span>
      {nodes}
    </Tag>
  );
}
