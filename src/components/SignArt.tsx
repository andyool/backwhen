import type { Colour, GarmentType } from "@/lib/products";

type Props = {
  name: string;
  place: string;
  printLines: string[];
  colour: Colour;
  type: GarmentType;
  /** Picks the engraved scene behind the lettering */
  variant?: number;
  className?: string;
};

// Garment mock-up drawn in SVG: the design as a one-colour engraved shop sign
// on the garment's own colour. Used wherever the real artwork PNG isn't in
// /public yet, so the catalogue never shows an empty frame.
export default function SignArt({
  name,
  place,
  printLines,
  colour,
  type,
  variant = 0,
  className = "",
}: Props) {
  const ink = colour.onDark ? "#E8DFC8" : "#A5552E";
  const lines = wrap(name, 15);
  const size =
    lines.length > 1
      ? 54
      : Math.min(60, Math.max(38, 680 / (name.length * 0.72)));
  const scene = variant % 3;
  const est =
    printLines.find((l) => /\d{4}/.test(l))?.match(/\d{4}/)?.[0] ?? "";

  return (
    <div className="absolute inset-0">
      <svg
        viewBox="0 0 800 1000"
        className={`h-full w-full ${className}`}
        role="img"
        aria-label={`${name} on a ${colour.name.toLowerCase()} ${type}`}
      >
        <defs>
          <radialGradient id="light" cx="50%" cy="35%" r="70%">
            <stop
              offset="0%"
              stopColor="#ffffff"
              stopOpacity={colour.onDark ? 0.08 : 0.25}
            />
            <stop
              offset="100%"
              stopColor="#000000"
              stopOpacity={colour.onDark ? 0.35 : 0.08}
            />
          </radialGradient>
        </defs>

        {/* garment */}
        <rect width="800" height="1000" fill={colour.hex} />
        <rect width="800" height="1000" fill="url(#light)" />
        {/* seams: collar, shoulders */}
        <g
          fill="none"
          stroke={colour.onDark ? "#ffffff" : "#000000"}
          strokeOpacity="0.08"
          strokeWidth="2"
        >
          {type === "hoodie" ? (
            <>
              <path d="M250 0 C300 120 500 120 550 0" />
              <path d="M270 0 C310 90 490 90 530 0" />
              <path d="M0 260 L120 60 M800 260 L680 60" />
            </>
          ) : (
            <>
              <path d="M290 0 C330 70 470 70 510 0" />
              <path d="M0 200 L140 40 M800 200 L660 40" />
            </>
          )}
        </g>

        {/* the print */}
        <g
          transform="translate(400 470)"
          fill="none"
          stroke={ink}
          strokeWidth="3"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          {/* outer frame with notched corners */}
          <path d="M-250 -240 H250 L262 -228 V228 L250 240 H-250 L-262 228 V-228 Z" />
          <path
            d="M-236 -226 H236 L248 -214 V214 L236 226 H-236 L-248 214 V-214 Z"
            strokeWidth="1.2"
            strokeOpacity="0.7"
          />

          {/* scene */}
          <g transform="translate(0 -70)" strokeWidth="2.2">
            {scene === 0 && (
              <>
                <path d="M-200 60 L-120 -40 L-60 20 L0 -70 L70 10 L130 -30 L200 60" />
                <path d="M-200 60 H200" />
                <path d="M-40 60 V0 L0 -30 L40 0 V60" />
                <path d="M-12 60 V25 H12 V60" />
                <path d="M-200 90 Q0 70 200 90" strokeOpacity="0.6" />
                <path d="M140 -100 A26 26 0 1 0 156 -64 A20 20 0 1 1 140 -100" />
              </>
            )}
            {scene === 1 && (
              <>
                <path d="M-200 40 Q-100 20 0 40 T200 40" />
                <path d="M-200 70 Q-100 50 0 70 T200 70" strokeOpacity="0.6" />
                <path
                  d="M-200 100 Q-100 80 0 100 T200 100"
                  strokeOpacity="0.35"
                />
                <path d="M-90 40 V-30 H90 V40 M-70 -30 V-60 H70 V-30" />
                <path d="M-40 -60 V-100 M-40 -100 L-70 -70 M-40 -100 L-10 -70" />
                <path d="M40 -60 V-110 L60 -90" />
                <path d="M110 -20 L170 -120 L230 -20" strokeOpacity="0.6" />
                <path d="M-150 -90 A22 22 0 1 0 -136 -60 A17 17 0 1 1 -150 -90" />
              </>
            )}
            {scene === 2 && (
              <>
                <path d="M-200 60 H200" />
                <path d="M-140 60 V-40 L0 -120 L140 -40 V60" />
                <path d="M-140 -40 H140" />
                <path d="M-20 60 V0 Q0 -20 20 0 V60" />
                <path d="M-100 -10 H-50 V40 H-100 Z M-75 -10 V40" />
                <path d="M50 -10 H100 V40 H50 Z M75 -10 V40" />
                <path d="M80 -80 V-140 M100 -100 V-140" />
                <path
                  d="M90 -150 C80 -165 100 -175 90 -190"
                  strokeOpacity="0.6"
                />
                <path
                  d="M-200 30 L-170 -30 L-155 5 L-140 -20"
                  strokeOpacity="0.6"
                />
                <path d="M-190 90 Q0 76 190 90" strokeOpacity="0.5" />
              </>
            )}
          </g>

          {/* rule */}
          <path d="M-170 40 H170" strokeWidth="1.5" />
          <circle cx="0" cy="40" r="4" fill={ink} stroke="none" />
        </g>

        {/* lettering */}
        <g
          fill={ink}
          textAnchor="middle"
          fontFamily="var(--font-fraunces), Georgia, serif"
          style={{ fontVariationSettings: '"opsz" 72, "SOFT" 0' }}
        >
          {lines.map((l, i) => (
            <text
              key={l}
              x="400"
              y={560 + i * (size + 8) + (lines.length > 1 ? -6 : 0)}
              fontSize={size}
              fontWeight={600}
              letterSpacing={size * 0.12}
              style={{ textTransform: "uppercase" }}
            >
              {l.toUpperCase()}
            </text>
          ))}
          <text
            x="400"
            y={lines.length > 1 ? 690 : 630}
            fontSize="19"
            fontStyle="italic"
            fontWeight={300}
            opacity="0.9"
          >
            {place}
          </text>
          {printLines.slice(0, 2).map((l, i) => (
            <text
              key={l}
              x="400"
              y={(lines.length > 1 ? 690 : 630) + 34 + i * 26}
              fontSize="15"
              letterSpacing="2.5"
              opacity="0.8"
            >
              {l.toUpperCase()}
            </text>
          ))}
          {est && (
            <text
              x="400"
              y="290"
              fontSize="14"
              letterSpacing="4"
              opacity="0.75"
            >
              EST. {est}
            </text>
          )}
        </g>
      </svg>
      <div className="cloth absolute inset-0" aria-hidden />
    </div>
  );
}

function wrap(text: string, max: number): string[] {
  if (text.length <= max) return [text];
  const words = text.split(" ");
  const lines: string[] = [];
  let cur = "";
  for (const w of words) {
    const next = cur ? `${cur} ${w}` : w;
    if (next.length > max && cur) {
      lines.push(cur);
      cur = w;
    } else cur = next;
  }
  if (cur) lines.push(cur);
  return lines.slice(0, 2);
}
