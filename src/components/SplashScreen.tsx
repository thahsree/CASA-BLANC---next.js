"use client";

import { useEffect, useState } from "react";
import Loader from "./Loader";

const quotes = [
  { text: "Home is not a place…it’s a feeling.", author: "Cecelia Ahern" },
  { text: "The magic thing about home is that it feels good to leave, and it feels even better to come back.", author: "Wendy Wunder" },
  { text: "Home involves more than the structure.", author: "Marvin J. Ashton" },
  { text: "A house is made of bricks and beams. A home is made of hopes and dreams.", author: "Unknown" },
  { text: "There is nothing like staying at home for real comfort.", author: "Jane Austen" },
];

export default function SplashScreen() {
  const [isLoading, setIsLoading] = useState(true);
  // Render consistent initial state to avoid hydration mismatch
  // but change it immediately on mount
  const [quoteIndex, setQuoteIndex] = useState(0); 
  const [mounted, setMounted] = useState(false);
  const [dots, setDots] = useState("");

  useEffect(() => {
    // Randomize immediately on mount
    setQuoteIndex(Math.floor(Math.random() * quotes.length));
    setMounted(true);

    // Simulate a minimum load time or wait for window load
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1000); // 1000ms minimum splash screen time

    let quoteTimeout: NodeJS.Timeout;

    const showNextQuote = () => {
        setQuoteIndex((prevIndex) => {
            let nextIndex = Math.floor(Math.random() * quotes.length);
            if (quotes.length > 1 && nextIndex === prevIndex) {
                 nextIndex = (nextIndex + 1) % quotes.length;
            }
            return nextIndex;
        });

        const delay = Math.floor(Math.random() * 2000) + 2000; // 2s - 4s
        quoteTimeout = setTimeout(showNextQuote, delay);
    };
    
    // Initial delay before first change
    quoteTimeout = setTimeout(showNextQuote, 3000);

    const dotsInterval = setInterval(() => {
      setDots((prev) => {
        if (prev.length >= 3) return ".";
        return prev + ".";
      });
    }, 200);

    return () => {
        clearTimeout(timer);
        clearTimeout(quoteTimeout);
        clearInterval(dotsInterval);
    };
  }, []);

  if (!isLoading) return null;

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-[#080808] transition-opacity duration-500">
      <div className="flex flex-col items-center gap-4 max-w-md text-center px-4">
        <Loader />
        <p className="text-[#C9B27B] font-quicksand tracking-widest text-sm min-w-[100px] flex">
          LOADING{dots}
        </p>
        <div className="mt-4 animate-fade-in min-h-[80px]"> 
            <p className="text-white/80 font-serif italic text-lg mb-2">
                "{quotes[quoteIndex].text}"
            </p>
            <p className="text-[#C9B27B] text-xs uppercase tracking-wider">
                — {quotes[quoteIndex].author}
            </p>
        </div>
      </div>
    </div>
  );
}
