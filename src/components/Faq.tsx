import { zones } from "@/lib/shipping";
import { money } from "@/lib/format";
import { site } from "@/lib/site";

const au = zones.find((z) => z.id === "au");

const items: { q: string; a: React.ReactNode }[] = [
  {
    q: "How long until it arrives?",
    a: (
      <>
        Each piece is printed after you order it, which takes 2–5 business days. Then it ships from the print house nearest you — Australia usually from Brisbane — and takes {au?.estimate ?? "4–8 business days"}. You get a tracking email when it leaves.
      </>
    ),
  },
  {
    q: "What does shipping cost?",
    a: (
      <>
        {au ? `${money(au.rateCents)} flat in Australia, free over ${money(au.freeOverCents ?? 0)}. ` : ""}
        New Zealand, the US, Canada, the UK and most of Europe are flat rates too; you see yours in the cart before paying.
      </>
    ),
  },
  {
    q: "How do the sizes run?",
    a: <>Hoodies are relaxed with a dropped shoulder; tees are oversized and boxy. Every product page has a size guide in centimetres, measured flat. Between sizes, size up.</>,
  },
  {
    q: "Is it good quality?",
    a: <>Heavyweight AS Colour blanks: a brushed-fleece hoodie with a double-lined hood, and a heavy faded cotton tee. The design is printed direct-to-garment in one or two colours of ink, so it wears into the fabric like an old shop shirt instead of sitting on top like a sticker.</>,
  },
  {
    q: "Can I return it?",
    a: (
      <>
        Everything is made for you, so there are no change-of-mind returns. If it arrives damaged, misprinted or wrong, email {site.email} within 30 days with a photo and a replacement goes on the press free. Your Australian Consumer Law rights apply either way.
      </>
    ),
  },
  {
    q: "Will people know what it is?",
    a: <>Only the ones who were there. To everyone else it reads as an old lodge or general-store shirt: a place name, an address line, an est. date. No logos, no characters, no box art.</>,
  },
];

export default function Faq() {
  return (
    <div className="faq">
      {items.map((it) => (
        <details key={it.q} className="faq-item" data-reveal>
          <summary>
            <span>{it.q}</span>
            <span className="faq-mark" aria-hidden />
          </summary>
          <p className="faq-answer">{it.a}</p>
        </details>
      ))}
    </div>
  );
}
