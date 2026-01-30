"use client";
import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

export interface CartItem {
  id: string;
  quantity: number;
  merchandise?: {
    id: string;
    title: string;
  };
}

interface CartContextType {
  cartItemCount: number;
  cartItems: CartItem[];
  setCartItemCount: (count: number) => void;
  setCartItems: (items: CartItem[]) => void;
  addToCartLocally: (item: CartItem) => void;
  fetchCartFromAPI: () => Promise<void>;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [cartItemCount, setCartItemCount] = useState<number>(0);
  const [cartItems, setCartItems] = useState<CartItem[]>([]);

  // Fetch cart from API on mount only
  const fetchCartFromAPI = useCallback(async () => {
    try {
      const res = await fetch("/api/cart", { cache: "no-store" });
      if (!res.ok) {
        console.error("Failed to fetch cart:", res.status);
        return;
      }
      const data = await res.json();
      const lines = data.cart?.lines?.edges || [];

      // Parse cart items
      const items: CartItem[] = lines.map((edge: any) => ({
        id: edge.node?.id,
        quantity: edge.node?.quantity || 0,
        merchandise: {
          id: edge.node?.merchandise?.id,
          title: edge.node?.merchandise?.title,
        },
      }));

      const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);

      setCartItems(items);
      setCartItemCount(totalItems);
      console.log("Cart fetched from API:", totalItems);
    } catch (err) {
      console.error("Failed to fetch cart from API:", err);
    }
  }, []);

  // Add item to cart locally (after successful API call)
  const addToCartLocally = useCallback((newItem: CartItem) => {
    setCartItems((prevItems) => {
      // Check if item already exists
      const existingItem = prevItems.find(
        (item) => item.merchandise?.id === newItem.merchandise?.id
      );

      let updatedItems: CartItem[];
      if (existingItem) {
        // Update quantity
        updatedItems = prevItems.map((item) =>
          item.merchandise?.id === newItem.merchandise?.id
            ? { ...item, quantity: newItem.quantity }
            : item
        );
      } else {
        // Add new item
        updatedItems = [...prevItems, newItem];
      }

      // Update count
      const totalItems = updatedItems.reduce(
        (sum, item) => sum + item.quantity,
        0
      );
      setCartItemCount(totalItems);

      console.log("Cart updated locally. New count:", totalItems);
      return updatedItems;
    });
  }, []);

  // Fetch cart on mount
  useEffect(() => {
    fetchCartFromAPI();
  }, [fetchCartFromAPI]);

  // Memoize context value
  const value = useMemo(
    () => ({
      cartItemCount,
      cartItems,
      setCartItemCount,
      setCartItems,
      addToCartLocally,
      fetchCartFromAPI,
    }),
    [cartItemCount, cartItems, addToCartLocally, fetchCartFromAPI]
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
