"use client";

import { useState } from "react";
import { site } from "@/lib/site";

const MAX = 150;

// "Which place should we draw next?" — one field, one click.
// Posts JSON to site.requestEndpoint (Formspree or similar) when configured;
// otherwise opens a prefilled email so nothing is lost before that's set up.
export default function PlaceRequest({ collection }: { collection: string }) {
  const [text, setText] = useState("");
  const [state, setState] = useState<"idle" | "sending" | "sent" | "error">("idle");

  const trimmed = text.trim();
  const canSend = trimmed.length > 0 && trimmed.length <= MAX && state !== "sending";

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!canSend) return;
    if (!site.requestEndpoint) {
      const subject = encodeURIComponent(`Place request: ${collection}`);
      const body = encodeURIComponent(`${trimmed}\n\n(${collection} collection)`);
      window.location.href = `mailto:${site.email}?subject=${subject}&body=${body}`;
      setState("sent");
      return;
    }
    setState("sending");
    try {
      const res = await fetch(site.requestEndpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify({ collection, request: trimmed, page: window.location.href }),
      });
      if (!res.ok) throw new Error(String(res.status));
      setState("sent");
      setText("");
    } catch {
      setState("error");
    }
  }

  if (state === "sent") {
    return (
      <p className="text-faded" aria-live="polite">
        Noted. If it gets drawn, it turns up here first.
      </p>
    );
  }

  return (
    <form onSubmit={submit} className="max-w-[52ch]">
      <label htmlFor={`request-${collection}`} className="block text-[18px]">
        Missing a place? Name it.
      </label>
      <div className="mt-3 flex gap-2">
        <input
          id={`request-${collection}`}
          type="text"
          value={text}
          maxLength={MAX}
          onChange={(e) => {
            setText(e.target.value.slice(0, MAX));
            if (state === "error") setState("idle");
          }}
          placeholder="The shop, inn or outpost, and where it is"
          autoComplete="off"
          className="min-w-0 flex-1 rounded-[2px] bg-flannel px-4 py-3 text-bone placeholder:text-faded/60"
        />
        <button type="submit" className="btn-primary shrink-0" disabled={!canSend}>
          {state === "sending" ? "Sending…" : "Send it"}
        </button>
      </div>
      <div className="small mt-2 flex justify-between gap-4 text-faded">
        <span aria-live="polite">{state === "error" ? `Couldn't send. Email ${site.email} instead.` : "One line is plenty."}</span>
        <span className="tabular-nums">
          {text.length}/{MAX}
        </span>
      </div>
    </form>
  );
}
