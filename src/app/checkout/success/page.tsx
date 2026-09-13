import type { Metadata } from "next";
import Link from "next/link";
import { stripe } from "@/lib/stripe";
import { money } from "@/lib/format";
import ClearCart from "./ClearCart";
import SplitText from "@/components/fx/SplitText";

export const metadata: Metadata = { title: "Order placed" };
export const dynamic = "force-dynamic";

type Search = Promise<{ session_id?: string }>;

export default async function SuccessPage({ searchParams }: { searchParams: Search }) {
  const { session_id } = await searchParams;

  let email: string | null = null;
  let total: number | null = null;
  let paid = false;
  let reference: string | null = null;

  if (session_id) {
    try {
      const s = await stripe().checkout.sessions.retrieve(session_id);
      paid = s.payment_status === "paid";
      email = s.customer_details?.email ?? null;
      total = s.amount_total ?? null;
      reference = s.id.slice(-8).toUpperCase();
    } catch {
      /* fall through to the generic message */
    }
  }

  return (
    <div className="mx-auto w-full max-w-page px-5 pt-6 sm:px-8">
      {paid && <ClearCart />}
      <div className="max-w-[52ch]">
        <SplitText as="h1" text={paid ? "On its way to the press." : "Thanks."} className="display block text-[44px] sm:text-[60px]" />
        {paid ? (
          <>
            <p className="mt-6 text-[18px] text-faded">
              Order {reference} is in. {email ? `A receipt is on its way to ${email}.` : ""} {total !== null ? `Total charged ${money(total)}.` : ""}
            </p>
            <p className="mt-4 text-faded">
              Printing takes 2–5 business days, then it ships from the nearest print house and you&rsquo;ll get a tracking email. If anything looks wrong, reply to the receipt and it&rsquo;ll be sorted.
            </p>
          </>
        ) : (
          <p className="mt-6 text-[18px] text-faded">
            If you completed payment, a receipt will arrive shortly. If not, your cart is still here.
          </p>
        )}
        <Link href="/" className="btn-ghost mt-10">
          Back to the shop
        </Link>
      </div>
    </div>
  );
}
