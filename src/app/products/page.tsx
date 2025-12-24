"use client";
"use client";
import ProductLanding from "@/components/ProductLanding";

export default function ProductsPage() {
  // ProductsPage delegates the product loading and rendering to the
  // `ProductLanding` component which contains comments and the integration
  // with `/api/products` and `/api/cart`.
  return (
    <main className="">
      <section className="relative w-full h-[35vh] max-sm:h-[25vh] overflow-hidden">
        {/* Background image for desktop*/}
        <div
          className="absolute inset-0 bg-cover bg-center scale-110 max-md:hidden [@media(min-width:770px)_and_(max-width:900px)]:scale-[1.5] blur-[3px]"
          style={{ backgroundImage: 'url("/productlanding9.png")' }}
        />

        {/* Background image for mobile and tablet*/}
        <div
          className="absolute inset-0 bg-cover bg-center hidden max-md:block blur-[1.25px] "
          style={{ backgroundImage: 'url("/productlanding2.png")' }}
        />

        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/50 to-transparent md:from-black/70 md:via-black/40" />

        {/* Content */}
        <div className="relative z-10 flex flex-col items-start max-md:items-center justify-end  max-md:justify-center pb-12 h-full px-8 md:px-12 max-md:pb-0">
          <h1 className="font-montserrat font-medium text-white/90 tracking-wide leading-[1.05] text-[34px] max-md:text-[25px] max-sm:text-[20px] max-sm:mt-3  ">
            Discover Our Products
          </h1>
          <p className="text-md text-white/70 max-w-2xl font-quicksand leading-1.05 max-sm:text-[10px] max-md:text-center">
            Explore our exclusive collection of smart home gadgets designed to
            elevate your living space.
          </p>
        </div>
      </section>
      <div className="mt-24 max-sm:mt-10 px-8 max-md:px-4 max-sm-px-2">
        <ProductLanding />
      </div>
    </main>
  );
}
