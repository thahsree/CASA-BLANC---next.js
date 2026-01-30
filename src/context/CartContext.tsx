"use client";
import React, {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

interface CartContextType {
  cartItemCount: number;
  setCartItemCount: (count: number) => void;
  updateCartCount: () => Promise<void>;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [cartItemCount, setCartItemCount] = useState<number>(0);
  const lastFetchRef = useRef<number>(0);
  const CACHE_DURATION = 30000; // 30 seconds

  // Fetch cart count from API with caching
  const updateCartCount = async () => {
    const now = Date.now();

    // Skip if fetched recently (within cache duration)
    if (now - lastFetchRef.current < CACHE_DURATION) {
      return;
    }

    try {
      const res = await fetch("/api/cart", { cache: "no-store" });
      if (!res.ok) {
        console.error("Failed to fetch cart:", res.status);
        return;
      }
      const data = await res.json();
      const lines = data.cart?.lines?.edges || [];
      const totalItems = lines.reduce(
        (sum: number, edge: any) => sum + (edge.node?.quantity || 0),
        0
      );
      setCartItemCount(totalItems);
      lastFetchRef.current = now;
    } catch (err) {
      console.error("Failed to fetch cart count:", err);
    }
  };

  // Fetch cart count on mount only
  useEffect(() => {
    updateCartCount();
  }, []);

  // Memoize context value to ensure stability
  const value = useMemo(
    () => ({ cartItemCount, setCartItemCount, updateCartCount }),
    [cartItemCount]
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
}
