"use client";
import { useCart } from "@/context/CartContext";
import { useQuery } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import ProductCard from "./ProductCard";
import ProductSkeleton from "./ProductSkeleton";

export default function ProductLanding() {
  const router = useRouter();
  const { addToCart, cartItemCount } = useCart();
  const [cartVariantIds, setCartVariantIds] = useState<Set<string>>(new Set());
  const [sortBy, setSortBy] = useState<
    "popularity" | "price-low" | "price-high"
  >("popularity");

  // Fetch cart to get variant IDs of items in cart
  const fetchCartVariants = async () => {
    try {
      const res = await fetch("/api/cart");
      if (!res.ok) return;
      const data = await res.json();
      // Adjust to match our new cart structure if needed, or keeping compatibility
      // The new structure is cart.cart.lines.edges
      const lines = data.cart?.lines?.edges || data.cart?.items || []; 
      const variantIds = new Set<string>();
      lines.forEach((item: any) => {
          // Handle both edge/node structure and direct array
        const variantId = item.node?.merchandise?.id || item.variantId;
        if (variantId) {
          variantIds.add(variantId);
        }
      });
      setCartVariantIds(variantIds);
    } catch (err) {
      console.error("Failed to fetch cart variants:", err);
    }
  };

  // React Query for Products
  const { data: productsData, isLoading, error } = useQuery({
      queryKey: ['products'],
      queryFn: async () => {
          const res = await fetch("/api/products");
          if (!res.ok) throw new Error("Failed to fetch products");
          return res.json();
      }
  });

  const { cartData } = useCart();
  
  // Update cartVariantIds from context data
  useEffect(() => {
      if (cartData?.cart?.lines?.edges) {
          const ids = new Set<string>();
          cartData.cart.lines.edges.forEach((edge: any) => {
              if (edge.node?.merchandise?.id) ids.add(edge.node.merchandise.id);
          });
          setCartVariantIds(ids);
      } else if (cartData?.cart?.items) {
           const ids = new Set<string>();
           cartData.cart.items.forEach((item: any) => {
               if (item.variantId) ids.add(item.variantId);
           });
           setCartVariantIds(ids);
      }
  }, [cartData]);


  if (isLoading)
    return (
      <div className="">
         <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
             {/* Skeleton Header */}
             <div className="h-8 w-48 bg-zinc-800 rounded animate-pulse"></div>
         </div>
         <div className="max-sm:px-1 max-md:px-3">
          <ProductSkeleton />
        </div>
      </div>
    );

  if (error) return <div className="text-red-600">Failed to load products</div>;

  const products = productsData?.products || [];

  const handleAddToCart = async (product: any) => {
    // Product variants are a flat array
    const variantId = product.variants?.[0]?._id;
    if (!variantId) {
      toast.error("Product variant not found");
      return;
    }
    try {
      await addToCart(variantId, 1);
      toast.success("Added to cart successfully!");
    } catch (err: any) {
      console.error("Error adding to cart:", err);
      toast.error(err.message || "Failed to add to cart");
    }
  };

  // Sort products based on selected criteria
  const sortedProducts = [...products].sort((a, b) => {
    if (sortBy === "popularity") {
        // Fallback or implement popularity if available
        return 0; 
    } else if (sortBy === "price-low") {
      const priceA = a.price || 0; 
      const priceB = b.price || 0;
      return priceA - priceB;
    } else if (sortBy === "price-high") {
       const priceA = a.price || 0; 
       const priceB = b.price || 0;
      return priceB - priceA;
    }
    return 0;
  });

  const handleCardClick = (productId: string) => {
    router.push(`/products/${productId}`);
  };

  return (
    <div className="">
      {/* Sorting Controls */}
      <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="flex items-center gap-3 max-md:gap-2 max-sm:gap-1">
          <label
            htmlFor="sort"
            className="font-quicksand font-semibold text-lg max-md:text-base max-sm:text-sm text-white/90"
          >
            Sort by:
          </label>
          <select
            id="sort"
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as any)}
            className="px-4 py-2 max-md:px-2 max-md:py-1 max-sm:px-1 border border-gray-300 rounded-lg font-quicksand focus:outline-none focus:ring-2 focus:ring-[#C9B27B] text-lg max-md:text-base max-sm:text-sm bg-zinc-900 text-white"
          >
            <option value="popularity">Popularity</option>
            <option value="price-low">Price: Low to High</option>
            <option value="price-high">Price: High to Low</option>
          </select>
        </div>
        <p className="text-sm text-gray-600 font-quicksand max-sm:text-xs">
          Showing {sortedProducts.length} products
        </p>
      </div>

      {/* Products Grid */}
      <div className="grid grid-cols-4 [@media(min-width:642px)_and_(max-width:1042px)]:grid-cols-3 max-md:grid-cols-3 max-sm:grid-cols-2 gap-6 max-md:gap-3 max-sm:gap-x-2 max-sm:gap-y-5 max-md:gap-y-4">
        {sortedProducts.map((product) => (
          <ProductCard
            key={product._id || product.id}
            product={product}
            cartVariantIds={cartVariantIds}
            onCardClick={handleCardClick}
            onAddToCart={(e, prod) => {
              e.stopPropagation();
              const variantId = prod.variants?.[0]?._id;
              const isInCart = variantId && cartVariantIds.has(variantId);
              if (!isInCart) {
                handleAddToCart(prod);
              }
            }}
          />
        ))}
      </div>
    </div>
  );
}


