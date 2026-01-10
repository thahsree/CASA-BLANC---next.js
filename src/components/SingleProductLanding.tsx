"use client";
import { useCart } from "@/context/CartContext";
import Image from "next/image";
import { useEffect, useState } from "react";
import { IoStar } from "react-icons/io5";
import { LiaShoppingBagSolid } from "react-icons/lia";
import DeliveryCheck from "./DeliveryCheck";
import ReviewSection from "./ReviewSection";
import SingleProductSkeleton from "./SingleProductSkeleton";

type Props = { id: string };

// SingleProductLanding
// - Accepts a Shopify product ID (gid://shopify/Product/XXXX)
// - Loads product details from `/api/products/:id` and renders a landing view
// - Adds to cart via `/api/cart` using the first variant
export default function SingleProductLanding({ id }: Props) {
  console.log("SingleProductLanding mounted with id:", id);
  const { updateCartCount } = useCart();

  const checkIfInCart = async (variantId: string) => {
    try {
      const res = await fetch("/api/cart");
      if (!res.ok) return;
      const data = await res.json();
      const lines = data.cart?.lines?.edges || [];
      const lineItem = lines.find(
        (edge: any) => edge.node?.merchandise?.id === variantId
      );
      if (lineItem) {
        setIsInCart(true);
        setCartLineId(lineItem.node?.id || null);
        setQuantity(lineItem.node?.quantity || 1);
      } else {
        setIsInCart(false);
        setCartLineId(null);
        setQuantity(1);
      }
    } catch (err) {
      console.error("Failed to check if item is in cart:", err);
    }
  };
  const [product, setProduct] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [addingToCart, setAddingToCart] = useState(false);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [isInCart, setIsInCart] = useState(false);
  const [cartLineId, setCartLineId] = useState<string | null>(null);
  const [updatingQuantity, setUpdatingQuantity] = useState(false);
  const [reviewStats, setReviewStats] = useState<any>({
    averageRating: 0,
    totalReviews: 0,
  });

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
          const product = body.product || null;
          setProduct(product);
          if (product?.variants?.edges?.[0]?.node?.id) {
            await checkIfInCart(product.variants.edges[0].node.id);
          }
        }

        // Fetch review stats
        try {
          const reviewRes = await fetch(
            `/api/reviews/${encodeURIComponent(id)}`
          );
          const reviewData = await reviewRes.json();
          if (reviewRes.ok && reviewData.stats) {
            setReviewStats(reviewData.stats);
          }
        } catch (reviewErr) {
          console.error("Failed to fetch review stats:", reviewErr);
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
        body: JSON.stringify({ action: "add", cartId, variantId, quantity }),
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
      if (variantId) {
        await checkIfInCart(variantId);
      }
      alert("Added to cart successfully!");
    } catch (err: any) {
      console.error("Error adding to cart:", err);
      alert("Failed to add to cart: " + (err.message || "Unknown error"));
    } finally {
      setAddingToCart(false);
    }
  }

  async function handleQuantityUpdate(newQuantity: number) {
    if (!isInCart || !cartLineId) return;
    setUpdatingQuantity(true);

    try {
      const cartId = localStorage.getItem("cartId");
      if (!cartId) {
        throw new Error("No cart ID found");
      }

      const updateResponse = await fetch("/api/cart", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "update",
          cartId,
          lines: [
            {
              id: cartLineId,
              quantity: newQuantity,
            },
          ],
        }),
      });

      if (!updateResponse.ok) {
        const errorData = await updateResponse.json();
        throw new Error(
          errorData?.error || `Update cart failed: ${updateResponse.status}`
        );
      }

      const updateData = await updateResponse.json();

      if (updateData?.error) {
        throw new Error(updateData.error);
      }

      // Update cart count in context
      await updateCartCount();
      setQuantity(newQuantity);
    } catch (err: any) {
      console.error("Error updating cart quantity:", err);
      alert("Failed to update quantity: " + (err.message || "Unknown error"));
      // Revert quantity on error
      const res = await fetch("/api/cart");
      const data = await res.json();
      const lines = data.cart?.lines?.edges || [];
      const lineItem = lines.find((edge: any) => edge.node?.id === cartLineId);
      if (lineItem) {
        setQuantity(lineItem.node?.quantity || 1);
      }
    } finally {
      setUpdatingQuantity(false);
    }
  }

  if (loading) return <SingleProductSkeleton />;
  if (error) return <div className="p-6 text-red-600">Error: {error}</div>;
  if (!product)
    return (
      <div className="p-6">Product not found. Check console for details.</div>
    );

  const heroImage = product.images?.edges?.[selectedImageIndex]?.node;

  const handleWhatsAppShare = () => {
    const productUrl =
      typeof window !== "undefined" ? window.location.href : "";
    const message = `Check out this amazing product from Casa Blancc: ${
      product.title
    }\n\n${product.description || ""}\n\nPrice: ${
      product.priceRange?.minVariantPrice?.currencyCode
    } ${product.priceRange?.minVariantPrice?.amount}\n\n${productUrl}`;
    const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, "_blank");
  };

  return (
    <div className="w-full h-full">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
        <div className="lg:sticky lg:top-0 lg:h-fit">
          {heroImage && (
            <div className="relative w-full h-[500px] max-sm:h-80 rounded overflow-hidden bg-gray-100">
              <Image
                src={heroImage.url}
                alt={heroImage.altText || product.title}
                fill
                className="object-cover"
              />
            </div>
          )}
          <div className="mt-4 grid grid-cols-4 gap-3">
            {product.images?.edges?.map((e: any, idx: number) => (
              <button
                key={idx}
                onClick={() => setSelectedImageIndex(idx)}
                className={`relative w-full h-20 rounded overflow-hidden bg-gray-100 border-2 transition ${
                  selectedImageIndex === idx
                    ? "border-[#C9B27B]"
                    : "border-transparent hover:border-gray-300"
                }`}
              >
                <Image
                  src={e.node.url}
                  alt={e.node.altText || product.title}
                  fill
                  className="object-cover"
                />
              </button>
            ))}
          </div>
        </div>

        <div className="space-y-2">
          <div>
            <h1 className="font-montserrat text-white/90 tracking-tight leading-tight font-normal text-[44px] max-sm:text-[28px] max-md:text-[35px]">
              {product.title}
            </h1>
          </div>

          {/* Review Stars */}
          <div className="flex items-center gap-2">
            <div className="flex gap-0.5">
              {[...Array(5)].map((_, i) => {
                const fillPercentage = Math.max(
                  0,
                  Math.min(1, reviewStats.averageRating - i)
                );
                return (
                  <div key={i} className="relative">
                    <IoStar size={20} className="text-gray-600" />
                    <div
                      className="absolute top-0 left-0 overflow-hidden"
                      style={{ width: `${fillPercentage * 100}%` }}
                    >
                      <IoStar size={20} className="text-[#C9B27B]" />
                    </div>
                  </div>
                );
              })}
            </div>
            <span className="text-gray-400 text-sm">
              {reviewStats.averageRating.toFixed(1)} ({reviewStats.totalReviews}{" "}
              reviews)
            </span>
          </div>

          <div className="flex gap-2 items-center">
            <div
              className="font-montserrat font-normal tracking-tight
                         text-[50px] max-sm:text-[28px] max-md:text-[40px] text-white/90"
            >
              {"₹ "}{" "}
              {parseFloat(product.priceRange?.minVariantPrice?.amount).toFixed(
                0
              )}
            </div>
            {product.variants?.edges?.[0]?.node?.compareAtPrice?.amount && (
              <div
                className="font-montserrat font-light opacity-60 tracking-tight
                         text-[50px] max-sm:text-[28px] max-md:text-[40px] line-through text-gray-500"
              >
                {product.variants?.edges?.[0]?.node?.compareAtPrice?.amount == 0
                  ? ""
                  : parseFloat(
                      product.variants?.edges?.[0]?.node?.compareAtPrice?.amount
                    ).toFixed(0)}
              </div>
            )}
          </div>

          {/* PRIMARY CTA - Buy It Now (Dominant) */}
          <div className="flex flex-col gap-4 pt-2">
            <button className="max-sm:z-10 w-full px-6 py-3 shadow-lg font-montserrat bg-[#D4AF6F] text-black font-bold text-lg rounded hover:bg-[#C9B27B] transition cursor-pointer max-sm:fixed max-sm:bottom-0 max-sm:left-0 max-sm:right-0 max-sm:rounded-none max-sm:flex max-sm:items-center max-sm:justify-between max-sm:py-4 max-sm:px-4 max-sm:gap-3">
              {/* Mobile: Product info */}
              <div className="hidden max-sm:flex items-center gap-3">
                {product.images?.edges?.[0]?.node?.url && (
                  <img
                    src={product.images.edges[0].node.url}
                    alt={product.title}
                    className="w-12 h-12 object-cover rounded"
                  />
                )}
                <div className="text-left">
                  <p className="text-xs font-semibold line-clamp-2">
                    {product.title}
                  </p>
                  <p className="text-sm font-bold">
                    ₹{" "}
                    {parseFloat(
                      product.priceRange?.minVariantPrice?.amount
                    ).toFixed(0)}
                  </p>
                </div>
              </div>

              {/* Buy Now text (right side on mobile) */}
              <span>Buy&nbsp;Now</span>
            </button>

            {/* SECONDARY - Quantity + Add to Cart (Compact Row) */}
            <div className="flex gap-2 max-sm:hidden">
              <div className="flex items-center border border-[#C9B27B] rounded text-[#C9B27B]">
                <button
                  onClick={() => {
                    const newQty = Math.max(1, quantity - 1);
                    if (isInCart) {
                      handleQuantityUpdate(newQty);
                    } else {
                      setQuantity(newQty);
                    }
                  }}
                  disabled={addingToCart || updatingQuantity || quantity <= 1}
                  className="px-3 py-3 shadow-lg font-montserrat font-semibold hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed text-sm"
                >
                  −
                </button>
                <span className="px-3 py-2 font-semibold text-center min-w-[45px] text-sm">
                  {quantity}
                </span>
                <button
                  onClick={() => {
                    const newQty = Math.min(5, quantity + 1);
                    if (isInCart) {
                      handleQuantityUpdate(newQty);
                    } else {
                      setQuantity(newQty);
                    }
                  }}
                  disabled={addingToCart || updatingQuantity || quantity >= 5}
                  className="px-3 py-2 font-semibold hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed text-sm"
                >
                  +
                </button>
              </div>
              {!isInCart ? (
                <button
                  onClick={handleAddToCart}
                  disabled={addingToCart}
                  className="flex-1 px-4 py-3 bg-[#C9B27B] shadow-lg font-montserrat text-black font-semibold rounded hover:bg-[#b5a265] transition disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer flex items-center justify-center gap-2 text-sm"
                >
                  <LiaShoppingBagSolid className="w-4 h-4" />
                  {addingToCart ? "Adding..." : "Add to Cart"}
                </button>
              ) : (
                <button
                  onClick={() => (window.location.href = "/cart")}
                  className="flex-1 px-4 py-3 shadow-lg font-montserrat bg-[#C9B27B] text-black font-semibold rounded hover:bg-[#b5a265] transition cursor-pointer flex items-center justify-center gap-2 text-sm"
                >
                  Go to Cart →
                </button>
              )}
            </div>

            {/* MOBILE - Quantity + Add to Cart (Bottom spacing) */}
            <div className="hidden max-sm:flex gap-2">
              <div className="flex items-center border border-[#C9B27B] rounded text-[#C9B27B]">
                <button
                  onClick={() => {
                    const newQty = Math.max(1, quantity - 1);
                    if (isInCart) {
                      handleQuantityUpdate(newQty);
                    } else {
                      setQuantity(newQty);
                    }
                  }}
                  disabled={addingToCart || updatingQuantity || quantity <= 1}
                  className="px-3 py-2 font-semibold hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed text-sm"
                >
                  −
                </button>
                <span className="px-3 py-2 font-semibold text-center min-w-[45px] text-sm">
                  {quantity}
                </span>
                <button
                  onClick={() => {
                    const newQty = Math.min(5, quantity + 1);
                    if (isInCart) {
                      handleQuantityUpdate(newQty);
                    } else {
                      setQuantity(newQty);
                    }
                  }}
                  disabled={addingToCart || updatingQuantity || quantity >= 5}
                  className="px-3 py-2 font-semibold hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed text-sm"
                >
                  +
                </button>
              </div>
              {!isInCart ? (
                <button
                  onClick={handleAddToCart}
                  disabled={addingToCart}
                  className="px-4 py-2 bg-[#C9B27B] text-white/80 font-semibold rounded hover:bg-[#b5a265] transition disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer flex items-center justify-center gap-2 text-sm flex-1"
                >
                  <LiaShoppingBagSolid className="w-4 h-4" />
                  {addingToCart ? "Adding..." : "Add"}
                </button>
              ) : (
                <button
                  onClick={() => (window.location.href = "/cart")}
                  className="px-4 py-2 bg-[#C9B27B] text-black font-semibold rounded hover:bg-[#b5a265] transition cursor-pointer flex items-center justify-center gap-2 text-sm flex-1"
                >
                  Go to Cart →
                </button>
              )}
            </div>

            {/* TRUST SIGNAL */}
            <div className="text-[16px] max-md:text-[14px]  text-white/50 font-quicksand leading-[1.05] text-center">
              7-day replacement • Secure payments
              •&nbsp;Free&nbsp;delivery&nbsp;on&nbsp;orders&nbsp;above&nbsp;₹1000
            </div>
          </div>

          {/* Product Details - Below CTA */}
          <div className="pt-4 border-t border-gray-700 pb-6 max-sm:pb-1">
            {product.description && product.description.trim() && (
              <div className="text-[20px] max-sm:text-[14px] max-md:text-[17px] text-white/70 font-quicksand leading-[1.05]">
                {product.description}
              </div>
            )}
            <DeliveryCheck />
          </div>

          {/* Share - BELOW THE FOLD */}
          <div className="pt-4 max-sm:pt-1">
            <button
              onClick={handleWhatsAppShare}
              className="w-full px-4 py-2 border border-gray-500 text-gray-400 font-medium rounded hover:border-green-500 hover:text-green-500 transition flex items-center justify-center gap-2 cursor-pointer text-sm"
            >
              <div className="w-[20px] h-[20px]">
                <img src="/whatsapp.svg" alt="WhatsApp" />
              </div>
              Share on WhatsApp
            </button>
          </div>
        </div>
      </div>

      {/* Reviews Section */}
      <ReviewSection productId={id} />
    </div>
  );
}
