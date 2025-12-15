"use client";
import Image from "next/image";
import { useEffect, useState } from "react";

// ProductLanding component
// - Fetches product data from our Next.js API route `/api/products` (which in turn
//   queries the Shopify Storefront API server-side). This keeps the Storefront
//   token secure on the server and avoids exposing it to the browser.
// - Renders a responsive grid of products with an Add-to-Cart button that calls
//   `/api/cart` to create/add items to a Shopify cart using the Storefront API.
export default function ProductLanding() {
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

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

  if (loading) return <div>Loading products...</div>;
  if (error) return <div className="text-red-600">{error}</div>;

  // handleAddToCart: create a cart server-side (if needed) and add a variant
  // line. The server route `/api/cart` performs cartCreate and cartLinesAdd
  // mutations against Shopify and returns the cart object.
  async function handleAddToCart(product: any) {
    let cartId = localStorage.getItem("cartId");

    if (!cartId) {
      const cartResponse = await fetch("/api/cart", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "create" }),
      });
      const cartData = await cartResponse.json();
      cartId = cartData?.cartCreate?.cart?.id || cartData?.cart?.id;
      if (cartId) localStorage.setItem("cartId", cartId);
    }

    const variantId = product.variants?.edges?.[0]?.node?.id;
    if (variantId && cartId) {
      await fetch("/api/cart", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "add", cartId, variantId, quantity: 1 }),
      });
      alert("Added to cart");
    }
  }

  return (
    <div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {products.map((product) => (
          <div
            key={product.id}
            className="bg-white rounded-lg shadow overflow-hidden"
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

            <div className="p-4">
              <h3 className="font-semibold text-lg mb-1">{product.title}</h3>
              <p className="text-sm text-gray-600 line-clamp-2">
                {product.description}
              </p>

              <div className="mt-3 flex items-center justify-between">
                <div className="font-bold">
                  {product.priceRange?.minVariantPrice?.currencyCode}{" "}
                  {product.priceRange?.minVariantPrice?.amount}
                </div>
                <button
                  onClick={() => handleAddToCart(product)}
                  className="px-3 py-2 bg-[#C9B27B] rounded text-sm"
                >
                  Add
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
