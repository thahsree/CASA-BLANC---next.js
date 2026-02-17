"use client";
import { useCart } from "@/context/CartContext";
import { SKELETON_BLUR_URLS } from "@/lib/skeletonUtils";
import dynamic from "next/dynamic";
import Image from "next/image";
import { useCallback, useEffect, useState } from "react";
import { IoStar } from "react-icons/io5";
import { LiaShoppingBagSolid } from "react-icons/lia";
import { toast } from "sonner";
import DeliveryCheck from "./DeliveryCheck";
import SingleProductSkeleton from "./SingleProductSkeleton";

// Lazy load heavy ReviewSection
const ReviewSection = dynamic(() => import("./ReviewSection"), {
  loading: () => (
    <div className="py-12 text-center text-gray-400">Loading reviews...</div>
  ),
  ssr: false,
});

type Props = { id: string };

export default function SingleProductLanding({ id }: Props) {
  const { addToCart, cartData, isLoading: isCartLoading } = useCart();
  const [product, setProduct] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [addingToCart, setAddingToCart] = useState(false);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [selectedVariantId, setSelectedVariantId] = useState<string | null>(null);

  // Derived state from context
  const cartLine = cartData?.cart?.lines?.edges?.find(
    (edge: any) => edge.node?.merchandise?.id === selectedVariantId
  );
  const isInCart = !!cartLine;

  const [updatingQuantity, setUpdatingQuantity] = useState(false);
  const [preloadedImages, setPreloadedImages] = useState<Set<string>>(
    new Set()
  );
  const [loadedImages, setLoadedImages] = useState<Set<string>>(new Set());
  const [reviewStats, setReviewStats] = useState<any>({
    averageRating: 0,
    totalReviews: 0,
  });

  // Sync local quantity with cart if in cart (optional, or just use separate local state for selector)
  // For "Add to Cart" usually you start at 1. If in cart, maybe show current quantity?
  // The UI shows a generic quantity selector.
  // If "In Cart", the UI shows "Go to Cart" or quantity updater.
  // The user says: "if yes , show go to cart".
  // So we just need `isInCart`.

  // We'll update the quantity state when we determine the product variant,
  // just so it matches if we wanted to support "update cart" from here.
  // useEffect(() => {
  //   if (cartLine) {
  //      setQuantity(cartLine.node.quantity);
  //   }
  // }, [cartLine?.node?.quantity]);

  // Preload all product images on mount
  const preloadImages = useCallback((images: any[]) => {
    const loaded = new Set<string>();
    images.forEach((img: any) => {
      const url = img?.url;
      if (url) {
        const image = new window.Image();
        image.src = url;
        loaded.add(url);
      }
    });
    setPreloadedImages(loaded);
  }, []);

  // Track when images finish loading
  const handleImageLoad = useCallback((url: string) => {
    setLoadedImages((prev) => new Set(prev).add(url));
  }, []);

  // Optimized image selection - immediate state update
  const handleImageSelect = useCallback((index: number) => {
    setSelectedImageIndex(index);
  }, []);

  useEffect(() => {
    const load = async () => {
      try {
        // Add timestamp to URL to force cache bust
        const timestamp = Date.now();
        const res = await fetch(
          `/api/products/${encodeURIComponent(id)}?t=${timestamp}`,
          {
            cache: "no-store",
            headers: {
              "Cache-Control": "no-cache, no-store, must-revalidate",
              Pragma: "no-cache",
              Expires: "0",
            },
          }
        );
        const body = await res.json();
        console.log(body,"body");

        if (body.error) {
          setError(body.error + (body.message ? `: ${body.message}` : ""));
          setProduct(null);
        } else {
          const product = body.product || null;
          setProduct(product);

          // Preload all images immediately
          if (product?.images) {
            preloadImages(product.images);
          }

          if (product?.variants?.[0]?._id) {
            setSelectedVariantId(product.variants[0]._id);
          }
        }

        // Fetch review stats
        try {
          const reviewRes = await fetch(
            `/api/reviews/${encodeURIComponent(id)}`,
            {
              cache: "no-store",
              headers: {
                "Cache-Control": "no-cache, no-store, must-revalidate",
                Pragma: "no-cache",
              },
            }
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
  }, [id, preloadImages]);

  async function handleAddToCart() {
    if (!product?.variants?.[0]?._id) return;
    try {
      setAddingToCart(true);
      await addToCart(product.variants[0]._id, quantity);
      toast.success("Added to cart");
      // setIsInCart(true); // Derived from context now
    } catch (error: any) {
      console.error("Add to cart error", error);
      toast.error(error.message || "Failed to add to cart");
    } finally {
      setAddingToCart(false);
    }
  }

  async function handleBuyNow() {
    if (!product?.variants?.[0]?._id) return;
    const variantId = product.variants[0]._id;
    // Redirect to checkout with variantId, quantity, and productId
    // We use product._id or id (handle) depending on what's available, but product._id is safer for API
    const pId = product._id || id;
    window.location.href = `/checkout?productId=${pId}&variantId=${variantId}&quantity=${quantity}`;
  }

  async function handleQuantityUpdate(newQuantity: number) {
    
  }

  if (loading) return <SingleProductSkeleton />;
  if (error) return <div className="p-6 text-red-600">Error: {error}</div>;
  if (!product)
    return (
      <div className="p-6">Product not found. Check console for details.</div>
    );

  const heroImage = product.images?.[selectedImageIndex];
  const heroImageUrl = heroImage?.url;
  const isHeroLoaded = heroImageUrl && loadedImages.has(heroImageUrl);

  const handleWhatsAppShare = () => {
    const productUrl =
      typeof window !== "undefined" ? window.location.href : "";
    const message = `Check out this amazing product from Casa Blancc: ${
      product.title
    }\n\n${product.description || ""}\n\nPrice: ${
      product.price
    }\n\n${productUrl}`;
    const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, "_blank");
  };

  return (
    <div className="w-full h-full">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
        <div className="lg:sticky lg:top-0 lg:h-fit">
          {/* Hero Image with Skeleton */}
          <div className="relative w-full h-[500px] max-sm:h-80 rounded overflow-hidden bg-zinc-800">
            {!isHeroLoaded && (
              <div className="absolute inset-0 bg-zinc-700/50 animate-pulse" />
            )}
            {heroImage && (
              <Image
                key={selectedImageIndex}
                src={heroImage.url}
                alt={heroImage.altText || product.title}
                fill
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 40vw"
                priority
                className={`object-cover transition-opacity duration-300 ${
                  isHeroLoaded ? "opacity-100" : "opacity-0"
                }`}
                quality={85}
                placeholder="blur"
                blurDataURL={SKELETON_BLUR_URLS.heroImage}
                onLoadingComplete={() => handleImageLoad(heroImage.url)}
              />
            )}
          </div>

          {/* Thumbnail Images with Skeleton */}
          <div className="mt-4 grid grid-cols-4 gap-3">
            {product.images?.map((img: any, idx: number) => {
              const imageUrl = img?.url;
              const isPreloaded = preloadedImages.has(imageUrl);
              const isLoaded = loadedImages.has(imageUrl);

              return (
                <button
                  key={idx}
                  onClick={() => handleImageSelect(idx)}
                  className={`relative w-full h-20 rounded overflow-hidden bg-zinc-800 border-2 transition-all ${
                    selectedImageIndex === idx
                      ? "border-[#C9B27B] ring-2 ring-[#C9B27B]"
                      : "border-transparent hover:border-gray-300"
                  }`}
                >
                  {/* Skeleton loader */}
                  {!isLoaded && (
                    <div className="absolute inset-0 bg-zinc-700/50 animate-pulse" />
                  )}
                  <Image
                    src={img.url}
                    alt={img.altText || product.title}
                    fill
                    sizes="100px"
                    className={`object-cover transition-opacity duration-300 ${
                      isLoaded ? "opacity-100" : "opacity-0"
                    }`}
                    quality={60}
                    loading="eager"
                    placeholder={isPreloaded ? "empty" : "blur"}
                    blurDataURL={SKELETON_BLUR_URLS.thumbnail}
                    onLoadingComplete={() => handleImageLoad(imageUrl)}
                  />
                </button>
              );
            })}
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
              {parseFloat(product.price).toFixed(0)}
            </div>
            {product.compareAtPrice && product.compareAtPrice > product.price && (
              <div
                className="font-montserrat font-light opacity-60 tracking-tight
                         text-[50px] max-sm:text-[28px] max-md:text-[40px] line-through text-gray-500"
              >
                {parseFloat(product.compareAtPrice).toFixed(0)}
              </div>
            )}
          </div>

          {/* PRIMARY CTA - Buy It Now (Dominant) */}
          <div className="flex flex-col gap-4 pt-2">
            <button
              onClick={handleBuyNow}
              disabled={addingToCart}
              className="max-sm:z-10 w-full px-6 py-3 shadow-lg font-montserrat bg-[#D4AF6F] text-black font-bold text-lg rounded hover:bg-[#C9B27B] transition cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed max-sm:fixed max-sm:bottom-0 max-sm:left-0 max-sm:right-0 max-sm:rounded-none max-sm:flex max-sm:items-center max-sm:justify-between max-sm:py-4 max-sm:px-4 max-sm:gap-3"
            >
              {/* Mobile: Product info */}
              <div className="hidden max-sm:flex items-center gap-3">
                {product.images?.[0]?.url && (
                  <img
                    src={product.images[0].url}
                    alt={product.title}
                    className="w-12 h-12 object-cover rounded"
                    loading="lazy"
                  />
                )}
                <div className="text-left">
                  <p className="text-xs font-semibold line-clamp-2">
                    {product.title}
                  </p>
                 <div className="flex gap-2">
                   <p className="text-sm font-bold">
                    ₹{" "}
                    {parseFloat(product.price).toFixed(0)}
                  </p>
                   <p className="text-sm line-through font-normal">
                    
                    {parseFloat(product.compareAtPrice&& product.compareAtPrice>product.price?product.compareAtPrice:product.price).toFixed(0)}
                  </p>
                 </div>
                </div>
              </div>

              {/* Buy Now text (right side on mobile) */}
              <span>Buy Now</span>
            </button>

            {/* SECONDARY - Quantity + Add to Cart (Compact Row) */}
            <div className="flex gap-2 max-sm:hidden">
              <div className="flex items-center border border-[#C9B27B] rounded text-[#C9B27B]">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  disabled={addingToCart || quantity <= 1}
                  className="px-3 py-3 shadow-lg font-montserrat font-semibold hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed text-sm"
                >
                  −
                </button>
                <span className="px-3 py-2 font-semibold text-center min-w-[45px] text-sm">
                  {quantity}
                </span>
                <button
                  onClick={() => setQuantity(Math.min(5, quantity + 1))}
                  disabled={addingToCart || quantity >= 5}
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
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  disabled={addingToCart || quantity <= 1}
                  className="px-3 py-2 font-semibold hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed text-sm"
                >
                  −
                </button>
                <span className="px-3 py-2 font-semibold text-center min-w-[45px] text-sm">
                  {quantity}
                </span>
                <button
                  onClick={() => setQuantity(Math.min(5, quantity + 1))}
                  disabled={addingToCart || quantity >= 5}
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
{/* Product Details - Below CTA */}
<div className="pt-4 border-t border-gray-700 pb-6 max-sm:pb-1">
  {typeof product.description === "string" &&
    product.description.trim().length > 0 && (
      <div className="ql-snow">
        <div
          className="
            ql-editor
            text-[1em] md:text-[1.15em]
            leading-loose
            font-quicksand
            text-white/70
            [&_p]:text-white/70
            [&_strong]:text-white/90
            

            /* Responsive Header Padding & Styling */
            [&_h1]:font-montserrat [&_h1]:text-white/90 [&_h1]:!mt-6 [&_h1]:md:!mt-8 [&_h1]:!mb-4
            [&_h2]:font-montserrat [&_h2]:text-white/90 [&_h2]:!mt-5 [&_h2]:md:!mt-7 [&_h2]:!mb-3
            [&_h3]:font-montserrat [&_h3]:text-white/90 [&_h3]:!mt-4 [&_h3]:md:!mt-6 [&_h3]:!mb-3
            [&_h4]:font-montserrat [&_h4]:text-white/90 [&_h4]:!mt-3 [&_h4]:md:!mt-5 [&_h4]:!mb-2
            [&_h5]:font-montserrat [&_h5]:text-white/90 [&_h5]:!mt-3 [&_h5]:md:!mt-4 [&_h5]:!mb-2
            [&_h6]:font-montserrat [&_h6]:text-white/90 [&_h6]:!mt-2 [&_h6]:md:!mt-3 [&_h6]:!mb-2

            [&_ul]:!pl-0
            [&_ol]:!pl-0
            [&_ul]:!list-disc
            [&_ul]:!list-outside
            [&_ol]:!list-outside


            /* ===== TABLE FIX START ===== */
            [&_table]:!w-full
            [&_table]:!border-collapse
            [&_table]:!border
            [&_table]:!border-zinc-700
            [&_table]:!my-6

            [&_thead]:!border
            [&_thead]:!border-zinc-700
            
            [&_tbody]:!border
            [&_tbody]:!border-zinc-700

            [&_tr]:!border
            [&_tr]:!border-b
            [&_tr]:!border-zinc-700

            [&_td]:!border
            [&_td]:!border-zinc-700
            [&_td]:!p-3
            [&_td]:!align-middle
            [&_td]:!text-center

            [&_th]:!border
            [&_th]:!border-zinc-700
            [&_th]:!p-3
            [&_th]:!text-center
            [&_th]:!align-middle
            [&_th]:!font-montserrat
            [&_th]:!font-semibold
            [&_th]:!text-white/90
            /* ===== TABLE FIX END ===== */
          "
          dangerouslySetInnerHTML={{
            __html: product.description
              .replace(/&nbsp;/gi, " ")
              .replace(/\u00A0/g, " "),
          }}
        />
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
                <img src="/whatsapp.svg" alt="WhatsApp" loading="lazy" />
              </div>
              Share on WhatsApp
            </button>
          </div>
        </div>
      </div>

      {/* Reviews Section - Lazy Loaded */}
      <ReviewSection productId={id} />
    </div>
  );
}
