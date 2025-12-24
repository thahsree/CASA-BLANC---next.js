"use client";
import { useCart } from "@/context/CartContext";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import ProductSkeleton from "./ProductSkeleton";

// ProductLanding component
// - Fetches product data from our Next.js API route `/api/products` (which in turn
//   queries the Shopify Storefront API server-side). This keeps the Storefront
//   token secure on the server and avoids exposing it to the browser.
// - Renders a responsive grid of products with an Add-to-Cart button that calls
//   `/api/cart` to create/add items to a Shopify cart using the Storefront API.
// - Includes sorting and pagination functionality
export default function ProductLanding() {
  const router = useRouter();
  const { updateCartCount, cartItemCount } = useCart();
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [pageLoading, setPageLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [sortBy, setSortBy] = useState<"name" | "price-low" | "price-high">(
    "name"
  );
  const [currentPage, setCurrentPage] = useState(1);
  const [cartVariantIds, setCartVariantIds] = useState<Set<string>>(new Set());
  const itemsPerPage = 10;

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
        const res = await fetch("/api/products");
        if (!res.ok) throw new Error("Failed to fetch products");
        const body = await res.json();

        // API returns a consistent `{ products }` shape from our server route.
        // We try to be resilient in case the shape is nested (from debugging).
        const edges =
          body?.products?.edges ||
          body?.response?.data?.products?.edges ||
          body?.data?.products?.edges;
        const items = edges?.map((e: any) => e.node) || [];
        setProducts(items);
      } catch (err: any) {
        console.error(err);
        setError(err.message || "Could not load products");
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  // Fetch cart variants on mount and when cart count changes
  useEffect(() => {
    fetchCartVariants();
  }, [cartItemCount]);

  if (loading)
    return (
      <div className="px-5 max-sm:px-2">
        {/* Sorting Controls */}
        <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div className="flex items-center gap-3 max-md:gap-2 max-sm:gap-1">
            <label
              htmlFor="sort"
              className="font-quicksand font-semibold text-lg max-md:text-base max-sm:text-sm"
            >
              Sort by:
            </label>
            <select
              id="sort"
              value={sortBy}
              onChange={(e) => {
                handleSort(
                  e.target.value as "name" | "price-low" | "price-high"
                );
              }}
              className="px-4 py-2 max-md:px-2 max-md:py-1 max-sm:px-1 border border-gray-300 rounded-lg font-quicksand focus:outline-none focus:ring-2 focus:ring-[#C9B27B] text-lg max-md:text-base max-sm:text-sm "
            >
              <option value="name">Product Name (A-Z)</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
            </select>
          </div>
          <p className="text-sm text-gray-600 font-quicksand max-sm:text-xs">
            Showing 0 - of 0 products
          </p>
        </div>
        <div className="max-sm:px-1 max-md:px-3">
          <ProductSkeleton />
        </div>
      </div>
    );
  if (error) return <div className="text-red-600">{error}</div>;

  // Show skeleton while page is loading
  if (pageLoading)
    return (
      <div>
        {/* Sorting Controls */}
        <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div className="flex items-center gap-3 max-md:gap-2 max-sm:gap-1">
            <label
              htmlFor="sort"
              className="font-quicksand font-semibold text-lg max-md:text-base max-sm:text-sm"
            >
              Sort by:
            </label>
            <select
              id="sort"
              value={sortBy}
              onChange={(e) => {
                handleSort(
                  e.target.value as "name" | "price-low" | "price-high"
                );
              }}
              className="px-4 py-2 max-md:px-2 max-md:py-1 max-sm:px-1 border border-gray-300 rounded-lg font-quicksand focus:outline-none focus:ring-2 focus:ring-[#C9B27B] text-lg max-md:text-base max-sm:text-sm "
            >
              <option value="name">Product Name (A-Z)</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
            </select>
          </div>
          <p className="text-sm text-gray-600 font-quicksand max-sm:text-xs">
            Showing 0 - of 0 products
          </p>
        </div>
        <div className="max-sm:px-1">
          <ProductSkeleton />
        </div>
      </div>
    );

  // Sort products based on selected criteria
  const sortedProducts = [...products].sort((a, b) => {
    if (sortBy === "name") {
      return a.title.localeCompare(b.title);
    } else if (sortBy === "price-low") {
      const priceA = parseFloat(a.priceRange?.minVariantPrice?.amount || 0);
      const priceB = parseFloat(b.priceRange?.minVariantPrice?.amount || 0);
      return priceA - priceB;
    } else if (sortBy === "price-high") {
      const priceA = parseFloat(a.priceRange?.minVariantPrice?.amount || 0);
      const priceB = parseFloat(b.priceRange?.minVariantPrice?.amount || 0);
      return priceB - priceA;
    }
    return 0;
  });

  // Calculate pagination
  const totalPages = Math.ceil(sortedProducts.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedProducts = sortedProducts.slice(
    startIndex,
    startIndex + itemsPerPage
  );

  // Navigate to single product page
  const handleCardClick = (productId: string) => {
    router.push(`/products/${productId}`);
  };

  // Helper function to handle pagination with minimum 0.5s skeleton display
  const handlePageChange = (newPage: number) => {
    setPageLoading(true);
    setTimeout(() => {
      setCurrentPage(newPage);
      setPageLoading(false);
    }, 500);
  };

  // Helper function to handle sorting with minimum 0.5s skeleton display
  const handleSort = (newSort: "name" | "price-low" | "price-high") => {
    setPageLoading(true);
    setTimeout(() => {
      setSortBy(newSort);
      setCurrentPage(1);
      setPageLoading(false);
    }, 500);
  };

  return (
    <div className="px-5 max-sm:px-2">
      {/* Sorting Controls */}
      <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="flex items-center gap-3 max-md:gap-2 max-sm:gap-1">
          <label
            htmlFor="sort"
            className="font-quicksand font-semibold text-lg max-md:text-base max-sm:text-sm"
          >
            Sort by:
          </label>
          <select
            id="sort"
            value={sortBy}
            onChange={(e) => {
              handleSort(e.target.value as "name" | "price-low" | "price-high");
            }}
            className="px-4 py-2 max-md:px-2 max-md:py-1 max-sm:px-1 border border-gray-300 rounded-lg font-quicksand focus:outline-none focus:ring-2 focus:ring-[#C9B27B] text-lg max-md:text-base max-sm:text-sm "
          >
            <option value="name">Product Name (A-Z)</option>
            <option value="price-low">Price: Low to High</option>
            <option value="price-high">Price: High to Low</option>
          </select>
        </div>
        <p className="text-sm text-gray-600 font-quicksand max-sm:text-xs">
          Showing{" "}
          {Math.min(
            (currentPage - 1) * itemsPerPage + 1,
            sortedProducts.length
          )}
          -{Math.min(currentPage * itemsPerPage, sortedProducts.length)} of{" "}
          {sortedProducts.length} products
        </p>
      </div>

      {/* Products Grid */}
      <div className="grid grid-cols-4 [@media(min-width:642px)_and_(max-width:1042px)]:grid-cols-3 max-md:grid-cols-3 max-sm:grid-cols-2 gap-6 max-md:gap-3 max-sm:gap-x-1 max-sm:gap-y-5 max-md:gap-y-4">
        {paginatedProducts.map((product) => (
          <div
            key={product.id}
            onClick={() => handleCardClick(encodeURIComponent(product.id))}
            className="slide-animation bg-white dark:bg-zinc-900 rounded-lg shadow-md hover:shadow-lg hover:scale-105 transition overflow-hidden flex flex-col h-full cursor-pointer"
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
                  {product.variants?.edges?.[0]?.node?.compareAtPrice
                    ?.amount && (
                    <div className="font-extralight text-base max-md:text-sm line-through text-gray-500">
                      {product.variants?.edges?.[0]?.node?.compareAtPrice
                        ?.amount == 0
                        ? ""
                        : product.variants?.edges?.[0]?.node?.compareAtPrice
                            ?.amount}
                    </div>
                  )}
                </div>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    const variantId = product.variants?.edges?.[0]?.node?.id;
                    const isInCart = variantId && cartVariantIds.has(variantId);
                    if (!isInCart) {
                      handleAddToCart(product, updateCartCount);
                    }
                  }}
                  className={`px-4 py-2 max-md:px-2 max-md:py-1 rounded-md text-sm font-medium w-full max-md:text-sm ${
                    cartVariantIds.has(
                      product.variants?.edges?.[0]?.node?.id || ""
                    )
                      ? "bg-green-600 text-white hover:bg-green-700 cursor-default"
                      : "bg-[#C9B27B] text-black hover:bg-[#b39f62] cursor-pointer"
                  }`}
                >
                  {cartVariantIds.has(
                    product.variants?.edges?.[0]?.node?.id || ""
                  )
                    ? "In Cart"
                    : "Add to cart"}
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Pagination Controls */}
      {totalPages > 1 && (
        <div className="mt-12 flex items-center justify-center gap-2">
          <button
            onClick={() => handlePageChange(Math.max(currentPage - 1, 1))}
            disabled={currentPage === 1}
            className="px-4 py-2 border border-gray-300 rounded-lg font-quicksand disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
          >
            Previous
          </button>

          <div className="flex gap-1">
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <button
                key={page}
                onClick={() => handlePageChange(page)}
                className={`px-3 py-2 rounded-lg font-quicksand ${
                  currentPage === page
                    ? "bg-[#C9B27B] text-white"
                    : "border border-gray-300 hover:bg-gray-50"
                }`}
              >
                {page}
              </button>
            ))}
          </div>

          <button
            onClick={() =>
              handlePageChange(Math.min(currentPage + 1, totalPages))
            }
            disabled={currentPage === totalPages}
            className="px-4 py-2 border border-gray-300 rounded-lg font-quicksand disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
}

async function handleAddToCart(
  product: any,
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
    const variantId = product.variants?.edges?.[0]?.node?.id;
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
