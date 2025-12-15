"use client";
import CartView from "@/components/CartView";

export default function CartPage() {
  return (
    <main className="min-h-screen p-6 bg-gray-50">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-2xl font-semibold mb-6">Your Cart</h1>
        <CartView />
      </div>
    </main>
  );
}
