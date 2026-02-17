"use client";
import { useCart } from "@/context/CartContext";
import Image from "next/image";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

export default function OrderSummary() {
  const { cartData } = useCart();
  const searchParams = useSearchParams();
  const variantId = searchParams.get("variantId");
  const productId = searchParams.get("productId");
  const quantityParam = searchParams.get("quantity");
  
  const [buyNowProduct, setBuyNowProduct] = useState<any>(null);
  const [loading, setLoading] = useState(!!variantId);

  useEffect(() => {
    if (productId && variantId) {
      const fetchProduct = async () => {
        try {
          const res = await fetch(`/api/products/${productId}`);
          const data = await res.json();
          if (data.product) {
             const variant = data.product.variants.find((v: any) => v._id === variantId) || data.product.variants[0];
             setBuyNowProduct({
                 product: data.product,
                 variant: variant,
                 quantity: parseInt(quantityParam || "1", 10)
             });
          }
        } catch (error) {
          console.error("Failed to fetch product for checkout", error);
        } finally {
          setLoading(false);
        }
      };
      fetchProduct();
    }
  }, [productId, variantId, quantityParam]);

  // If we are in "Buy Now" mode
  if (variantId && productId) {
      if (loading) return <div className="p-6 text-white">Loading order summary...</div>;
      if (!buyNowProduct) return <div className="p-6 text-white">Product not found.</div>;

      const { product, variant, quantity } = buyNowProduct;
      const price = parseFloat(variant.price || product.price); // Fallback to product price if variant has no price
      const subtotal = price * quantity;
      const shipping = subtotal > 1000 ? 0 : 100;
      const total = subtotal + shipping;

      return (
        <div className="bg-zinc-900/50 border border-zinc-800 rounded-lg p-6 h-fit sticky top-24">
          <h2 className="text-xl font-montserrat text-white/90 mb-6 font-semibold">
            Order Summary
          </h2>

          <div className="space-y-4 mb-6">
              <div className="flex gap-4 items-center">
                <div className="relative w-16 h-16 bg-zinc-800 rounded overflow-hidden shrink-0 border border-zinc-700">
                  {product.images?.[0]?.url ? (
                    <Image
                      src={product.images[0].url}
                      alt={product.title || "Product"}
                      fill
                      className="object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-zinc-500 text-xs">
                      No Image
                    </div>
                  )}
                  <div className="absolute top-0 right-0 bg-[#C9B27B] text-black text-[10px] font-bold px-1.5 py-0.5 rounded-bl">
                    {quantity}
                  </div>
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="text-sm font-medium text-white/90 line-clamp-1 font-montserrat">
                    {product.title}
                  </h3>
                   <div className="text-xs text-white/60 font-quicksand">
                    {variant.title !== "Default Title" ? variant.title : ""}
                  </div>
                </div>
                <div className="text-sm font-medium text-white/90 font-montserrat">
                  ₹ {subtotal.toFixed(0)}
                </div>
              </div>
          </div>

          <div className="space-y-3 py-4 border-t border-zinc-800">
            <div className="flex justify-between text-sm text-white/70 font-quicksand">
              <span>Subtotal</span>
              <span>₹ {subtotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-sm text-white/70 font-quicksand">
              <span>Shipping</span>
              <span>{shipping === 0 ? "Free" : `₹ ${shipping.toFixed(2)}`}</span>
            </div>
          </div>

          <div className="flex justify-between items-center pt-4 border-t border-zinc-800 mt-2">
            <span className="text-lg font-bold text-white/90 font-montserrat">Total</span>
            <div className="text-right">
              <span className="text-xs text-white/50 block font-quicksand">Including taxes</span>
              <span className="text-xl font-bold text-[#C9B27B] font-montserrat">
                ₹ {total.toFixed(2)}
              </span>
            </div>
          </div>
        </div>
      );
  }

  // fallback to Cart Logic
  const cart = cartData?.cart;
  
  // Handle empty cart or loading state gracefully
  const lines = cart?.lines?.edges?.map((edge: any) => edge.node) || [];
  const subtotal = parseFloat(cart?.cost?.totalAmount?.amount || "0");
  const shipping = subtotal > 1000 ? 0 : 100; // Example logic: Free shipping > 1000
  const total = subtotal + shipping;

  return (
    <div className="bg-zinc-900/50 border border-zinc-800 rounded-lg p-6 h-fit sticky top-24">
      <h2 className="text-xl font-montserrat text-white/90 mb-6 font-semibold">
        Order Summary
      </h2>

      <div className="space-y-4 mb-6">
        {lines.map((line: any) => (
          <div key={line.id} className="flex gap-4 items-center">
            <div className="relative w-16 h-16 bg-zinc-800 rounded overflow-hidden shrink-0 border border-zinc-700">
              {line.merchandise?.image?.url ? (
                <Image
                  src={line.merchandise.image.url}
                  alt={line.merchandise.product?.title || "Product"}
                  fill
                  className="object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-zinc-500 text-xs">
                  No Image
                </div>
              )}
              <div className="absolute top-0 right-0 bg-[#C9B27B] text-black text-[10px] font-bold px-1.5 py-0.5 rounded-bl">
                {line.quantity}
              </div>
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="text-sm font-medium text-white/90 line-clamp-1 font-montserrat">
                {line.merchandise?.product?.title}
              </h3>
              <p className="text-xs text-white/60 font-quicksand">
                {line.merchandise?.title !== "Default Title" ? line.merchandise?.title : ""}
              </p>
            </div>
            <div className="text-sm font-medium text-white/90 font-montserrat">
              ₹ {parseFloat(line.cost?.totalAmount?.amount || "0").toFixed(0)}
            </div>
          </div>
        ))}
      </div>

      <div className="space-y-3 py-4 border-t border-zinc-800">
        <div className="flex justify-between text-sm text-white/70 font-quicksand">
          <span>Subtotal</span>
          <span>₹ {subtotal.toFixed(2)}</span>
        </div>
        <div className="flex justify-between text-sm text-white/70 font-quicksand">
          <span>Shipping</span>
          <span>{shipping === 0 ? "Free" : `₹ ${shipping.toFixed(2)}`}</span>
        </div>
      </div>

      <div className="flex justify-between items-center pt-4 border-t border-zinc-800 mt-2">
        <span className="text-lg font-bold text-white/90 font-montserrat">Total</span>
        <div className="text-right">
          <span className="text-xs text-white/50 block font-quicksand">Including taxes</span>
          <span className="text-xl font-bold text-[#C9B27B] font-montserrat">
            ₹ {total.toFixed(2)}
          </span>
        </div>
      </div>
    </div>
  );
}

