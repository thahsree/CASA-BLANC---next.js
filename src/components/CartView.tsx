"use client";
import { useCart } from "@/context/CartContext";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import Loader from "./Loader";

export default function CartView() {
  const router = useRouter();
  const { cartData: cart, isLoading, updateQuantity, removeItem } = useCart();
  const [updatingLineId, setUpdatingLineId] = useState<string | null>(null);

  const handleCheckout = () => {
    console.log("Checkout cart", cart);
    // TODO: Implement actual checkout redirect or integration
    toast.info("Checkout functionality is coming soon!");
  };

  const handleUpdateQuantity = async (lineId: string, newQuantity: number) => {
    if (newQuantity < 1) return;

    setUpdatingLineId(lineId);
    try {
      await updateQuantity(lineId, newQuantity);
    } catch (err: any) {
      console.error("Error updating cart:", err);
      toast.error("Failed to update cart");
    } finally {
      setUpdatingLineId(null);
    }
  };

  const handleRemoveItem = async (lineId: string) => {
    if (!window.confirm("Are you sure you want to remove this item?")) return;
    setUpdatingLineId(lineId);
    try {
      await removeItem(lineId);
      toast.success("Item removed from cart");
    } catch (err: any) {
      console.error("Error removing item:", err);
      toast.error("Failed to remove item");
    } finally {
      setUpdatingLineId(null);
    }
  };

  if (isLoading && !cart) return <div className="h-[400px] flex items-center justify-center"><Loader /></div>;

  // Safely access lines from the MongoDB-style response structure
  // The structure is typically cart.lines.edges[].node or cart.items directly depending on API
  // Based on context.tsx: cartData?.cart?.lines?.edges
  // Based on api/cart/route.ts: formatCartResponse returns lines: { edges: [...] }
  const lines = cart?.cart?.lines?.edges?.map((edge: any) => edge.node) || [];

  if (!cart?.cart || lines.length === 0)
    return (
      <div className="flex flex-col items-center justify-center text-center gap-4 py-20">
        <div className="w-64 h-64 relative">
          <Image
            src="/emptyCart.svg"
            alt="Empty cart"
            fill
            className="object-contain"
          />
        </div>

        <h1 className="text-2xl font-semibold text-white/90 font-montserrat">
          Your cart is empty
        </h1>
        <p className="text-gray-500 font-quicksand">
          Start exploring and add items to your cart.
        </p>

        <button
          onClick={() => router.push("/products")}
          className="px-6 py-3 bg-[#C9B27B] text-black font-semibold rounded-md hover:bg-[#b5a265] transition font-montserrat"
        >
          Browse Products
        </button>
      </div>
    );

  return (
    <div className="space-y-4 font-quicksand">
      <h1 className="text-2xl max-sm:text-xl text-[#FFFFFF]/90 font-semibold mb-6 font-montserrat">
        My Cart
      </h1>
      {lines.map((line: any) => (
        <div
          key={line.id}
          className="flex items-center gap-4 bg-zinc-900 p-4 rounded shadow"
        >
          {line.merchandise?.image?.url && (
            <div className="w-20 h-20 relative shrink-0">
               <Image
                 src={line.merchandise.image.url}
                 alt={line.merchandise.product?.title || "Product Image"}
                 fill
                 className="object-cover rounded"
               />
            </div>
          )}
          <div className="flex-1 min-w-0">
            <div className="font-semibold max-sm:text-base max-md:text-lg mb-1 line-clamp-2 font-montserrat text-white/90">
              {line.merchandise?.product?.title || "Product"}
            </div>
             <div className="text-sm text-white/70 mb-2">
                {line.merchandise?.title !== "Default Title" && line.merchandise?.title}
             </div>
            <div className="text-sm text-white/90 mb-2 mt-1">
              ₹ {line.cost?.totalAmount?.amount ? (parseFloat(line.cost.totalAmount.amount) / line.quantity).toFixed(2) : "0.00"}{" "}
              {"/ unit"}
            </div>

            {/* Quantity Controls */}
            <div className="flex items-center gap-2 text-black/60">
              <button
                onClick={() => handleUpdateQuantity(line.id, line.quantity - 1)}
                disabled={updatingLineId === line.id || line.quantity <= 1}
                className="w-8 h-8 flex items-center justify-center bg-zinc-800 text-white hover:bg-zinc-700 disabled:opacity-50 disabled:cursor-not-allowed rounded text-sm font-semibold transition"
              >
                −
              </button>
              <span className="px-4 py-1 bg-zinc-800 text-white rounded text-sm font-semibold min-w-[3rem] text-center">
                {line.quantity}
              </span>
              <button
                onClick={() => handleUpdateQuantity(line.id, line.quantity + 1)}
                disabled={updatingLineId === line.id || line.quantity >= 5}
                className="w-8 h-8 flex items-center justify-center bg-zinc-800 text-white hover:bg-zinc-700 disabled:opacity-50 rounded text-sm font-semibold transition"
              >
                +
              </button>

              {/* Remove Button */}
              <button
                onClick={() => handleRemoveItem(line.id)}
                disabled={updatingLineId === line.id}
                className="ml-4 px-3 py-1 bg-red-500/10 text-red-500 hover:bg-red-500/20 disabled:opacity-50 rounded text-sm transition"
              >
                Remove
              </button>
            </div>
            {/* Total Price for this item (Mobile) */}
            <div className="block sm:hidden mt-3 pt-3 border-t border-white/10">
              <div className="font-semibold text-white/90 text-right">
                ₹ {parseFloat(line.cost?.totalAmount?.amount || "0").toFixed(2)}
              </div>
            </div>
          </div>

          {/* Total Price for this item (Desktop) */}
          <div className="text-right max-sm:hidden shrink-0">
            <div className="font-semibold text-white/90">
               ₹ {parseFloat(line.cost?.totalAmount?.amount || "0").toFixed(2)}
            </div>
          </div>
        </div>
      ))}

      <div className="flex justify-between items-center pt-6 border-t border-white/10 mt-8">
        <div className="text-lg font-semibold text-white/90 font-montserrat">Total</div>
        <div className="text-xl font-bold text-white/90 font-montserrat">
           ₹ {parseFloat(cart.cart.cost?.totalAmount?.amount || "0").toFixed(2)}
        </div>
      </div>

      <div className="flex justify-end pt-4">
        <button
          onClick={() => router.push("/checkout")}
          className="px-8 py-3 bg-[#C9B27B] text-black font-bold rounded-md hover:bg-[#b5a265] transition font-montserrat shadow-lg"
        >
          Proceed to Checkout
        </button>
      </div>
    </div>
  );
}
