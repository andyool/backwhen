// GitHub Pages serves the site under /backwhen; next/link handles that on its
// own but next/image and raw <img> src values need the prefix added by hand.
export const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

export function asset(publicPath: string): string {
  return `${basePath}${publicPath}`;
}

/** True when the build is the static GitHub Pages preview (no checkout). */
export const isStaticPreview = process.env.NEXT_PUBLIC_STATIC === "1";
