import type { Metadata } from "next";
import CartContents from "@/components/CartContents";

export const metadata: Metadata = { title: "Cart" };

export default function CartPage() {
  return (
    <div className="mx-auto w-full max-w-[560px] px-0 pt-4 sm:px-8">
      <h1 className="display hero-in px-5 pb-6 text-[44px] sm:px-6 sm:text-[56px]">Inventory</h1>
      <div className="flex min-h-[60svh] flex-col bg-charcoal">
        <CartContents />
      </div>
    </div>
  );
}
