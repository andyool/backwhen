"use client";

import type { ComponentProps } from "react";
import { say } from "@/lib/say";

// Click it and, well.
export default function NothingInteresting({ children, ...rest }: ComponentProps<"button">) {
  return (
    <button type="button" {...rest} onClick={() => say("Nothing interesting happens.")}>
      {children}
    </button>
  );
}
