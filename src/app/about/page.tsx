import type { Metadata } from "next";
import SplitText from "@/components/fx/SplitText";
import DrawSign from "@/components/fx/DrawSign";
import { site } from "@/lib/site";

export const metadata: Metadata = { title: "About" };

export default function AboutPage() {
  return (
    <div className="mx-auto grid w-full max-w-page gap-12 px-5 pt-6 sm:px-8 lg:grid-cols-[3fr_2fr] lg:gap-20">
      <div>
        <SplitText as="h1" text="Places you were, back when." className="display block text-[44px] sm:text-[64px]" />
        <div className="prose-page mt-8">
          <p data-reveal style={{ ["--d" as string]: "300ms" }}>
            {site.name} makes clothing for places that only exist on a hard drive. The general store where you sold your first bronze dagger. The census office you stumbled out of, off the boat, into the fog. The inn that would still rent you a room.
          </p>
          <p data-reveal>
            Most fan apparel shouts. It has the logo on it, the character, the box art, the release date. It&rsquo;s a costume. The idea here is the opposite: draw the place the way a 1970s lumber mill or a mountain lodge would have drawn itself on a hoodie, in one colour of cream ink, with an address and an est. date, and let it pass as vintage to everyone who doesn&rsquo;t know. The people who know will know immediately.
          </p>
          <h2 data-reveal>How it&rsquo;s made</h2>
          <p data-reveal>
            Every design is drawn from the town itself — the rooflines, the bridges, the water — not from promotional art. It&rsquo;s printed to order on heavyweight fleece and heavy cotton at the print house nearest to you, so nothing is made that nobody wanted, and it doesn&rsquo;t cross an ocean to get to you.
          </p>
          <h2 data-reveal>Who</h2>
          <p data-reveal>
            One person in Western Australia who spent a large part of 2001–2008 in these places and would like a hoodie that says so, quietly. Suggestions for the next place go to{" "}
            <a className="link" href={`mailto:${site.email}`}>
              {site.email}
            </a>
            .
          </p>
        </div>
      </div>
      <div className="lg:sticky lg:top-32 lg:self-start">
        <DrawSign className="w-full text-bone/70" />
      </div>
    </div>
  );
}
