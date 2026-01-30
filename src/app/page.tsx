import Hero from "@/components/Hero";
import ProductList from "@/components/ProductList";
import TrustSection from "@/components/TrustSection";
import dynamic from "next/dynamic";

// Lazy load below-the-fold components with custom loading state
const LazyFaq = dynamic(() => import("@/components/CasaFaq"), {
  loading: () => <div className="h-96 bg-zinc-900" />,
  ssr: true,
});

const LazyBenefits = dynamic(() => import("@/components/ShoppingBenefits"), {
  loading: () => <div className="h-96 bg-zinc-900" />,
  ssr: true,
});

const LazySubscription = dynamic(() => import("@/components/Subscription"), {
  loading: () => <div className="h-96 bg-zinc-900" />,
  ssr: true,
});

export default function Home() {
  return (
    <main className="min-h-screen font-sans bg-[#080808]">
      {/* Above-the-fold */}
      <Hero />
      <TrustSection />

      {/* Below-the-fold - Lazy loaded */}
      <LazyFaq />

      {/* Featured Products Section */}
      <div className="w-full pt-32 max-md:pt-16 py-32 max-md:py-16 opacity-95 px-12 max-md:px-6 max-sm:px-3 relative overflow-hidden">
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

      {/* Lazy load remaining sections */}
      <LazyBenefits />
      <LazySubscription />
    </main>
  );
}
