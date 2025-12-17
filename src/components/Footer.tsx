const Footer = () => {
  return (
    <div className="w-full h-max bg-[#010101]">
      <div className="max-w-7xl mx-auto px-6 md:px-12 py-8 text-center text-white/60 font-quicksand text-sm sm:text-base">
        &copy; {new Date().getFullYear()} Casa Blancc. All rights reserved.
      </div>
    </div>
  );
};

export default Footer;
