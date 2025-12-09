"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { FiMenu, FiX } from "react-icons/fi";
import {
  LiaPersonBoothSolid,
  LiaSearchDollarSolid,
  LiaShoppingBagSolid,
} from "react-icons/lia";

const NAV_HEIGHT = 84;

const navLinks = [
  { href: "/", label: "Home" },
  { href: "/products", label: "Products" },
  { href: "/contact", label: "Contact" },
];

export default function Navbar() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState<boolean>(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState<boolean>(false);

  useEffect(() => {
    if (typeof window === "undefined") return;
    setScrolled(window.scrollY > 0);

    const onScroll = () => setScrolled(window.scrollY > 0);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <>
      <nav
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-200 font-quicksand text-[20px] h-[84px] max-sm:h-[70px] ${
          scrolled
            ? "bg-[#000000] backdrop-blur-lg shadow-md text-slate-900"
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
            <button className="md:hidden hover:opacity-75 w-[24] h-[24] flex items-center justify-center">
              <LiaSearchDollarSolid className="w-full h-full text-white opacity-75" />
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
          <div className="flex items-center gap-10 md:min-w-[250px] justify-end text-white opacity-75">
            <button className="hidden md:flex hover:opacity-75 w-[24] h-[24] cursor-pointer hover:text-[#FFFFFF]">
              <LiaSearchDollarSolid className="w-full h-full" />
            </button>
            <button className="hover:opacity-75 w-[24] h-[24] cursor-pointer hover:text-[#FFFFFF]">
              <LiaPersonBoothSolid className="w-full h-full" />
            </button>
            <button className="hover:opacity-75 w-[24] h-[24] cursor-pointer hover:text-[#FFFFFF]">
              <LiaShoppingBagSolid className="w-full h-full" />
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div
          className={`fixed top-[84px] left-0 right-0 z-40 transition-all duration-200 md:hidden ${
            scrolled
              ? "bg-white/95 backdrop-blur-lg text-slate-900"
              : "bg-black/90 text-white"
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
