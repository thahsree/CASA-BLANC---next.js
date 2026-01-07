"use client";
import { useCart } from "@/context/CartContext";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { FiMenu, FiX } from "react-icons/fi";
import { LiaPersonBoothSolid, LiaShoppingBagSolid } from "react-icons/lia";

const NAV_HEIGHT = 84;

const navLinks = [
  { href: "/", label: "Home" },
  { href: "/products", label: "Products" },
  { href: "/contact", label: "Contact" },
];

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const { cartItemCount } = useCart();
  const [scrolled, setScrolled] = useState<boolean>(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState<boolean>(false);

  useEffect(() => {
    if (typeof window === "undefined") return;
    setScrolled(window.scrollY > 0);

    const onScroll = () => setScrolled(window.scrollY > 0);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const handleCartClick = () => {
    router.push("/cart");
  };

  return (
    <>
      <nav
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-200 font-quicksand text-[20px] h-[84px] max-sm:h-auto max-sm:top-0 ${
          scrolled
            ? "bg-black/90 backdrop-blur-lg shadow-md text-white"
            : "bg-transparent text-white"
        }`}
        aria-label="Main navigation"
      >
        <div className="mx-auto h-full flex items-center justify-between px-6 md:px-10">
          {/* Hamburger Menu (Mobile) */}
          <div className="md:hidden flex gap-3 justify-center items-center">
            <button
              className="md:hidden flex items-center justify-center p-2 text-white opacity-75"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label="Toggle menu"
              aria-expanded={mobileMenuOpen}
            >
              {mobileMenuOpen ? <FiX size={24} /> : <FiMenu size={24} />}
            </button>
          </div>
          {/* Desktop Navigation */}
          <ul className="hidden md:flex items-center gap-8 min-w-[250px] text-[#737373]">
            {navLinks.map((link) => {
              const isActive = pathname === link.href;
              return (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className={`font-medium transition-colors ${
                      isActive
                        ? "text-[#FFFFFF] opacity-75"
                        : "hover:text-[#FFFFFF] opacity-75"
                    }`}
                  >
                    {link.label}
                  </Link>
                </li>
              );
            })}
          </ul>

          {/* Logo */}
          <Link
            href="/"
            className="w-[100px] h-[100px] max-sm:w-[60px] max-sm:h-[60px]"
          >
            <img src="/logo.png" alt="logo" className="w-full h-full" />
          </Link>

          {/* Right Actions (Desktop) */}
          <div className="flex items-center gap-10 md:min-w-[250px] justify-end text-white opacity-75 max-md:gap-7 max-sm:gap-5">
            <button
              onClick={handleCartClick}
              className="relative hover:opacity-75 w-[30px] h-[30px] max-md:h-[25px]  max-sm:w-6 max-sm:h-6  cursor-pointer hover:text-[#FFFFFF] transition-opacity"
            >
              <LiaShoppingBagSolid className="w-full h-full" />
              {cartItemCount > 0 && (
                <span className="absolute -top-2 -right-2 max-sm:-top-1 text-center bg-red-500  rounded-full w-5 h-5 max-sm:w-4 max-sm:h-4 flex items-center justify-center ">
                  <p className="max-sm:text-[10px] text-white text-xs font-bold ">
                    {cartItemCount > 9 ? "9+" : cartItemCount}
                  </p>
                </span>
              )}
            </button>
            {/* profile */}
            <button className="hover:opacity-75  w-[30px] h-[30px]  max-md:w-[25px] max-md:h-[25px]  max-sm:w-6 max-sm:h-6 cursor-pointer hover:text-[#FFFFFF]">
              <LiaPersonBoothSolid className="w-full h-full" />
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div
          className={`fixed top-0 left-0 right-0 z-40 transition-all duration-200 md:hidden pt-[70px] ${
            scrolled
              ? "bg-black backdrop-blur-lg text-white"
              : "bg-black text-white"
          }`}
        >
          <ul className="flex flex-col gap-4 px-6 py-6">
            {navLinks.map((link) => {
              const isActive = pathname === link.href;
              return (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className={`font-medium transition-colors block py-2 ${
                      isActive
                        ? "text-[#FFFFFF] opacity-75"
                        : "hover:text-[#FFFFFF] opacity-75"
                    }`}
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    {link.label}
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>
      )}
    </>
  );
}
