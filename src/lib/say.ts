// Tiny event bus for one-line messages shown in the chat box (bottom-left).
export const SAY_EVENT = "backwhen:say";

export function say(text: string) {
  if (typeof window === "undefined") return;
  window.dispatchEvent(new CustomEvent(SAY_EVENT, { detail: text }));
}
