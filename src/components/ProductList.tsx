"use client";

import { useCart } from "@/context/CartContext";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";

interface Product {
  id: string;
  title: string;
  description: string;
  handle: string;
  priceRange: {
    minVariantPrice: {
      amount: string;
      currencyCode: string;
    };
  };
  images: {
    edges: Array<{
      node: {
        url: string;
        altText: string;
      };
    }>;
  };
  variants: {
    edges: Array<{
      node: {
        id: string;
      };
    }>;
  };
}

export default function ProductList() {
  const { updateCartCount, cartItemCount } = useCart();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [cartVariantIds, setCartVariantIds] = useState<Set<string>>(new Set());
  const [currentIndex, setCurrentIndex] = useState(0);
  const [itemsPerView, setItemsPerView] = useState(4); // Default for desktop
  const [dragStart, setDragStart] = useState(0);
  const [dragEnd, setDragEnd] = useState(0);

  const navigate = (url: string) => {
    // Simple client-side navigation for environments without Router hooks
    window.location.href = url;
  };

  // Fetch cart to get variant IDs of items in cart
  const fetchCartVariants = async () => {
    try {
      const res = await fetch("/api/cart");
      if (!res.ok) return;
      const data = await res.json();
      const lines = data.cart?.lines?.edges || [];
      const variantIds = new Set<string>();
      lines.forEach((edge: any) => {
        const variantId = edge.node?.merchandise?.id;
        if (variantId) {
          variantIds.add(variantId);
        }
      });
      setCartVariantIds(variantIds);
    } catch (err) {
      console.error("Failed to fetch cart variants:", err);
    }
  };

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        console.log("Fetching products from /api/products");
        const response = await fetch("/api/products");
        const data = await response.json();
        setProducts(data.products?.edges?.map((edge: any) => edge.node) || []);
        console.log("Fetched products:", data);
      } catch (err) {
        setError("Failed to load products");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();

    // Handle responsive items per view
    const updateItemsPerView = () => {
      if (window.innerWidth < 640) {
        setItemsPerView(2); // Mobile
      } else if (window.innerWidth < 1024) {
        setItemsPerView(3); // Tablet
      } else {
        setItemsPerView(4); // Desktop
      }
    };

    updateItemsPerView();
    window.addEventListener("resize", updateItemsPerView);
    return () => window.removeEventListener("resize", updateItemsPerView);
  }, []);

  // Fetch cart variants on mount and when cart count changes
  useEffect(() => {
    fetchCartVariants();
  }, [cartItemCount]);

  const handlePrevious = () => {
    setCurrentIndex((prev) =>
      prev - itemsPerView < 0
        ? Math.max(0, products.length - itemsPerView)
        : prev - itemsPerView
    );
  };

  const handleNext = () => {
    setCurrentIndex((prev) =>
      prev + itemsPerView >= products.length ? 0 : prev + itemsPerView
    );
  };

  const handleDragStart = (e: React.MouseEvent | React.TouchEvent) => {
    const clientX = "touches" in e ? e.touches[0].clientX : e.clientX;
    setDragStart(clientX);
  };

  const handleDragEnd = (e: React.MouseEvent | React.TouchEvent) => {
    const clientX =
      "changedTouches" in e
        ? e.changedTouches[0].clientX
        : (e as React.MouseEvent).clientX;
    setDragEnd(clientX);

    if (dragStart - clientX > 50) {
      // Swiped left - go next
      handleNext();
    } else if (clientX - dragStart > 50) {
      // Swiped right - go previous
      handlePrevious();
    }
  };

  const getTotalSlides = Math.ceil(products.length / itemsPerView);
  const currentSlide = Math.floor(currentIndex / itemsPerView);

  const visibleProducts = products.slice(
    currentIndex,
    currentIndex + itemsPerView
  );

  if (loading) {
    return <div className="text-center py-12">Loading products...</div>;
  }

  if (error) {
    return <div className="text-center py-12 text-red-600">{error}</div>;
  }

  return (
    <div className="w-full">
      <style>{`
        @keyframes slideIn {
          from {
            opacity: 0;
            transform: translateX(20px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }
        .slide-animation {
          animation: slideIn 0.5s ease-in-out;
        }
        .slider-container {
          transition: all 0.3s ease-in-out;
        }
      `}</style>

      {products.length === 0 ? (
        <div className="text-center py-12">No products available</div>
      ) : (
        <>
          {/* Slider Container with Drag Support */}
          <div
            className="slider-container select-none"
            onMouseDown={handleDragStart}
            onMouseUp={handleDragEnd}
            onTouchStart={handleDragStart}
            onTouchEnd={handleDragEnd}
            style={{ cursor: "grab", userSelect: "none" }}
          >
            <div className="flex items-center justify-between gap-3 sm:gap-4 lg:gap-6">
              {/* Products Grid Slider */}
              <div className="flex-1 min-w-0 overflow-hidden">
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4 lg:gap-6">
                  {visibleProducts.map((product) => {
                    const variantId = product.variants.edges[0]?.node.id;
                    const isInCart = variantId && cartVariantIds.has(variantId);

                    return (
                      <Link
                        key={product.id}
                        href={`/products/${encodeURIComponent(product.id)}`}
                        className="slide-animation bg-white dark:bg-zinc-900 rounded-lg shadow-md hover:shadow-lg hover:scale-105 transition overflow-hidden flex flex-col h-full"
                      >
                        {product.images.edges[0] && (
                          <div className="relative w-full h-40 sm:h-48 bg-gray-200 overflow-hidden">
                            <Image
                              src={product.images.edges[0].node.url}
                              alt={
                                product.images.edges[0].node.altText ||
                                product.title
                              }
                              fill
                              className="object-cover hover:scale-110 transition duration-300"
                            />
                          </div>
                        )}
                        <div className="p-3 sm:p-4 flex flex-col flex-1">
                          <h3 className="font-semibold max-sm:text-base max:md:text-lg mb-2 line-clamp-1 font-montserrat">
                            {product.title}
                          </h3>
                          <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 mb-3 line-clamp-2 flex-1 font-quicksand">
                            {product.description}
                          </p>

                          {/* Price and Button */}
                          <div className="flex flex-col gap-2 ">
                            <span className="font-bold text-sm sm:text-base">
                              {product.priceRange.minVariantPrice.currencyCode}{" "}
                              {product.priceRange.minVariantPrice.amount}
                              {/* add current price here */}
                            </span>
                            <button
                              onClick={(e) => {
                                e.preventDefault();
                                if (!isInCart) {
                                  handleAddToCart(product, updateCartCount);
                                }
                              }}
                              className={`${
                                isInCart
                                  ? "bg-green-600 hover:bg-green-700 cursor-default"
                                  : "bg-blue-600 hover:bg-blue-700 cursor-pointer"
                              } text-white px-2 sm:px-3 py-1 sm:py-2 rounded text-xs sm:text-sm transition font-medium hover:scale-105 active:scale-95`}
                            >
                              {isInCart ? "In Cart" : "Add"}
                            </button>
                          </div>
                        </div>
                      </Link>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>

          {/* Bullet Navigation */}
          {getTotalSlides > 1 && (
            <div className="mt-4 sm:mt-6 flex justify-center gap-2">
              {Array.from({ length: getTotalSlides }).map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentIndex(index * itemsPerView)}
                  className={`h-2 sm:h-3 rounded-full transition-all duration-300 ${
                    index === currentSlide
                      ? "bg-blue-600 w-6 sm:w-8"
                      : "bg-gray-400 w-2 sm:w-3 hover:bg-gray-500"
                  }`}
                  aria-label={`Go to slide ${index + 1}`}
                />
              ))}
            </div>
          )}

          {/* Pagination Text */}
        </>
      )}
    </div>
  );
}

async function handleAddToCart(
  product: Product,
  updateCartCount: () => Promise<void>
) {
  try {
    // Get or create cart
    let cartId = localStorage.getItem("cartId");

    if (!cartId) {
      const cartResponse = await fetch("/api/cart", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "create" }),
      });
      if (!cartResponse.ok) {
        const errorData = await cartResponse.json();
        throw new Error(
          errorData?.error || `Cart creation failed: ${cartResponse.status}`
        );
      }

      const cartData = await cartResponse.json();
      cartId = cartData.cart?.id;
      if (!cartId) {
        throw new Error("No cart ID returned from create cart");
      }
      localStorage.setItem("cartId", cartId);
    }

    // Add to cart
    const variantId = product.variants.edges[0]?.node.id;
    if (!variantId) {
      alert("Product variant not found");
      return;
    }

    const addResponse = await fetch("/api/cart", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        action: "add",
        cartId,
        variantId,
        quantity: 1,
      }),
    });

    if (!addResponse.ok) {
      const errorData = await addResponse.json();
      throw new Error(
        errorData?.error || `Add to cart failed: ${addResponse.status}`
      );
    }

    const addData = await addResponse.json();

    if (addData?.error) {
      throw new Error(addData.error);
    }

    // Update cart count in context
    await updateCartCount();
    alert("Added to cart successfully!");
  } catch (err: any) {
    console.error("Error adding to cart:", err);
    alert("Failed to add to cart: " + (err.message || "Unknown error"));
  }
}
