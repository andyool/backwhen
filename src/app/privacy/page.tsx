import type { Metadata } from "next";

import { site } from "@/lib/site";

export const metadata: Metadata = { title: "Privacy" };

const pixels = !!(process.env.NEXT_PUBLIC_META_PIXEL_ID || process.env.NEXT_PUBLIC_TIKTOK_PIXEL_ID);

export default function PrivacyPage() {
  return (
    <div className="mx-auto w-full max-w-page px-5 pt-6 sm:px-8">
      <h1 className="display hero-in text-[44px] sm:text-[60px]">Privacy</h1>
      <div className="prose-page hero-in mt-8" style={{ ["--d" as string]: "100ms" }}>
        <p>
          This site collects the minimum needed to make and post your order: your name, delivery address, email and phone (for the courier). Payment is handled entirely by Stripe; card numbers never reach this site. Your address and order contents are passed to our print partner (Printful) so they can print and ship it.
        </p>
        <p>
          Your cart is stored in your own browser, not on our server. If you arrived from an ad or a tagged link, the campaign tag is kept in your browser for 30 days and attached to your order, so we know which ads work.
        </p>
        <p>
          {pixels
            ? "We use the Meta and/or TikTok advertising pixel to measure which ads lead to visits and purchases and to show our ads to people likely to be interested. They record pages viewed and items added or bought, not your card details. You can opt out through your Meta or TikTok ad settings or by blocking third-party cookies."
            : "We don’t run advertising trackers on this site."}{" "}
          If you want your order data deleted after delivery, email <a className="link" href={`mailto:${site.email}`}>{site.email}</a>.
        </p>
      </div>
    </div>
  );
}
