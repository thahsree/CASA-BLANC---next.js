"use client";
import { useEffect, useState } from "react";

type Props = {
  image?: string;
};

const TrustSection = ({ image = "/juicer3.png" }: Props) => {
  const [deliveryCount, setDeliveryCount] = useState(0);
  const [buyerCount, setBuyerCount] = useState(0);
  const [satisfactionRating, setSatisfactionRating] = useState(0);
  const [animationStarted, setAnimationStarted] = useState(false);

  const animateValue = (
    start: number,
    end: number,
    duration: number,
    onUpdate: (value: number) => void
  ) => {
    let startTimestamp: number | null = null;

    const step = (timestamp: number) => {
      if (startTimestamp === null) startTimestamp = timestamp;

      const progress = Math.min((timestamp - startTimestamp) / duration, 1);
      const value = Math.floor(progress * (end - start) + start);

      onUpdate(value);

      if (progress < 1) requestAnimationFrame(step);
    };

    requestAnimationFrame(step);
  };

  useEffect(() => {
    // Start animation immediately, no 3s delay
    if (!animationStarted) {
      setAnimationStarted(true);
      const finalDelivery = 1000;
      const finalBuyer = 100;
      const finalRating = 4.5;

      animateValue(0, finalDelivery, 1000, setDeliveryCount);
      animateValue(0, finalBuyer, 1000, setBuyerCount);
      animateValue(0, finalRating, 1000, (val) => setSatisfactionRating(val));
    }
  }, [animationStarted]);

  return (
    <section className="w-full pt-32 py-32 max-md:py-16 bg-[#080808] opacity-95 text-white px-12 max-md:px-6 max-sm:px-3 relative overflow-hidden">
      <div className="max-w-7xl mx-auto relative z-10">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          {/* Product Image with Frame */}
          <div className="flex justify-center max-md:hidden">
            <div className="rounded-md">
              <img
                src={image}
                alt="Smart Gadget"
                className="w-full h-full object-contain"
                loading="lazy"
              />
            </div>
          </div>

          {/* Trust Content */}
          <div className="space-y-4 text-center md:text-left">
            <h2 className="font-montserrat text-white/90 tracking-tight leading-[1.1] font-semibold text-[64px] max-sm:text-[42px] max-md:text-[55px]">
              Trusted by Modern Homeowners Across India
            </h2>

            <p className="text-white/80 text-[23px] max-sm:text-[17px] max-md:text-[20px] font-quicksand">
              Practical, Reliable, Designed for everyday living.
            </p>

            {/* Stats */}
            <div className="flex gap-5 max-md:justify-center">
              <div className="px-12 py-6 max-md:px-8 max-sm:px-6 rounded-lg text-center flex flex-col gap-1">
                <h3 className="text-4xl text-[#C9B27B] font-mono max-md:text-3xl">
                  {deliveryCount}+
                </h3>
                <p className="text-white/70 mt-1 text-[20px] max-sm:text-[14px] max-md:text-[17px] font-quicksand">
                  Products Delivered
                </p>
              </div>

              <div className="px-12 py-6 max-md:px-8 max-sm:px-6 rounded-lg text-center flex flex-col gap-1">
                <h3 className="text-4xl text-[#C9B27B] font-mono max-md:text-3xl">
                  {buyerCount}+
                </h3>
                <p className="text-white/70 mt-1 text-[20px] max-sm:text-[14px] max-md:text-[17px] font-quicksand">
                  Repeat Buyers
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default TrustSection;
