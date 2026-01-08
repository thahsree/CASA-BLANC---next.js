"use client";
import { useCart } from "@/context/CartContext";
import { useEffect, useState } from "react";
import CartSkeleton from "./CartSkeleton";

// CartView: a small client component that interacts with existing /api/cart
// API routes to create/add lines and to fetch the cart. Uses session cookies
// to persist the cart id across page reloads.
export default function CartView() {
  const { updateCartCount } = useCart();
  const [cart, setCart] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [updatingLineId, setUpdatingLineId] = useState<string | null>(null);

  // Helper to load cart from server using session or stored cartId
  const loadCart = async () => {
    try {
      const res = await fetch("/api/cart");
      if (!res.ok) throw new Error("Failed to fetch cart");
      const body = await res.json();
      setCart(body.cart || null);
    } catch (err: any) {
      console.error(err);
      setError(err.message || "Could not load cart");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCart();
  }, []);

  const handleCheckout = () => {
    // In a real app you would redirect to Shopify checkout or build a
    // storefront checkout flow. For now just log the cart contents.
    console.log("Checkout cart", cart);
    if (cart?.checkoutUrl) {
      window.location.href = cart.checkoutUrl;
    } else {
      alert("Checkout URL not available. Cart may have expired.");
    }
  };

  const handleUpdateQuantity = async (lineId: string, newQuantity: number) => {
    if (newQuantity < 1) {
      handleRemoveItem(lineId);
      return;
    }

    setUpdatingLineId(lineId);
    try {
      const response = await fetch("/api/cart", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "update",
          cartId: cart.id,
          lines: [{ id: lineId, quantity: newQuantity }],
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data?.error || "Failed to update cart");
      }

      setCart(data.cart || null);
      await updateCartCount();
    } catch (err: any) {
      console.error("Error updating cart:", err);
      alert("Failed to update cart: " + (err.message || "Unknown error"));
    } finally {
      setUpdatingLineId(null);
    }
  };

  const handleRemoveItem = async (lineId: string) => {
    setUpdatingLineId(lineId);
    try {
      const response = await fetch("/api/cart", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "remove",
          cartId: cart.id,
          lineIds: [lineId],
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data?.error || "Failed to remove item");
      }

      setCart(data.cart || null);
      await updateCartCount();
      alert("Item removed from cart");
    } catch (err: any) {
      console.error("Error removing item:", err);
      alert("Failed to remove item: " + (err.message || "Unknown error"));
    } finally {
      setUpdatingLineId(null);
    }
  };

  if (loading) return <CartSkeleton />;
  if (error) return <div className="text-red-600">Error: {error}</div>;

  const lines = cart?.lines?.edges?.map((edge: any) => edge.node) || [];

  if (!cart || lines.length === 0) return <div>Your cart is empty.</div>;

  return (
    <div className="space-y-4">
      {lines.map((line: any) => (
        <div
          key={line.id}
          className="flex items-center gap-4 bg-zinc-900 p-4 rounded shadow"
        >
          {line.merchandise?.image?.url && (
            <img
              src={line.merchandise.image.url}
              alt={line.merchandise?.title || ""}
              className="w-20 h-20 object-cover rounded"
            />
          )}
          <div className="flex-1">
            <div className="font-semibold max-sm:text-base max:md:text-lg mb-2 line-clamp-2 font-montserrat text-white/90">
              {line.merchandise?.product?.title || "Product"}
            </div>
            <div className="text-sm text-white/90 mb-2 mt-1">
              Price: {line.cost?.totalAmount.currencyCode}{" "}
              {line.quantity > 0
                ? (line.cost?.totalAmount.amount / line.quantity).toFixed(2)
                : line.cost?.totalAmount.amount}{" "}
              {"/unit"}
            </div>

            {/* Quantity Controls */}
            <div className="flex items-center gap-2 text-black/60">
              <button
                onClick={() => handleUpdateQuantity(line.id, line.quantity - 1)}
                disabled={updatingLineId === line.id}
                className="px-2 py-1 bg-gray-300 hover:bg-gray-400 disabled:opacity-50 rounded text-sm font-semibold"
              >
                −
              </button>
              <span className="px-4 py-1 bg-gray-100 rounded text-sm font-semibold">
                {line.quantity}
              </span>
              <button
                onClick={() => handleUpdateQuantity(line.id, line.quantity + 1)}
                disabled={updatingLineId === line.id || line.quantity >= 5}
                className="px-2 py-1 bg-gray-300 hover:bg-gray-400 disabled:opacity-50 rounded text-sm font-semibold"
              >
                +
              </button>

              {/* Remove Button */}
              <button
                onClick={() => handleRemoveItem(line.id)}
                disabled={updatingLineId === line.id}
                className="ml-4 px-3 py-1 bg-red-500 hover:bg-red-600 disabled:opacity-50 text-white rounded text-sm"
              >
                Remove
              </button>
            </div>
            {/* Total Price for this item */}
            <div className="hidden text-right max-sm:block mt-4">
              <div className="font-semibold text-white/90">
                {line.cost?.totalAmount?.currencyCode}{" "}
                {line.cost?.totalAmount?.amount}
              </div>
            </div>
          </div>

          {/* Total Price for this item */}
          <div className="text-right max-sm:hidden">
            <div className="font-semibold text-white/90">
              {line.cost?.totalAmount?.currencyCode}{" "}
              {line.cost?.totalAmount?.amount}
            </div>
          </div>
        </div>
      ))}

      <div className="flex justify-between items-center pt-4 border-t">
        <div className="text-lg font-semibold text-white/90">Total</div>
        <div className="text-xl font-bold text-white/90">
          {cart.cost?.totalAmount?.currencyCode}{" "}
          {cart.cost?.totalAmount?.amount}
        </div>
      </div>

      <div className="flex gap-3">
        <button
          onClick={handleCheckout}
          className="px-4 py-2 bg-[#C9B27B] rounded hover:bg-[#b5a265] transition"
        >
          Proceed to checkout
        </button>
      </div>
    </div>
  );
}
