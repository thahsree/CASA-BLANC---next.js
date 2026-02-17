"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import React, { createContext, useContext, useEffect, useState } from "react";

interface CartContextType {
  cartItemCount: number;
  addToCart: (variantId: string, quantity: number) => Promise<void>;
  updateQuantity: (lineId: string, quantity: number) => Promise<void>;
  removeItem: (lineId: string) => Promise<void>;
  isLoading: boolean;
  cartData: any;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [cartId, setCartId] = useState<string | null>(null);
  const [isCheckingCart, setIsCheckingCart] = useState(true);
  const queryClient = useQueryClient();

  // Load cartId from localStorage on mount
  useEffect(() => {
    const storedCartId = localStorage.getItem("cartId");
    if (storedCartId) {
      if (/^[0-9a-fA-F]{24}$/.test(storedCartId)) {
        setCartId(storedCartId);
      } else {
        console.warn("Invalid cartId found in localStorage, clearing:", storedCartId);
        localStorage.removeItem("cartId");
        setCartId(null);
      }
    }
    setIsCheckingCart(false);
  }, []);

  // Fetch Cart Query
  const { data: cartData, isLoading: isCartLoading } = useQuery({
    queryKey: ["cart", cartId],
    queryFn: async () => {
      if (!cartId) return null;
      const res = await fetch(`/api/cart?cartId=${cartId}`);
      if (!res.ok) throw new Error("Failed to fetch cart");
      return res.json();
    },
    enabled: !!cartId,
  });

  // Calculate item count
  const cartItemCount = cartData?.cart?.lines?.edges?.reduce(
    (acc: number, edge: any) => acc + edge.node.quantity,
    0
  ) || 0;

  // Add to Cart Mutation
  const addToCartMutation = useMutation({
    mutationFn: async ({ variantId, quantity }: { variantId: string; quantity: number }) => {
      let currentCartId = cartId;

      console.log("Adding to cart:", { variantId, quantity, currentCartId });

      if (!currentCartId) {
         try {
             const createRes = await fetch("/api/cart", {
                 method: "POST",
                 headers: { "Content-Type": "application/json" },
                 body: JSON.stringify({ action: "create" }),
             });
             if (!createRes.ok) {
                 const err = await createRes.json();
                 throw new Error(err.error || "Failed to create cart");
             }
             const createData = await createRes.json();
             currentCartId = createData.cart.id;
             setCartId(currentCartId);
             localStorage.setItem("cartId", currentCartId!);
         } catch (e) {
             console.error("Cart creation error", e);
             throw e;
         }
      }

      // Now add item
      const res = await fetch("/api/cart", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "add",
          cartId: currentCartId,
          variantId,
          quantity,
        }),
      });

      if (!res.ok) {
          const err = await res.json();
          console.error("Add to cart failed response:", err);
          throw new Error(err.error || "Failed to add to cart");
      }
      return res.json();
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["cart", cartId] });
      // Also invalidate with the potentially new ID if we just created it
      if (data.cart?.id && data.cart.id !== cartId) {
          queryClient.invalidateQueries({ queryKey: ["cart", data.cart.id] });
      }
    },
  });

  const updateQuantityMutation = useMutation({
    mutationFn: async ({ lineId, quantity }: { lineId: string; quantity: number }) => {
      if (!cartId) return;
      const res = await fetch("/api/cart", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "update",
          cartId,
          lines: [{ id: lineId, quantity }],
        }),
      });
      if (!res.ok) {
           const err = await res.json();
           throw new Error(err.error || "Failed to update cart");
      }
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["cart", cartId] });
    },
  });

  const removeItemMutation = useMutation({
    mutationFn: async (lineId: string) => {
      if (!cartId) return;
      const res = await fetch("/api/cart", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "remove",
          cartId,
          lineIds: [lineId],
        }),
      });
      if (!res.ok) {
           const err = await res.json();
           throw new Error(err.error || "Failed to remove item");
      }
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["cart", cartId] });
    },
  });

  const addToCart = async (variantId: string, quantity: number) => {
    await addToCartMutation.mutateAsync({ variantId, quantity });
  };

  const updateQuantity = async (lineId: string, quantity: number) => {
    await updateQuantityMutation.mutateAsync({ lineId, quantity });
  };

  const removeItem = async (lineId: string) => {
    await removeItemMutation.mutateAsync(lineId);
  };

  return (
    <CartContext.Provider
      value={{
        cartItemCount,
        addToCart,
        updateQuantity,
        removeItem,
        cartData,
        isLoading: isCheckingCart || isCartLoading || addToCartMutation.isPending || updateQuantityMutation.isPending || removeItemMutation.isPending,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
}
