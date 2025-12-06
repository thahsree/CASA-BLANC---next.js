import Hero from "@/components/Hero";
import ProductList from "@/components/ProductList";
import TrustSection from "@/components/TrustSection";

export default function Home() {
  return (
    <main className="min-h-screen bg-zinc-50 dark:bg-black font-sans">
      <Hero />
      <TrustSection />
      <div className="max-w-7xl mx-auto">
        <div className="py-8 px-6">
          <h1 className="text-4xl font-bold mb-2 dark:text-white">
            Our Products
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mb-8">
            Explore our Shopify collection
          </p>
        </div>
        <ProductList />
      </div>
    </main>
  );
}
