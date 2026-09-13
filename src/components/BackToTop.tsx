"use client";

export default function BackToTop() {
  return (
    <button
      type="button"
      className="sweep shrink-0 text-faded hover:text-bone"
      onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
    >
      Back to top
    </button>
  );
}
