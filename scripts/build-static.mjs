// Builds the static GitHub Pages version of the site into ./out.
// Moves the server-only routes (Stripe/Printful API, order success page)
// aside for the duration of the build, then puts them back.
//
//   NEXT_PUBLIC_BASE_PATH=/backwhen NEXT_PUBLIC_SITE_URL=https://andyool.github.io/backwhen \
//     node scripts/build-static.mjs

import fs from "node:fs/promises";
import path from "node:path";
import { spawnSync } from "node:child_process";

const excluded = ["src/app/api", "src/app/checkout"];
const parking = path.resolve(".static-excluded");
await fs.rm(parking, { recursive: true, force: true });
await fs.mkdir(parking, { recursive: true });

const moved = [];
try {
  for (const rel of excluded) {
    try {
      await fs.access(rel);
    } catch {
      continue;
    }
    const dest = path.join(parking, rel.replace(/\//g, "__"));
    await fs.rename(rel, dest);
    moved.push([rel, dest]);
  }
  await fs.rm("out", { recursive: true, force: true });
  const result = spawnSync("npx", ["next", "build"], {
    stdio: "inherit",
    env: { ...process.env, STATIC_EXPORT: "1", NEXT_PUBLIC_STATIC: "1" },
  });
  if (result.status !== 0) process.exitCode = result.status ?? 1;
  else {
    await fs.writeFile("out/.nojekyll", "");
    console.log("\nStatic site written to ./out");
  }
} finally {
  for (const [rel, dest] of moved) await fs.rename(dest, rel);
  await fs.rm(parking, { recursive: true, force: true });
}
