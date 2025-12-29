"use client";

import Image from "next/image";

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
  const variantId = product.variants?.edges?.[0]?.node?.id;
  const isInCart = variantId && cartVariantIds.has(variantId);
  const compareAtPrice =
    product.variants?.edges?.[0]?.node?.compareAtPrice?.amount;

  return (
    <div
      key={product.id}
      onClick={() => onCardClick(encodeURIComponent(product.id))}
      className="slide-animation  dark:bg-zinc-900 rounded-lg shadow-md hover:shadow-lg hover:scale-105 transition overflow-hidden flex flex-col h-full cursor-pointer"
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
        <h3 className="text-lg mb-1 max-md:text-base max-sm:text-sm leading-tight font-montserrat font-medium line-clamp-1">
          {product.title}
        </h3>
        <p className="text-base max-md:text-sm text-gray-600 line-clamp-2 flex-grow font-quicksand max-sm:text-xs">
          {product.description}
        </p>

        <div className=" bg-zinc-900 rounded-lg mt-3 flex flex-col items-start gap-2 justify-between w-full p-3">
          <div className="flex items-center gap-2 w-full">
            <div className="font-bold text-base max-md:text-sm text-[FFFFFF]/70">
              INR. {product.priceRange?.minVariantPrice?.amount}
            </div>
            {compareAtPrice && compareAtPrice != 0 && (
              <div className="font-extralight text-base max-md:text-sm line-through text-gray-500">
                INR. {compareAtPrice}
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
