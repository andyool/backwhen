"use client";

import { useEffect, useState } from "react";
import { site } from "@/lib/site";

// A one-second wordmark curtain on the first visit of the session.
export default function Preloader() {
  const [state, setState] = useState<"idle" | "show" | "leave" | "done">("idle");

  useEffect(() => {
    let seen = false;
    try {
      seen = sessionStorage.getItem("backwhen-intro") === "1";
    } catch {}
    if (seen || window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setState("done");
      document.documentElement.classList.add("intro-done");
      return;
    }
    document.documentElement.classList.add("intro-running");
    setState("show");
    const t1 = setTimeout(() => setState("leave"), 1150);
    const t2 = setTimeout(() => {
      document.documentElement.classList.remove("intro-running");
      document.documentElement.classList.add("intro-done");
      try {
        sessionStorage.setItem("backwhen-intro", "1");
      } catch {}
    }, 1400);
    const t3 = setTimeout(() => setState("done"), 2100);
    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
    };
  }, []);

  if (state === "done" || state === "idle") return null;

  return (
    <div className={`preloader ${state === "leave" ? "is-leaving" : ""}`} aria-hidden>
      <div className="preloader-mark">
        {Array.from(site.wordmark).map((ch, i) => (
          <span key={i} className="preloader-letter" style={{ animationDelay: `${120 + i * 55}ms` }}>
            {ch}
          </span>
        ))}
      </div>
      <p className="preloader-line">{site.tagline}</p>
      <div className="preloader-bar" aria-hidden>
        <span />
      </div>
      <p className="preloader-wait" aria-hidden>
        Loading — please wait.
      </p>
    </div>
  );
}
