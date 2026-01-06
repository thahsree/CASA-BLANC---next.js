"use client";
import CartView from "@/components/CartView";

export default function CartPage() {
  return (
    <main className="min-h-screen p-6 bg-[#080808] pt-24">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-2xl max-sm:text-xl text-[#FFFFFF]/90 font-semibold mb-6">
          My Cart
        </h1>
        <CartView />
      </div>
    </main>
  );
}
