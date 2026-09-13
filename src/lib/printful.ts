// Minimal Printful v1 API client. Docs: https://developers.printful.com/docs/

const BASE = "https://api.printful.com";

type PrintfulEnvelope<T> = { code: number; result: T; error?: { message: string } };

function headers(): HeadersInit {
  const key = process.env.PRINTFUL_API_KEY;
  if (!key) throw new Error("PRINTFUL_API_KEY is not set.");
  const h: Record<string, string> = {
    Authorization: `Bearer ${key}`,
    "Content-Type": "application/json",
  };
  if (process.env.PRINTFUL_STORE_ID) h["X-PF-Store-Id"] = process.env.PRINTFUL_STORE_ID;
  return h;
}

async function call<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(`${BASE}${path}`, { ...init, headers: { ...headers(), ...(init?.headers ?? {}) } });
  const body = (await res.json().catch(() => null)) as PrintfulEnvelope<T> | null;
  if (!res.ok || !body || body.code >= 400) {
    const message = body?.error?.message ?? body?.result ?? res.statusText;
    throw new PrintfulError(res.status, `Printful ${path} failed: ${JSON.stringify(message)}`);
  }
  return body.result;
}

export class PrintfulError extends Error {
  constructor(public status: number, message: string) {
    super(message);
  }
}

export type PrintfulRecipient = {
  name: string;
  address1: string;
  address2?: string;
  city: string;
  state_code?: string;
  country_code: string;
  zip: string;
  email?: string;
  phone?: string;
};

export type PrintfulOrderItem = {
  sync_variant_id: number;
  quantity: number;
  /** What the customer paid per unit, as a decimal string — shows on packing slips */
  retail_price?: string;
  name?: string;
};

export type PrintfulOrder = {
  id: number;
  external_id: string | null;
  status: string;
};

export async function getOrderByExternalId(externalId: string): Promise<PrintfulOrder | null> {
  try {
    return await call<PrintfulOrder>(`/orders/@${encodeURIComponent(externalId)}`);
  } catch (e) {
    if (e instanceof PrintfulError && e.status === 404) return null;
    throw e;
  }
}

export async function createOrder(input: {
  externalId: string;
  recipient: PrintfulRecipient;
  items: PrintfulOrderItem[];
  confirm: boolean;
  packingSlipMessage?: string;
}): Promise<PrintfulOrder> {
  const params = new URLSearchParams({ confirm: String(input.confirm) });
  return call<PrintfulOrder>(`/orders?${params}`, {
    method: "POST",
    body: JSON.stringify({
      external_id: input.externalId,
      recipient: input.recipient,
      items: input.items,
      packing_slip: input.packingSlipMessage ? { message: input.packingSlipMessage } : undefined,
    }),
  });
}

// Used by scripts/printful-variants.mjs to list sync variants for the catalogue.
export type SyncProductSummary = { id: number; name: string; variants: number };
export async function listSyncProducts(): Promise<SyncProductSummary[]> {
  return call<SyncProductSummary[]>(`/store/products?limit=100`);
}
