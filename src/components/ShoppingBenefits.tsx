"use client";

export default function ShoppingBenefits() {
  return (
    <div className="mt-24 text-center pt-12 max-md:pt-8 max-sm:pt-6 text-white/90">
      <h3 className="font-montserrat tracking-tight leading-[1.1] font-medium text-[64px] max-sm:text-[42px] max-md:text-[55px]">
        Shopping Benefits
      </h3>

      <p className="text-white/70 mt-4 max-md:mt-3 max-sm:mt-2 font-quicksand mx-auto text-[23px] max-sm:text-[17px] max-md:text-[20px]">
        Quality-driven solutions for a better home experience
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-12 mt-16">
        {/* Benefit Card */}
        <div>
          <div className="mb-4 opacity-75 w-full flex justify-center items-center ">
            <div className="w-[100px] h-[100px] ">
              <img src="/delivery.svg" alt="" className="w-full h-full" />
            </div>
          </div>
          <h4 className="text-[22px] sm:text-[26px] md:text-[32px] font-montserrat font-semibold tracking-normal leading-[1.1]">
            Fast Delivery
          </h4>
          <p className="mt-2 text-[20px] max-sm:text-[14px] max-md:text-[17px] text-white/70 font-quicksand leading-[1.05]">
            Quick dispatch and doorstep delivery for all orders.
          </p>
        </div>

        <div>
          <div className="mb-4 opacity-75 w-full flex justify-center items-center">
            <div className="w-[100px] h-[100px] ">
              <img src="/secure-payment.svg" alt="" className="w-full h-full" />
            </div>
          </div>
          <h4 className="font-montserrat font-semibold tracking-normal text-[22px] sm:text-[26px] md:text-[32px] leading-[1.1]">
            100% Secure Payments
          </h4>
          <p className="mt-2 text-[20px] max-sm:text-[14px] max-md:text-[17px] text-white/70 font-quicksand leading-[1.05]">
            Encrypted transactions for smooth and safe checkout.
          </p>
        </div>

        <div>
          <div className="mb-4 opacity-75 w-full flex justify-center items-center ">
            <div className="w-[100px] h-[100px]">
              <img src="/return.svg" alt="" className="w-full h-full" />
            </div>
          </div>
          <h4 className="font-montserrat font-semibold tracking-normal text-[22px] sm:text-[26px] md:text-[32px] leading-[1.1]">
            Hassle-Free Returns
          </h4>
          <p className="mt-2 text-[20px] max-sm:text-[14px] max-md:text-[17px] text-white/70 font-quicksand leading-[1.05]">
            7-day easy replacements for defective products.
          </p>
        </div>
      </div>
    </div>
  );
}
