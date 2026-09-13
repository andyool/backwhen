import type { Metadata } from "next";
import { site } from "@/lib/site";

export const metadata: Metadata = { title: "About" };

export default function AboutPage() {
  return (
    <div className="mx-auto w-full max-w-page px-5 pt-6 sm:px-8">
      <h1 className="display text-[44px] sm:text-[60px]">About</h1>
      <div className="prose-page mt-8">
        <p>
          {site.name} makes clothing for places that only exist on a hard drive. The general store where you sold your first bronze dagger. The census office you stumbled out of, off the boat, into the fog. The inn that would still rent you a room.
        </p>
        <p>
          Most fan apparel shouts. It has the logo on it, the character, the box art, the release date. It&rsquo;s a costume. The idea here is the opposite: draw the place the way a 1970s lumber mill or a mountain lodge would have drawn itself on a hoodie, in one colour of cream ink, with an address and an est. date, and let it pass as vintage to everyone who doesn&rsquo;t know. The people who know will know immediately.
        </p>
        <h2>How it&rsquo;s made</h2>
        <p>
          Every design is drawn from the town itself — the rooflines, the bridges, the water — not from promotional art. It&rsquo;s printed to order on heavyweight fleece and heavy cotton at the print house nearest to you, so nothing is made that nobody wanted, and it doesn&rsquo;t cross an ocean to get to you.
        </p>
        <h2>Who</h2>
        <p>
          One person in Western Australia who spent a large part of 2001–2008 in these places and would like a hoodie that says so, quietly. Suggestions for the next place go to <a className="link" href={`mailto:${site.email}`}>{site.email}</a>.
        </p>
      </div>
    </div>
  );
}
