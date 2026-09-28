import { zones } from "@/lib/shipping";
import { money } from "@/lib/format";
import { site } from "@/lib/site";

const au = zones.find((z) => z.id === "au");

const items: { q: string; a: React.ReactNode }[] = [
  {
    q: "Will people get it?",
    a: <>The right ones will, from across a room. Everyone else reads it as an old general-store or lodge shirt: a name, an address line, an est. date. That&rsquo;s the whole idea.</>,
  },
  {
    q: "Why no logo?",
    a: <>Anyone who&rsquo;d recognise the logo would recognise the inn. And the inn is better drawn. A logo turns a shirt into a costume; a place name turns it into a secret.</>,
  },
  {
    q: "How long until it turns up?",
    a: (
      <>
        It&rsquo;s printed after you order, which takes 2–5 business days. Then it ships from the print house nearest you — Brisbane for most of Australia — and takes {au?.estimate ?? "4–8 business days"}. You get tracking when it leaves.
      </>
    ),
  },
  {
    q: "What does shipping cost?",
    a: (
      <>
        {au ? `${money(au.rateCents)} flat in Australia, free over ${money(au.freeOverCents ?? 0)}. ` : ""}
        New Zealand, the US, Canada, the UK and most of Europe are flat rates too. You see yours in the cart before you pay anything.
      </>
    ),
  },
  {
    q: "How does it fit?",
    a: <>Hoodies are relaxed with a dropped shoulder; tees are oversized and boxy. Every product page has a size guide in centimetres, measured flat. Between sizes, size up.</>,
  },
  {
    q: "Is it any good?",
    a: <>Heavyweight AS Colour blanks: brushed-fleece hoodies with a double-lined hood, heavy faded cotton tees. The ink is printed into the fabric, so it wears in like an old shop shirt instead of sitting on top like a sticker.</>,
  },
  {
    q: "Can I send it back?",
    a: (
      <>
        It&rsquo;s made for you, so there are no change-of-mind returns. If it arrives damaged, misprinted or wrong, email {site.email} within 30 days with a photo and a replacement goes on the press, free. Your Australian Consumer Law rights apply either way.
      </>
    ),
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
