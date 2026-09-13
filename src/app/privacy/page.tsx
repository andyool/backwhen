import type { Metadata } from "next";
import { site } from "@/lib/site";

export const metadata: Metadata = { title: "Privacy" };

export default function PrivacyPage() {
  return (
    <div className="mx-auto w-full max-w-page px-5 pt-6 sm:px-8">
      <h1 className="display text-[44px] sm:text-[60px]">Privacy</h1>
      <div className="prose-page mt-8">
        <p>
          This site collects the minimum needed to make and post your order: your name, delivery address, email and phone (for the courier). Payment is handled entirely by Stripe; card numbers never reach this site. Your address and order contents are passed to our print partner (Printful) so they can print and ship it.
        </p>
        <p>
          Your cart is stored in your own browser, not on our server. We don&rsquo;t run advertising trackers on this site. If you want your order data deleted after delivery, email <a className="link" href={`mailto:${site.email}`}>{site.email}</a>.
        </p>
      </div>
    </div>
  );
}
