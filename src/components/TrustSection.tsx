"use client";
import { useEffect, useState } from "react";

type Props = {
  image?: string;
};

const TrustSection = ({ image = "/juicer3.png" }: Props) => {
  const [deliveryCount, setDeliveryCount] = useState(0);
  const [buyerCount, setBuyerCount] = useState(0);
  const [satisfactionRating, setSatisfactionRating] = useState(0);

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
    const fetchStats = () => {
      setTimeout(() => {
        const finalDelivery = 1000;
        const finalBuyer = 100;
        const finalRating = 4.5;

        animateValue(0, finalDelivery, 1000, setDeliveryCount);
        animateValue(0, finalBuyer, 1000, setBuyerCount);
        animateValue(0, finalRating, 1000, (val) => setSatisfactionRating(val));
      }, 3000);
    };

    fetchStats();
  }, []);

  return (
    <section className="w-full pt-32 bg-[#080808] opacity-95 text-white py-20 px-6 md:px-12 relative overflow-hidden">
      {/* Bokeh background layer (blurred circles) */}
      <div className="absolute inset-0 bg-gradient-to-l from-black/80 via-black/50 to-transparent md:from-black/70 md:via-black/40" />

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Top Section */}
        <div className="grid md:grid-cols-2 gap-12 items-center">
          {/* Product Image with Frame */}
          <div className="flex justify-center md:justify-start max-md:hidden">
            <div className="p-6 rounded-md ">
              {/* bg-[#D9C59A] */}
              <img
                src={image}
                alt="Smart Gadget"
                className="w-full h-full object-contain"
              />
            </div>
          </div>

          {/* Trust Content */}

          <div className="space-y-4 text-center md:text-left">
            <h2 className="font-abel font-bold leading-[1.05] opacity-90  text-[64px] max-sm:text-[42px] max-md:text-[55px]">
              Trusted by Smart Home Owners Across India.
            </h2>

            <p className="text-white/80  text-[23px] max-sm:text-[17px] max-md:text-[20px] font-quicksand">
              Practical, Reliable, Designed for everyday living.
            </p>

            {/* Stats */}
            <div className="flex gap-5 max-md:justify-center">
              <div className="px-12 py-6  max-md:px-8 max-sm:px-6 rounded-lg text-center flex flex-col gap-1">
                <h3 className="text-4xl text-[#C9B27B] font-mono max-md:text-3xl">
                  {deliveryCount}+
                </h3>

                <p className=" text-white/70 mt-1 text-[20px] max-sm:text-[14px] max-md:text-[17px] font-quicksand ">
                  Smart Gadgets
                  <br />
                  Delivered
                </p>
              </div>

              <div className="px-12 py-6 max-md:px-8 max-sm:px-6 rounded-lg text-center flex flex-col gap-1">
                <h3 className="text-4xl text-[#C9B27B] font-mono max-md:text-3xl">
                  {buyerCount}+
                </h3>

                <p className=" text-white/70 mt-1 text-[20px] max-sm:text-[14px] max-md:text-[17px] font-quicksand">
                  Repeat Buyers
                </p>
              </div>
            </div>

            {/* Logo Row */}
            {/* <div className="flex items-center gap-8 opacity-50 mt-10 justify-center md:justify-start">
              <span className="text-sm tracking-widest">BRAND</span>
              <span className="text-sm tracking-widest">HOMECARE</span>
              <span className="text-sm tracking-widest">LYNX</span>
              <span className="text-sm tracking-widest">PRESIO</span>
            </div> */}
          </div>
        </div>

        {/* Why Choose Us */}
        <div className="mt-24 text-center pt-12 max-md:pt-8 max-sm:pt-6 text-white/90">
          <h3 className="font-abel font-medium text-[64px] max-sm:text-[42px] max-md:text-[55px]">
            Shopping Benefits
          </h3>

          <p className="text-white/70 mt-4 max-md:mt-3 max-sm:mt-2 font-quicksand mx-auto text-[23px] max-sm:text-[17px] max-md:text-[20px]">
            Quality-driven smart solutions for a better home experience.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-12 mt-16">
            {/* Benefit Card */}
            <div>
              <div className="mb-4 opacity-75 w-full flex justify-center items-center ">
                <div className="w-[100px] h-[100px] ">
                  <img src="/delivery.svg" alt="" className="w-full h-full" />
                </div>
              </div>
              <h4 className="font-semibold text-[22px] sm:text-[26px] md:text-[32px]">
                Fast Delivery
              </h4>
              <p className="mt-2 text-[20px] max-sm:text-[14px] max-md:text-[17px] text-white/70">
                Quick dispatch and doorstep delivery for all orders.
              </p>
            </div>

            <div>
              <div className="mb-4 opacity-75 w-full flex justify-center items-center">
                <div className="w-[100px] h-[100px] ">
                  <img
                    src="/secure-payment.svg"
                    alt=""
                    className="w-full h-full"
                  />
                </div>
              </div>
              <h4 className="font-semibold text-[22px] sm:text-[26px] md:text-[32px]">
                100% Secure Payments
              </h4>
              <p className="mt-2 text-[20px] max-sm:text-[14px] max-md:text-[17px] text-white/70">
                Encrypted transactions for smooth and safe checkout.
              </p>
            </div>

            <div>
              <div className="mb-4 opacity-75 w-full flex justify-center items-center ">
                <div className="w-[100px] h-[100px]">
                  <img src="/return.svg" alt="" className="w-full h-full" />
                </div>
              </div>
              <h4 className="font-semibold text-[22px] sm:text-[26px] md:text-[32px]">
                Hassle-Free Returns
              </h4>
              <p className="mt-2 text-[20px] max-sm:text-[14px] max-md:text-[17px] text-white/70">
                7-day easy replacements for defective products.
              </p>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        .bokeh {
          position: absolute;
          border-radius: 9999px;
          filter: blur(40px);
          opacity: 0.6;
          transform: translate3d(0, 0, 0);
          mix-blend-mode: screen;
        }

        .b1 {
          left: 5%;
          top: 8%;
          width: 260px;
          height: 260px;
          background: radial-gradient(
            circle,
            rgba(201, 178, 123, 0.9),
            rgba(201, 178, 123, 0.18)
          );
          animation: float1 10s ease-in-out infinite;
        }
        .b2 {
          right: 8%;
          top: 18%;
          width: 220px;
          height: 220px;
          background: radial-gradient(
            circle,
            rgba(120, 150, 255, 0.85),
            rgba(120, 150, 255, 0.18)
          );
          animation: float2 12s ease-in-out infinite;
        }
        .b3 {
          left: 20%;
          bottom: 12%;
          width: 180px;
          height: 180px;
          background: radial-gradient(
            circle,
            rgba(255, 120, 160, 0.82),
            rgba(255, 120, 160, 0.12)
          );
          animation: float3 14s ease-in-out infinite;
        }
        .b4 {
          right: 24%;
          bottom: 18%;
          width: 140px;
          height: 140px;
          background: radial-gradient(
            circle,
            rgba(80, 220, 150, 0.75),
            rgba(80, 220, 150, 0.12)
          );
          animation: float4 11s ease-in-out infinite;
        }
        .b5 {
          left: 50%;
          top: 6%;
          width: 120px;
          height: 120px;
          background: radial-gradient(
            circle,
            rgba(255, 240, 200, 0.6),
            rgba(255, 240, 200, 0.08)
          );
          animation: float5 9s ease-in-out infinite;
        }

        @keyframes float1 {
          0% {
            transform: translate3d(0, 0, 0) scale(1);
          }
          50% {
            transform: translate3d(12px, -18px, 0) scale(1.03);
          }
          100% {
            transform: translate3d(0, 0, 0) scale(1);
          }
        }
        @keyframes float2 {
          0% {
            transform: translate3d(0, 0, 0) scale(1);
          }
          50% {
            transform: translate3d(-10px, -12px, 0) scale(1.04);
          }
          100% {
            transform: translate3d(0, 0, 0) scale(1);
          }
        }
        @keyframes float3 {
          0% {
            transform: translate3d(0, 0, 0) scale(1);
          }
          50% {
            transform: translate3d(8px, 14px, 0) scale(1.02);
          }
          100% {
            transform: translate3d(0, 0, 0) scale(1);
          }
        }
        @keyframes float4 {
          0% {
            transform: translate3d(0, 0, 0) scale(1);
          }
          50% {
            transform: translate3d(-6px, 10px, 0) scale(1.03);
          }
          100% {
            transform: translate3d(0, 0, 0) scale(1);
          }
        }
        @keyframes float5 {
          0% {
            transform: translate3d(0, 0, 0) scale(1);
          }
          50% {
            transform: translate3d(0, -10px, 0) scale(1.05);
          }
          100% {
            transform: translate3d(0, 0, 0) scale(1);
          }
        }

        /* Responsive adjustments */
        @media (max-width: 768px) {
          .b1,
          .b2,
          .b3,
          .b4,
          .b5 {
            filter: blur(28px);
            opacity: 0.45;
          }
          .b1 {
            width: 160px;
            height: 160px;
            left: 4%;
            top: 6%;
          }
          .b2 {
            width: 140px;
            height: 140px;
            right: 6%;
            top: 14%;
          }
          .b3 {
            width: 120px;
            height: 120px;
            left: 18%;
            bottom: 8%;
          }
          .b4 {
            width: 100px;
            height: 100px;
            right: 18%;
            bottom: 12%;
          }
          .b5 {
            width: 80px;
            height: 80px;
            left: 48%;
            top: 4%;
          }
        }
      `}</style>
    </section>
  );
};

export default TrustSection;
