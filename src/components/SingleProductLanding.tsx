"use client";
import { useCart } from "@/context/CartContext";
import Image from "next/image";
import { useEffect, useState } from "react";

type Props = { id: string };

// SingleProductLanding
// - Accepts a Shopify product ID (gid://shopify/Product/XXXX)
// - Loads product details from `/api/products/:id` and renders a landing view
// - Adds to cart via `/api/cart` using the first variant
export default function SingleProductLanding({ id }: Props) {
  const { updateCartCount } = useCart();
  const [product, setProduct] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [addingToCart, setAddingToCart] = useState(false);

  useEffect(() => {
    const load = async () => {
      try {
        console.log("SingleProductLanding: Fetching product with ID:", id);
        const res = await fetch(`/api/products/${encodeURIComponent(id)}`);
        const body = await res.json();
        console.log("SingleProductLanding: API response:", body);

        if (body.error) {
          setError(body.error + (body.message ? `: ${body.message}` : ""));
          setProduct(null);
        } else {
          setProduct(body.product || null);
        }
      } catch (err: any) {
        console.error("SingleProductLanding: Fetch error:", err);
        setError(err.message || "Could not load product");
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [id]);

  async function handleAddToCart() {
    if (!product || addingToCart) return;
    setAddingToCart(true);

    try {
      // First, try to get or create a cart
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
        cartId = cartData?.cart?.id;

        if (!cartId) {
          throw new Error("No cart ID returned from create cart");
        }

        localStorage.setItem("cartId", cartId);
      }

      const variantId = product?.variants?.edges?.[0]?.node?.id;
      if (!variantId) {
        alert("Product variant not found");
        setAddingToCart(false);
        return;
      }

      const addResponse = await fetch("/api/cart", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "add", cartId, variantId, quantity: 1 }),
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
    } finally {
      setAddingToCart(false);
    }
  }

  if (loading) return <div className="p-6">Loading product...</div>;
  if (error) return <div className="p-6 text-red-600">Error: {error}</div>;
  if (!product)
    return (
      <div className="p-6">Product not found. Check console for details.</div>
    );

  const heroImage = product.images?.edges?.[0]?.node;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
      <div>
        {heroImage && (
          <div className="relative w-full h-96 rounded overflow-hidden bg-gray-100">
            <Image
              src={heroImage.url}
              alt={heroImage.altText || product.title}
              fill
              className="object-cover"
            />
          </div>
        )}
        <div className="mt-4 grid grid-cols-3 gap-3">
          {product.images?.edges?.slice(1, 6).map((e: any, idx: number) => (
            <div
              key={idx}
              className="relative w-full h-24 rounded overflow-hidden bg-gray-100"
            >
              <Image
                src={e.node.url}
                alt={e.node.altText || product.title}
                fill
                className="object-cover"
              />
            </div>
          ))}
        </div>
      </div>

      <div className="space-y-4">
        <h1 className="text-3xl font-semibold">{product.title}</h1>
        <div className="text-gray-600 whitespace-pre-line">
          {product.description}
        </div>
        <div className="text-xl font-bold">
          {product.priceRange?.minVariantPrice?.currencyCode}{" "}
          {product.priceRange?.minVariantPrice?.amount}
        </div>
        <button
          onClick={handleAddToCart}
          disabled={addingToCart}
          className="px-4 py-2 bg-[#C9B27B] rounded hover:bg-[#b5a265] transition disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {addingToCart ? "Adding..." : "Add to Cart"}
        </button>
      </div>
    </div>
  );
}
