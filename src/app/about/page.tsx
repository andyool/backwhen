import type { Metadata } from "next";
import SplitText from "@/components/fx/SplitText";
import DrawSign from "@/components/fx/DrawSign";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: "About",
  description: "Most fan merch explains itself. This doesn't. The people who were there don't need it explained.",
};

export default function AboutPage() {
  return (
    <div className="mx-auto grid w-full max-w-page gap-12 px-5 pt-6 sm:px-8 lg:grid-cols-[3fr_2fr] lg:gap-20">
      <div>
        <SplitText as="h1" text="Why there’s no logo." className="display block text-[44px] sm:text-[64px]" />
        <div className="prose-page mt-8">
          <p data-reveal style={{ ["--d" as string]: "300ms" }}>
            {site.name} makes clothes for places that only ever existed on a hard drive. The general store where you sold your first dagger. The census office you stumbled into off the boat. The inn that would still rent you a room, no questions asked.
          </p>
          <p data-reveal>
            Most fan merch explains itself: the logo, the character, the box art, the release date, in case anyone missed it. We think that&rsquo;s the wrong way round. The people who were there don&rsquo;t need it explained, and everyone else doesn&rsquo;t need to know.
          </p>
          <p data-reveal>
            So each place is drawn the way an old lumber mill or mountain lodge would have drawn itself on a shirt: one colour of ink, a name, an address line, an est. date. To a stranger it&rsquo;s a good-looking vintage hoodie. To you it&rsquo;s a whole summer.
          </p>
          <h2 data-reveal>How it&rsquo;s made</h2>
          <p data-reveal>
            Every design is drawn from the place itself — the rooflines, the bridges, the water — never from promotional art. It&rsquo;s printed after you order it, on heavyweight fleece or heavy cotton, at the print house nearest you. Nothing gets made that nobody wanted, and nothing crosses an ocean it doesn&rsquo;t have to.
          </p>
          <h2 data-reveal>Who</h2>
          <p data-reveal>
            One person in Western Australia who lost a good part of 2001–2008 to these places and wanted a hoodie that said so, quietly. If there&rsquo;s a place you&rsquo;d wear, say which:{" "}
            <a className="link" href={`mailto:${site.email}`}>
              {site.email}
            </a>
            . You won&rsquo;t have to explain it.
          </p>
        </div>
      </div>
      <div className="lg:sticky lg:top-32 lg:self-start">
        <DrawSign className="w-full text-bone/70" />
      </div>
    </div>
  );
}
