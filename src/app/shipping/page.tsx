import type { Metadata } from "next";
import SplitText from "@/components/fx/SplitText";
import { zones } from "@/lib/shipping";
import { money } from "@/lib/format";
import { site } from "@/lib/site";

export const metadata: Metadata = { title: "Shipping & returns" };

export default function ShippingPage() {
  return (
    <div className="mx-auto w-full max-w-page px-5 pt-6 sm:px-8">
      <SplitText as="h1" text="Shipping & returns" className="display block text-[44px] sm:text-[60px]" />
      <div className="prose-page mt-8" data-reveal style={{ ["--d" as string]: "300ms" }}>
        <h2>Shipping</h2>
        <p>
          Everything is printed after you order it, which takes 2–5 business days. Then it ships from the print house nearest you and you get a tracking email.
        </p>
        <ul className="mt-4 flex flex-col gap-2">
          {zones.map((z) => (
            <li key={z.id} className="flex flex-col gap-x-4 border-b border-seam pb-2 sm:flex-row sm:justify-between">
              <span>{z.label}</span>
              <span className="text-faded sm:text-right">
                {money(z.rateCents)}
                {z.freeOverCents ? `, free over ${money(z.freeOverCents)}` : ""} · {z.estimate}
              </span>
            </li>
          ))}
        </ul>
        <p className="mt-4">
          Duties and taxes on orders outside Australia are the buyer&rsquo;s responsibility, though most orders under local thresholds won&rsquo;t attract any.
        </p>
        <h2>Returns</h2>
        <p>
          Because each piece is made for you, we can&rsquo;t take returns for change of mind or size. Check the size guide on the product page; when in doubt, size up.
        </p>
        <p>
          If it arrives damaged, misprinted or wrong, email <a className="link" href={`mailto:${site.email}`}>{site.email}</a> within 30 days with a photo and your order number and a replacement goes on the press at no cost. This doesn&rsquo;t limit your rights under the Australian Consumer Law.
        </p>
      </div>
    </div>
  );
}
