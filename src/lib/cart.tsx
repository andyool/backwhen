"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useReducer } from "react";
import { resolveSku, type ResolvedSku } from "./products";

export type CartItem = { sku: string; qty: number };

type State = { items: CartItem[]; hydrated: boolean };

type Action =
  | { type: "hydrate"; items: CartItem[] }
  | { type: "add"; sku: string; qty: number }
  | { type: "set"; sku: string; qty: number }
  | { type: "remove"; sku: string }
  | { type: "clear" };

const STORAGE_KEY = "elsewhere-cart-v1";
const MAX_QTY = 10;

function reducer(state: State, action: Action): State {
  switch (action.type) {
    case "hydrate":
      return { items: action.items, hydrated: true };
    case "add": {
      const existing = state.items.find((i) => i.sku === action.sku);
      const items = existing
        ? state.items.map((i) =>
            i.sku === action.sku ? { ...i, qty: Math.min(MAX_QTY, i.qty + action.qty) } : i,
          )
        : [...state.items, { sku: action.sku, qty: Math.min(MAX_QTY, action.qty) }];
      return { ...state, items };
    }
    case "set":
      return {
        ...state,
        items: state.items
          .map((i) => (i.sku === action.sku ? { ...i, qty: Math.min(MAX_QTY, action.qty) } : i))
          .filter((i) => i.qty > 0),
      };
    case "remove":
      return { ...state, items: state.items.filter((i) => i.sku !== action.sku) };
    case "clear":
      return { ...state, items: [] };
  }
}

export type CartLine = ResolvedSku & { qty: number; lineTotalCents: number };

type CartContextValue = {
  items: CartItem[];
  lines: CartLine[];
  count: number;
  subtotalCents: number;
  hydrated: boolean;
  add: (sku: string, qty?: number) => void;
  setQty: (sku: string, qty: number) => void;
  remove: (sku: string) => void;
  clear: () => void;
};

const CartContext = createContext<CartContextValue | null>(null);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(reducer, { items: [], hydrated: false });

  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      const parsed: CartItem[] = raw ? JSON.parse(raw) : [];
      // Drop anything that no longer resolves against the catalogue.
      dispatch({ type: "hydrate", items: parsed.filter((i) => resolveSku(i.sku) && i.qty > 0) });
    } catch {
      dispatch({ type: "hydrate", items: [] });
    }
  }, []);

  useEffect(() => {
    if (!state.hydrated) return;
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state.items));
    } catch {
      /* storage unavailable (private mode etc) — cart still works for the session */
    }
  }, [state.items, state.hydrated]);

  const lines = useMemo<CartLine[]>(
    () =>
      state.items.flatMap((i) => {
        const r = resolveSku(i.sku);
        return r ? [{ ...r, qty: i.qty, lineTotalCents: r.garment.priceCents * i.qty }] : [];
      }),
    [state.items],
  );

  const add = useCallback((sku: string, qty = 1) => dispatch({ type: "add", sku, qty }), []);
  const setQty = useCallback((sku: string, qty: number) => dispatch({ type: "set", sku, qty }), []);
  const remove = useCallback((sku: string) => dispatch({ type: "remove", sku }), []);
  const clear = useCallback(() => dispatch({ type: "clear" }), []);

  const value: CartContextValue = {
    items: state.items,
    lines,
    count: lines.reduce((n, l) => n + l.qty, 0),
    subtotalCents: lines.reduce((n, l) => n + l.lineTotalCents, 0),
    hydrated: state.hydrated,
    add,
    setQty,
    remove,
    clear,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart(): CartContextValue {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used inside <CartProvider>");
  return ctx;
}
