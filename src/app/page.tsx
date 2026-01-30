import Hero from "@/components/Hero";
import ProductList from "@/components/ProductList";
import dynamic from "next/dynamic";

// Lazy load below-the-fold components
const ProductLanding = dynamic(() => import("@/components/ProductLanding"), {
  loading: () => (
    <div className="py-32 text-center text-gray-400">
      Loading featured products...
    </div>
  ),
});

const LazyFaq = dynamic(() => import("@/components/CasaFaq"), {
  loading: () => (
    <div className="py-32 text-center text-gray-400">Loading FAQ...</div>
  ),
});

const LazyBenefits = dynamic(() => import("@/components/ShoppingBenefits"), {
  loading: () => (
    <div className="py-32 text-center text-gray-400">Loading benefits...</div>
  ),
});

const LazySubscription = dynamic(() => import("@/components/Subscription"), {
  loading: () => (
    <div className="py-32 text-center text-gray-400">
      Loading subscription...
    </div>
  ),
});

export default function Home() {
  return (
    <main className="min-h-screen font-sans bg-[#080808]">
      <Hero />
      <div className="w-full  pt-32 max-md:pt-16 py-32 max-md:py-16 opacity-95 px-12 max-md:px-6 max-sm:px-3 relative overflow-hidden">
        <div className="py-8">
          <h1 className="text-[22px] sm:text-[26px] md:text-[32px] font-montserrat font-semibold tracking-normal leading-[1.1] text-white/90">
            Featured Products
          </h1>
          <p className="mt-2 text-[20px] max-sm:text-[14px] max-md:text-[17px] text-white/70 font-quicksand leading-[1.05]">
            Explore our new Featured Products handpicked just for you.
          </p>
        </div>
        <ProductList />
      </div>
    </main>
  );
}
