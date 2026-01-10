"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { IoStar } from "react-icons/io5";

interface ProductCardProps {
  product: any;
  cartVariantIds: Set<string>;
  onCardClick: (productId: string) => void;
  onAddToCart: (e: React.MouseEvent, product: any) => void;
}

export default function ProductCard({
  product,
  cartVariantIds,
  onCardClick,
  onAddToCart,
}: ProductCardProps) {
  const [averageRating, setAverageRating] = useState<number>(0);
  const [reviewCount, setReviewCount] = useState<number>(0);

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        // Try both full ID and extracted ID
        let productId = product.id;

        // First try with full ID
        let response = await fetch(
          `/api/reviews/${encodeURIComponent(productId)}`
        );

        let data = await response.json();
        console.log("Reviews API response:", { productId, data });

        // Check both possible response formats
        const reviewList = data.data || data.reviews || [];

        if (response.ok && reviewList.length > 0) {
          const avgRating =
            reviewList.reduce(
              (sum: number, review: any) => sum + review.rating,
              0
            ) / reviewList.length;
          setAverageRating(avgRating);
          setReviewCount(reviewList.length);
        } else if (!response.ok && product.id.includes("/")) {
          // If full ID didn't work, try extracted ID
          const extractedId = product.id.split("/").pop();
          response = await fetch(
            `/api/reviews/${encodeURIComponent(extractedId)}`
          );
          data = await response.json();
          console.log("Reviews API response (extracted):", {
            extractedId,
            data,
          });

          const reviewList2 = data.data || data.reviews || [];
          if (response.ok && reviewList2.length > 0) {
            const avgRating =
              reviewList2.reduce(
                (sum: number, review: any) => sum + review.rating,
                0
              ) / reviewList2.length;
            setAverageRating(avgRating);
            setReviewCount(reviewList2.length);
          }
        }
      } catch (error) {
        console.error("Error fetching reviews:", error);
      }
    };

    fetchReviews();
  }, [product.id]);

  const variantId = product.variants?.edges?.[0]?.node?.id;
  const isInCart = variantId && cartVariantIds.has(variantId);
  const compareAtPrice =
    product.variants?.edges?.[0]?.node?.compareAtPrice?.amount;

  return (
    <div
      key={product.id}
      onClick={() => onCardClick(encodeURIComponent(product.id))}
      className="slide-animation  bg-zinc-900 rounded-lg shadow-md hover:shadow-lg hover:scale-105 transition overflow-hidden flex flex-col h-full cursor-pointer"
    >
      {product.images?.edges?.[0] && (
        <div className="relative w-full h-48">
          <Image
            src={product.images.edges[0].node.url}
            alt={product.images.edges[0].node.altText || product.title}
            fill
            className="object-cover"
          />
        </div>
      )}

      <div className="p-4 max-md:p-3 max-sm:p-2 flex flex-col flex-grow">
        <h3 className="text-lg mb-1 max-md:text-base max-sm:text-sm leading-tight font-montserrat font-medium line-clamp-1 text-white/90">
          {product.title}
        </h3>
        <p className="text-base max-md:text-sm max-sm:text-xs text-gray-600 line-clamp-2 flex-grow font-quicksand ">
          {product.description}
        </p>

        {/* Star Rating */}
        <div className="flex items-center gap-2 mt-2">
          <div className="flex items-center gap-0.5">
            {[...Array(5)].map((_, i) => {
              const fillPercentage = Math.max(
                0,
                Math.min(1, averageRating - i)
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
          {reviewCount > 0 && (
            <span className="text-xs text-gray-400 max-sm:text-[10px]">
              {averageRating.toFixed(1)} ({reviewCount})
            </span>
          )}
        </div>

        <div className=" bg-zinc-900 rounded-lg mt-3 flex flex-col items-start gap-2 justify-between w-full">
          <div className="flex items-center gap-2 w-full">
            <div className="font-bold text-lg mb-1 max-md:text-base max-sm:text-sm text-white/80">
              INR. {product.priceRange?.minVariantPrice?.amount}
            </div>
            {compareAtPrice && compareAtPrice != 0 && (
              <div className="font-light text-lg mb-1 max-md:text-base max-sm:text-sm line-through text-gray-500">
                {compareAtPrice}
              </div>
            )}
          </div>
          <button
            onClick={(e) => {
              e.stopPropagation();
              if (!isInCart) {
                onAddToCart(e, product);
              }
            }}
            className={`px-4 py-2 max-md:px-2 max-md:py-1 rounded-md text-sm font-medium w-full max-md:text-sm ${
              isInCart
                ? "bg-green-600 text-white hover:bg-green-700 cursor-default"
                : "bg-[#C9B27B] text-black hover:bg-[#b39f62] cursor-pointer"
            }`}
          >
            {isInCart ? "In Cart" : "Add to cart"}
          </button>
        </div>
      </div>
    </div>
  );
}
