"use client";
"use client";
import ProductLanding from "@/components/ProductLanding";

export default function ProductsPage() {
  // ProductsPage delegates the product loading and rendering to the
  // `ProductLanding` component which contains comments and the integration
  // with `/api/products` and `/api/cart`.
  return (
    <main className="min-h-screen p-6 bg-[#080808] pt-26">
      <div className="max-w-7xl mx-auto ">
        <h1 className="text-3xl font-semibold mb-6">Products</h1>
        <ProductLanding />
      </div>
    </main>
  );
}
