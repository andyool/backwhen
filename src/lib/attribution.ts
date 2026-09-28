// Remembers which ad or link brought the shopper here (utm_* and click ids)
// for 30 days, so the Stripe payment carries it as metadata. That makes every
// sale traceable to a campaign from the Stripe dashboard alone, pixel or not.
const KEY = "backwhen-attribution";
const KEYS = ["utm_source", "utm_medium", "utm_campaign", "utm_content", "utm_term", "fbclid", "ttclid", "gclid"] as const;
const TTL = 30 * 24 * 60 * 60 * 1000;

export type Attribution = Partial<Record<(typeof KEYS)[number] | "landing", string>>;

export function captureAttribution() {
  try {
    const q = new URLSearchParams(window.location.search);
    const found: Attribution = {};
    for (const k of KEYS) {
      const v = q.get(k);
      if (v) found[k] = v.slice(0, 200);
    }
    if (Object.keys(found).length === 0) return;
    found.landing = window.location.pathname.slice(0, 200);
    window.localStorage.setItem(KEY, JSON.stringify({ at: Date.now(), data: found }));
  } catch {}
}

export function readAttribution(): Attribution {
  try {
    const raw = window.localStorage.getItem(KEY);
    if (!raw) return {};
    const { at, data } = JSON.parse(raw) as { at: number; data: Attribution };
    return Date.now() - at < TTL ? data : {};
  } catch {
    return {};
  }
}

/** Only known keys, trimmed to Stripe's metadata limits. */
export function cleanAttribution(input: unknown): Record<string, string> {
  if (!input || typeof input !== "object") return {};
  const out: Record<string, string> = {};
  for (const k of [...KEYS, "landing"]) {
    const v = (input as Record<string, unknown>)[k];
    if (typeof v === "string" && v) out[k] = v.slice(0, 200);
  }
  return out;
}
