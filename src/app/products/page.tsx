"use client";

import Image from "next/image";
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

const page = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch("/api/products");
        const data = await response.json();

        // Debug: log the API response so you can inspect in browser console
        // Open DevTools Console or Network -> /api/products to see this
        // eslint-disable-next-line no-console
        console.log("API /api/products response:", data);

        // Handle multiple possible shapes to be resilient while debugging
        const productsEdges =
          data?.products?.edges ||
          data?.response?.data?.products?.edges ||
          data?.data?.products?.edges;

        setProducts(productsEdges?.map((edge: any) => edge.node) || []);
      } catch (err) {
        setError("Failed to load products");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  if (loading) {
    return <div className="text-center py-12">Loading products...</div>;
  }

  if (error) {
    return <div className="text-center py-12 text-red-600">{error}</div>;
  }

  return (
    <main className="pt-24 min-h-screen bg-zinc-50 dark:bg-black">
      <div className="max-w-7xl mx-auto">
        <div className="py-8 px-6">
          <h1 className="text-4xl font-bold mb-2 dark:text-white">
            All Products
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mb-8">
            Browse our complete Shopify collection
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 p-6">
          {products.map((product) => (
            <div
              key={product.id}
              className="bg-white dark:bg-zinc-900 rounded-lg shadow-md hover:shadow-lg transition overflow-hidden"
            >
              {product.images.edges[0] && (
                <div className="relative w-full h-48 bg-gray-200">
                  <Image
                    src={product.images.edges[0].node.url}
                    alt={product.images.edges[0].node.altText || product.title}
                    fill
                    className="object-cover"
                  />
                </div>
              )}
              <div className="p-4">
                <h3 className="font-semibold text-lg mb-2">{product.title}</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-3 line-clamp-2">
                  {product.description}
                </p>
                <div className="flex justify-between items-center">
                  <span className="font-bold text-lg">
                    {product.priceRange.minVariantPrice.currencyCode}{" "}
                    {product.priceRange.minVariantPrice.amount}
                  </span>
                  <button
                    onClick={() => handleAddToCart(product)}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-2 rounded text-sm"
                  >
                    Add to Cart
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
};

async function handleAddToCart(product: Product) {
  let cartId = localStorage.getItem("cartId");

  if (!cartId) {
    const cartResponse = await fetch("/api/cart", {
      method: "POST",
      body: JSON.stringify({ action: "create" }),
    });
    const cartData = await cartResponse.json();
    cartId = cartData.cartCreate?.cart?.id;
    if (cartId) {
      localStorage.setItem("cartId", cartId);
    }
  }

  const variantId = product.variants.edges[0]?.node.id;
  if (variantId && cartId) {
    await fetch("/api/cart", {
      method: "POST",
      body: JSON.stringify({
        action: "add",
        cartId,
        variantId,
        quantity: 1,
      }),
    });
    alert("Added to cart!");
  }
}

export default page;
