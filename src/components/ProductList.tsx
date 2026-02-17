"use client";

import Loader from "@/components/Loader";
import { useCart } from "@/context/CartContext";
import { SKELETON_BLUR_URLS } from "@/lib/skeletonUtils";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { IoStar } from "react-icons/io5";
import { toast } from "sonner";

interface Product {
  _id: string; // Changed from id to _id
  title: string;
  description: string;
  handle: string;
  price: number; // Changed from priceRange
  compareAtPrice?: number;
  images: Array<{
    url: string;
    altText?: string;
  }>;
  variants: Array<{
    _id: string;
    title: string;
    price: number;
    compareAtPrice?: number;
    inventoryQuantity?: number;
  }>;
  averageRating?: number;
  reviewCount?: number;
}

interface ReviewStats {
  averageRating: number;
  totalReviews: number;
}

export default function ProductList() {
  const { addToCart, cartItemCount } = useCart();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [cartVariantIds, setCartVariantIds] = useState<Set<string>>(new Set());
  const [currentIndex, setCurrentIndex] = useState(0);
  const [itemsPerView, setItemsPerView] = useState(4);
  const [dragStart, setDragStart] = useState(0);
  const [dragEnd, setDragEnd] = useState(0);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const timestamp = Date.now();
        const response = await fetch(`/api/products`, {
          cache: "no-store",
          headers: {
            "Cache-Control": "no-cache, no-store, must-revalidate",
            Pragma: "no-cache",
            Expires: "0",
          },
        });
        const data = await response.json();
        const fetchedProducts = data.products || [];
        setProducts(fetchedProducts);
      } catch (err) {
        setError("Failed to load products");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();

    const updateItemsPerView = () => {
      if (window.innerWidth < 640) {
        setItemsPerView(2);
      } else if (window.innerWidth < 1024) {
        setItemsPerView(3);
      } else {
        setItemsPerView(4);
      }
    };

    updateItemsPerView();
    window.addEventListener("resize", updateItemsPerView);
    return () => window.removeEventListener("resize", updateItemsPerView);
  }, []);

  const fetchCartVariants = async () => {
    try {
      const res = await fetch("/api/cart");
      if (!res.ok) return;
      const data = await res.json();
      // Cart API now returns lines.edges structure to match what we kept in backend
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
      handleNext();
    } else if (clientX - dragStart > 50) {
      handlePrevious();
    }
  };

  const getTotalSlides = Math.ceil(products.length / itemsPerView);
  const currentSlide = Math.floor(currentIndex / itemsPerView);

  const visibleProducts = products.slice(
    currentIndex,
    currentIndex + itemsPerView
  );

  const handleAddToCart = async (product: Product) => {
    const variantId = product.variants[0]?._id;
    if (!variantId) {
      toast.error("Product variant not found");
      return;
    }
    try {
      await addToCart(variantId, 1);
      toast.success("Added to cart");
    } catch (error: any) {
       console.error(error);
       toast.error(error.message || "Failed to add to cart");
    }
  };

  if (loading) {
    return <div className="py-20"><Loader /></div>;
  }

  if (error) {
    return <div className="text-center py-12 text-red-600">{error}</div>;
  }

  return (
    <div className="w-full">
      <style>{`
        @keyframes slideIn {
          from { opacity: 0; transform: translateX(20px); }
          to { opacity: 1; transform: translateX(0); }
        }
        .slide-animation { animation: slideIn 0.5s ease-in-out; }
        .slider-container { transition: all 0.3s ease-in-out; }
      `}</style>

      {products.length === 0 ? (
        <div className="text-center py-12">No products available</div>
      ) : (
        <>
          <div
            className="slider-container select-none"
            onMouseDown={handleDragStart}
            onMouseUp={handleDragEnd}
            onTouchStart={handleDragStart}
            onTouchEnd={handleDragEnd}
            style={{ cursor: "grab", userSelect: "none" }}
          >
            <div className="flex items-center justify-between gap-3 sm:gap-4 lg:gap-6">
              <div className="flex-1 min-w-0 overflow-hidden">
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4 lg:gap-6">
                  {visibleProducts.map((product, idx) => {
                    const variantId = product.variants[0]?._id;
                    const isInCart = variantId && cartVariantIds.has(variantId);
                    const shouldPrioritize = idx < 2;

                    return (
                      <Link
                        key={product._id}
                        href={`/products/${encodeURIComponent(product._id)}`}
                        className="slide-animation bg-white dark:bg-zinc-900 rounded-lg shadow-md hover:shadow-lg hover:scale-105 transition overflow-hidden flex flex-col h-full"
                      >
                        {product.images[0] && (
                          <div className="relative w-full h-40 sm:h-48 bg-gray-200 overflow-hidden">
                            <Image
                              src={product.images[0].url}
                              alt={product.images[0].altText || product.title}
                              fill
                              sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                              priority={shouldPrioritize}
                              loading={shouldPrioritize ? "eager" : "lazy"}
                              className="object-cover hover:scale-110 transition duration-300"
                              quality={75}
                              placeholder="blur"
                              blurDataURL={SKELETON_BLUR_URLS.productCard}
                            />
                          </div>
                        )}
                        <div className="p-3 sm:p-4 flex flex-col flex-1 max-sm:p-1">
                          <h3 className="font-semibold text-lg max-md:text-base max-sm:text-sm mb-2 line-clamp-1 font-montserrat">
                            {product.title}
                          </h3>

                          <p className="text-base max-md:text-sm max-sm:text-xs text-gray-600 dark:text-gray-400 mb-3 line-clamp-2 flex-1 font-quicksand">
                            {product.description?.replace(/<[^>]*>?/gm, '')}
                          </p>

                          {/* Star Rating - Matching ProductCard */}
                          <div className="flex items-center gap-2 mb-3">
                             <div className="flex items-center gap-0.5">
                               {[...Array(5)].map((_, i) => {
                                 const fillPercentage = Math.max(
                                   0,
                                   Math.min(1, (product.averageRating || 0) - i)
                                 );
                                 return (
                                   <div key={i} className="relative">
                                     <IoStar size={16} className="text-gray-500" />
                                     <div
                                       className="absolute top-0 left-0 overflow-hidden"
                                       style={{ width: `${fillPercentage * 100}%` }}
                                     >
                                       <IoStar size={16} className="text-yellow-400" />
                                     </div>
                                   </div>
                                 );
                               })}
                             </div>
                             <span className="text-xs text-gray-400 max-sm:text-[10px]">
                               {(product.averageRating || 0).toFixed(1)} ({product.reviewCount || 0})
                             </span>
                          </div>

                          <div className="flex flex-col gap-2 ">
                            <div className="flex items-center gap-2">
                              <span className="font-bold text-lg mb-1 max-md:text-base max-sm:text-sm">
                                ₹ {product.price}
                              </span>
                              {/* Compare at price logic for list */}
                              {(product.variants[0]?.compareAtPrice || product.compareAtPrice) && 
                               Number(product.variants[0]?.compareAtPrice || product.compareAtPrice) > product.price && (
                                <span className="font-light text-sm mb-1 line-through text-gray-500">
                                  {product.variants[0]?.compareAtPrice || product.compareAtPrice}
                                </span>
                              )}
                            </div>
                            <button
                              onClick={(e) => {
                                e.preventDefault();
                                if (!isInCart) {
                                  handleAddToCart(product);
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
          {/* Pagination controls ... */}
        </>
      )}
    </div>
  );
}


