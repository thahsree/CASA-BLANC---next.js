import Link from "next/link";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="w-full">
      <div className="bg-[#010101] w-full h-full pt-32 max-md:pt-16 max-sm:pt-10">
        <div className="max-w-7xl mx-auto px-6 md:px-12 py-16 max-md:py-12">
          {/* Main Footer Content */}
          <div className="grid grid-cols-4 max-sm:grid-cols-2 max-md:grid-cols-2 gap-8 mb-12 place-items-center text-center">
            {/* Company Info */}
            <div className="w-[200px] h-[200px] max-sm:w-[150px] max-sm:h-[150px] flex items-center justify-center">
              <img src="/logo.png" alt="logo" />
            </div>

            {/* Quick Links */}
            <div>
              <h4 className="text-white font-quicksand font-semibold text-base mb-4">
                Quick Links
              </h4>
              <ul className="space-y-2">
                <li>
                  <Link
                    href="/products"
                    className="text-white/60 hover:text-white font-quicksand text-sm transition-colors"
                  >
                    Products
                  </Link>
                </li>
                <li>
                  <Link
                    href="/cart"
                    className="text-white/60 hover:text-white font-quicksand text-sm transition-colors"
                  >
                    Cart
                  </Link>
                </li>
                <li>
                  <Link
                    href="/contact"
                    className="text-white/60 hover:text-white font-quicksand text-sm transition-colors"
                  >
                    Contact
                  </Link>
                </li>
              </ul>
            </div>

            {/* Support */}
            <div>
              <h4 className="text-white font-quicksand font-semibold text-base mb-4">
                Support
              </h4>
              <ul className="space-y-2">
                <li>
                  <Link
                    href="#"
                    className="text-white/60 hover:text-white font-quicksand text-sm transition-colors"
                  >
                    FAQ
                  </Link>
                </li>
                <li>
                  <Link
                    href="#"
                    className="text-white/60 hover:text-white font-quicksand text-sm transition-colors"
                  >
                    Shipping Info
                  </Link>
                </li>
                <li>
                  <Link
                    href="#"
                    className="text-white/60 hover:text-white font-quicksand text-sm transition-colors"
                  >
                    Returns
                  </Link>
                </li>
              </ul>
            </div>

            {/* Legal */}
            <div>
              <h4 className="text-white font-quicksand font-semibold text-base mb-4">
                Legal
              </h4>
              <ul className="space-y-2">
                <li>
                  <Link
                    href="#"
                    className="text-white/60 hover:text-white font-quicksand text-sm transition-colors"
                  >
                    Privacy Policy
                  </Link>
                </li>
                <li>
                  <Link
                    href="#"
                    className="text-white/60 hover:text-white font-quicksand text-sm transition-colors"
                  >
                    Terms of Service
                  </Link>
                </li>
                <li>
                  <Link
                    href="#"
                    className="text-white/60 hover:text-white font-quicksand text-sm transition-colors"
                  >
                    Cookie Policy
                  </Link>
                </li>
              </ul>
            </div>
          </div>

          {/* Bottom Footer */}
          <div className="border-t border-white/10 pt-8">
            <div className="flex flex-col md:flex-row justify-between items-center">
              <p className="text-white/60 font-quicksand text-sm">
                &copy; {currentYear} Casa Blancc. All rights reserved.
              </p>
              <div className="flex gap-6 mt-4 md:mt-0">
                <a
                  href="#"
                  className="text-white/60 hover:text-white transition-colors"
                  aria-label="Facebook"
                >
                  <svg
                    className="w-5 h-5"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                  </svg>
                </a>
                <a
                  href="#"
                  className="text-white/60 hover:text-white transition-colors"
                  aria-label="Twitter"
                >
                  <svg
                    className="w-5 h-5"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M23.953 4.57a10 10 0 002.856-3.586 10 10 0 01-2.856 1.078 5 5 0 002.19-2.762 10 10 0 01-2.825 1.083 5 5 0 00-8.618 4.56 14.17 14.17 0 01-10.28-5.15 5 5 0 001.548 6.682 5 5 0 01-2.265-.567v.06a5 5 0 004.013 4.905 5 5 0 01-2.25.085 5 5 0 004.677 3.488 10 10 0 01-6.177 2.13 14.17 14.17 0 007.755 2.27c9.053 0 13.998-7.496 13.998-13.986 0-.209 0-.42-.015-.63A9.935 9.935 0 0024 4.59z" />
                  </svg>
                </a>
                <a
                  href="#"
                  className="text-white/60 hover:text-white transition-colors"
                  aria-label="Instagram"
                >
                  <svg
                    className="w-5 h-5"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <rect
                      x="2"
                      y="2"
                      width="20"
                      height="20"
                      rx="5"
                      ry="5"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                    />
                    <path
                      d="M12 8a4 4 0 014 4 4 4 0 01-4 4 4 4 0 01-4-4 4 4 0 014-4m0-2a6 6 0 100 12 6 6 0 000-12z"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                    />
                    <circle cx="17.5" cy="6.5" r="1.5" fill="currentColor" />
                  </svg>
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
