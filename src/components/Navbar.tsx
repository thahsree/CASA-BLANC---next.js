"use client";
import { useCart } from "@/context/CartContext";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { FiMenu, FiX } from "react-icons/fi";
import { LiaShoppingBagSolid, LiaUserSolid } from "react-icons/lia";
import SignOutButton from "./SignOutButton";

const NAV_HEIGHT = 84;

const navLinks = [
  { href: "/", label: "Home" },
  { href: "/products", label: "Products" },
  { href: "/contact", label: "Contact" },
];

export default function Navbar() {
  const { data: session } = useSession();
  const pathname = usePathname();
  const router = useRouter();
  const { cartItemCount } = useCart();
  const [scrolled, setScrolled] = useState<boolean>(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState<boolean>(false);
  const [profileOpen, setProfileOpen] = useState<boolean>(false);
  const profileRef = useRef<HTMLDivElement>(null);



  useEffect(() => {
    if (typeof window === "undefined") return;
    setScrolled(window.scrollY > 0);

    const onScroll = () => setScrolled(window.scrollY > 0);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
        if (profileRef.current && !profileRef.current.contains(event.target as Node)) {
            setProfileOpen(false);
        }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleCartClick = () => {
    router.push("/cart");
  };

  // Hide Navbar on Admin pages
  if (pathname.startsWith("/admin")) {
    return null;
  }

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
            
            {/* Auth State */}
            {session ? (
              /* Profile Dropdown (Logged In) */
              <div className="relative" ref={profileRef}>
                <div className="flex justify-center items-center">
                <button 
                  onClick={() => setProfileOpen(!profileOpen)}
                  className="hover:opacity-75 w-[30px] h-[30px] max-md:w-[25px] max-md:h-[25px] max-sm:w-6 max-sm:h-6 cursor-pointer hover:text-[#FFFFFF]"
                >
                  {session.user?.image ? (
                    <img src={session.user.image} alt="Profile" className="w-full h-full rounded-full object-cover" />
                  ) : (
                    <LiaUserSolid className="w-full h-full" />
                  )}
                </button>
                </div>

                {profileOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 text-gray-800 ring-1 ring-black ring-opacity-5 z-50">
                      <div className="px-4 py-2 border-b border-gray-100">
                          <p className="text-sm font-medium truncate">{session.user?.name}</p>
                          <p className="text-xs text-gray-500 truncate">{session.user?.email}</p>
                      </div>
                      <Link 
                          href="/orders" 
                          className="block px-4 py-2 text-sm hover:bg-gray-100"
                          onClick={() => setProfileOpen(false)}
                      >
                          My Orders
                      </Link>
                      {
                        session.user?.role === "admin" && (
                          <Link 
                            href="/admin" 
                            className="block px-4 py-2 text-sm hover:bg-gray-100"
                            onClick={() => setProfileOpen(false)}
                          >
                            Admin Dashboard
                          </Link>
                        )
                      }
                      <div className="border-t border-gray-100 my-1"></div>
                      <div className="px-4 py-2 text-sm hover:bg-gray-100 cursor-pointer">
                          <SignOutButton showIcon={false} className="w-full justify-start text-gray-800 hover:text-red-600" />
                      </div>
                  </div>
                )}
              </div>
            ) : (
              /* Sign In Link (Logged Out) */
              <Link href="/login" className="hover:opacity-75 flex justify-center items-center cursor-pointer hover:text-[#FFFFFF] transition-opacity">
                 <LiaUserSolid className="w-[30px] h-[30px] max-md:w-[25px] max-md:h-[25px] max-sm:w-6 max-sm:h-6" />
              </Link>
            )}
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
             <li className="border-t border-gray-700 pt-4 mt-2">
                <Link
                    href="/orders"
                    className="font-medium transition-colors block py-2 hover:text-[#FFFFFF] opacity-75"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    My Orders
                  </Link>
             </li>
             {session?.user?.role === "admin" && (
              <li>
                  <Link
                      href="/admin"
                      className="font-medium transition-colors block py-2 hover:text-[#FFFFFF] opacity-75"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      Admin Dashboard
                    </Link>
              </li>
             )}
             <li>
                 <div className="py-2 opacity-75">
                    <SignOutButton text="Sign Out" className="text-white hover:text-red-400" />
                 </div>
             </li>
          </ul>
        </div>
      )}
    </>
  );
}
