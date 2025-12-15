import CasaFaq from "@/components/CasaFaq";
import Hero from "@/components/Hero";
import ProductList from "@/components/ProductList";
import TrustSection from "@/components/TrustSection";

export default function Home() {
  return (
    <main className="min-h-screen font-sans">
      <Hero />
      <TrustSection />
      <CasaFaq />
      <div className="w-full pt-32 max-md:pt-16 max-sm:pt-4 bg-[#080808] opacity-95 text-white py-20 px-6 md:px-12 relative overflow-hidden">
        <div className="py-8">
          <h1 className="text-[22px] sm:text-[26px] md:text-[32px] font-montserrat font-semibold tracking-normal leading-[1.1]">
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
