import type { ReactNode } from "react";

// Infinite ticker. Content is duplicated so the loop is seamless.
export default function Marquee({
  children,
  className = "",
  duration = 60,
  reverse = false,
}: {
  children: ReactNode;
  className?: string;
  duration?: number;
  reverse?: boolean;
}) {
  return (
    <div className={`marquee ${className}`} style={{ ["--dur" as string]: `${duration}s`, ["--dir" as string]: reverse ? "reverse" : "normal" }}>
      <div className="marquee-track">
        <div className="marquee-group">{children}</div>
        <div className="marquee-group" aria-hidden>
          {children}
        </div>
      </div>
    </div>
  );
}
