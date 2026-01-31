"use client";

import { useEffect, useState } from "react";
import {
  IoCall,
  IoLocationSharp,
  IoMailOpen,
  IoTimeOutline,
} from "react-icons/io5";

interface InfoCard {
  icon: React.ReactNode;
  title: string;
  details: string[];
  color: string;
}

export default function ContactInfo() {
  const [mounted, setMounted] = useState(false);
  const [visibleCards, setVisibleCards] = useState<boolean[]>([
    false,
    false,
    false,
    false,
  ]);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;
    // Stagger animation
    visibleCards.forEach((_, idx) => {
      setTimeout(() => {
        setVisibleCards((prev) => {
          const updated = [...prev];
          updated[idx] = true;
          return updated;
        });
      }, idx * 150);
    });
  }, [mounted]);

  const infoCards: InfoCard[] = [
    {
      icon: <IoCall size={32} />,
      title: "Phone",
      details: ["+91 7795031638", "+91 7025504042"],
      color: "from-blue-500 to-blue-600",
    },
    {
      icon: <IoMailOpen size={32} />,
      title: "Email",
      details: ["support@casablancc.com", "info@casablancc.com"],
      color: "from-purple-500 to-purple-600",
    },
    {
      icon: <IoLocationSharp size={32} />,
      title: "Address",
      details: ["Casa Blancc Street", "Pappinissery, Kannur, India"],
      color: "from-pink-500 to-pink-600",
    },
    {
      icon: <IoTimeOutline size={32} />,
      title: "Business Hours",
      details: [
        "Mon - Fri: 9:00 AM - 6:00 PM",
        "Sat - Sun: 10:00 AM - 4:00 PM",
      ],
      color: "from-green-500 to-green-600",
    },
  ];

  return (
    <div className="w-full">
      {mounted && (
        <style>{`
          @keyframes scaleIn {
            from {
              opacity: 0;
              transform: scale(0.9) translateY(20px);
            }
            to {
              opacity: 1;
              transform: scale(1) translateY(0);
            }
          }

          @keyframes float {
            0%, 100% {
              transform: translateY(0px);
            }
            50% {
              transform: translateY(-10px);
            }
          }

          @keyframes shimmer {
            0% {
              background-position: -1000px 0;
            }
            100% {
              background-position: 1000px 0;
            }
          }

          .info-card {
            animation: scaleIn 0.6s ease-out forwards;
            opacity: 0;
          }

          .info-card.visible {
            animation: scaleIn 0.6s ease-out;
            opacity: 1;
          }

          .info-card:hover {
            transform: translateY(-8px);
            transition: all 0.3s ease;
          }

          .icon-wrapper {
            animation: float 3s ease-in-out infinite;
          }

          .icon-wrapper:hover {
            animation: none;
            transform: scale(1.1) rotate(5deg);
            transition: all 0.3s ease;
          }

          .gradient-border {
            position: relative;
            background: linear-gradient(135deg, rgba(201, 178, 123, 0.1), rgba(201, 178, 123, 0.05));
            border: 1px solid transparent;
            background-clip: padding-box;
          }

          .gradient-border::before {
            content: '';
            position: absolute;
            inset: 0;
            border-radius: inherit;
            padding: 1px;
            background: linear-gradient(135deg, #C9B27B, #9d8e63);
            -webkit-mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
            -webkit-mask-composite: xor;
            mask-composite: exclude;
            opacity: 0;
            transition: opacity 0.3s ease;
          }

          .info-card:hover .gradient-border::before {
            opacity: 1;
          }
        `}</style>
      )}

      {mounted && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {infoCards.map((card, idx) => (
            <div
              key={idx}
              className={`info-card ${visibleCards[idx] ? "visible" : ""}`}
              style={{
                animationDelay: `${idx * 0.15}s`,
              }}
            >
              <div className="gradient-border p-6 rounded-lg h-full hover:shadow-2xl transition-all duration-300 bg-zinc-900/50 backdrop-blur">
                {/* Icon */}
                <div
                  className={`icon-wrapper inline-flex p-3 rounded-lg bg-gradient-to-br ${card.color} text-white mb-4`}
                >
                  {card.icon}
                </div>

                {/* Title */}
                <h3 className="text-xl font-semibold font-montserrat text-white/90 mb-3">
                  {card.title}
                </h3>

                {/* Details */}
                <div className="space-y-2">
                  {card.details.map((detail, didx) => (
                    <p
                      key={didx}
                      className="text-sm font-quicksand text-white/70 hover:text-white/90 transition-colors"
                    >
                      {detail}
                    </p>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
