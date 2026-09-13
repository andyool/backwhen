import type { Metadata } from "next";
import CartView from "@/components/CartView";

export const metadata: Metadata = { title: "Cart" };

export default function CartPage() {
  return (
    <div className="mx-auto w-full max-w-page px-5 sm:px-8">
      <h1 className="display pb-10 pt-6 text-[44px] sm:text-[60px]">Cart</h1>
      <CartView />
    </div>
  );
}
