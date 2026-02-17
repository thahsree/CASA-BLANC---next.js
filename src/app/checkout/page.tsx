"use client";
import CheckoutForm from "@/components/CheckoutForm";
import OrderSummary from "@/components/OrderSummary";
import Link from "next/link";
import { Suspense } from "react";
import { IoChevronBack } from "react-icons/io5";

export default function CheckoutPage() {
  return (
    <div className="min-h-screen bg-[#080808] text-white pt-[100px]">
      <main className="max-w-7xl mx-auto px-4 md:px-8 py-6">
        {/* Breadcrumb / Back Link */}
        <div className="mb-8">
            <Link href="/cart" className="text-zinc-500 hover:text-zinc-300 transition text-sm flex items-center gap-1 font-quicksand w-fit">
                <IoChevronBack /> Return to Cart
            </Link>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-[1.2fr_0.8fr] gap-12 lg:gap-20">
          
          {/* Left Column: Form */}
          <div>
            <h1 className="text-3xl font-montserrat font-bold text-white mb-8">Checkout</h1>
            <CheckoutForm />
          </div>

          {/* Right Column: Order Summary */}
          <div>
            <Suspense fallback={<div className="text-white">Loading summary...</div>}>
               <OrderSummary />
            </Suspense>
          </div>
        </div>
      </main>
    </div>
  );
}
