"use client";

import Image from "next/image";
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
  // Use denormalized stats from product, or default to 0
  const averageRating = product.averageRating || 0;
  const reviewCount = product.reviewCount || 0;

  const variantId = product.variants?.[0]?._id || product.variants?.edges?.[0]?.node?.id;
  const isInCart = variantId && cartVariantIds.has(variantId);
  
  // Helper to extract data regardless of structure (Shopify Edges vs Flat Array)
  const firstImage = product.images?.[0]?.url 
    ? { url: product.images[0].url, altText: product.images[0].altText }
    : product.images?.edges?.[0]?.node;

  const price = product.priceRange?.minVariantPrice?.amount 
    || product.variants?.[0]?.price 
    || product.variants?.edges?.[0]?.node?.price?.amount;

  const compareAtPrice = product.variants?.[0]?.compareAtPrice
    || product.variants?.edges?.[0]?.node?.compareAtPrice?.amount
    || product.compareAtPrice;

  const displayId = product._id || product.id;
  console.log(product,"product");

  return (
    <div
      key={displayId}
      onClick={() => onCardClick(encodeURIComponent(displayId))}
      className="slide-animation  bg-zinc-900 rounded-lg shadow-md hover:shadow-lg hover:scale-105 transition overflow-hidden flex flex-col h-full cursor-pointer"
    >
      {firstImage && (
        <div className="relative w-full h-48">
          <Image
            src={firstImage.url}
            alt={firstImage.altText || product.title}
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
          {product.description?.replace(/<[^>]*>?/gm, '')}
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
          <span className="text-xs text-gray-400 max-sm:text-[10px]">
            {averageRating.toFixed(1)} ({reviewCount})
          </span>
        </div>

        <div className=" bg-zinc-900 rounded-lg mt-3 flex flex-col items-start gap-2 justify-between w-full">
          <div className="flex items-center gap-2 w-full">
            <div className="font-bold text-lg mb-1 max-md:text-base max-sm:text-sm text-white/80">
              ₹ {price}
            </div>
            {/* Show compareAtPrice if it exists and is greater than current price */}
            {compareAtPrice && Number(compareAtPrice) > Number(price) && (
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
