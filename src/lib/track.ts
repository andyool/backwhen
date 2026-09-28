// Ad-platform events. Each pixel only loads when its id is set (see
// Analytics.tsx), so without ids every call here is a no-op.
type Params = { value?: number; currency?: string; content_ids?: string[]; content_name?: string; num_items?: number };

type Fbq = (...args: unknown[]) => void;
type Ttq = { track: (event: string, params?: Record<string, unknown>) => void };

const TIKTOK_EVENT: Record<string, string> = {
  ViewContent: "ViewContent",
  AddToCart: "AddToCart",
  InitiateCheckout: "InitiateCheckout",
  Purchase: "CompletePayment",
};

export function track(event: "ViewContent" | "AddToCart" | "InitiateCheckout" | "Purchase", params: Params = {}) {
  if (typeof window === "undefined") return;
  const p = { currency: "AUD", ...params };
  const w = window as unknown as { fbq?: Fbq; ttq?: Ttq };
  try {
    w.fbq?.("track", event, { ...p, content_type: "product" });
  } catch {}
  try {
    w.ttq?.track(TIKTOK_EVENT[event], {
      value: p.value,
      currency: p.currency,
      contents: p.content_ids?.map((id) => ({ content_id: id, content_name: p.content_name })),
    });
  } catch {}
}
