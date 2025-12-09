type Props = {
  image?: string;
};

const Hero = ({ image = "/banner3.png" }: Props) => {
  return (
    <section className="relative w-full h-screen overflow-hidden">
      {/* Background image */}
      <div
        className="absolute inset-0 bg-cover bg-center lg:scale-105 md:scale-110 scale-125"
        style={{ backgroundImage: `url(${image})` }}
      />

      {/* Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/50 to-transparent md:from-black/70 md:via-black/40" />

      {/* Content */}
      <div className="relative z-10 flex items-center h-full px-8 md:px-12">
        <div
          className="max-w-2xl space-y-8 md:space-y-7 sm:space-y-6 text-[#F5F5F2] 
                pt-10 sm:pt-12 md:pt-0"
        >
          {/* Tagline */}
          <p className="font-quicksand text-[22px] sm:text-[26px] md:text-[32px] leading-tight opacity-90">
            Smarter Home. Better Life.
          </p>

          {/* Main Headline */}
          <h1
            className="font-montserrat font-bold tracking-tight leading-[1.1]
                         text-[64px] max-sm:text-[42px] max-md:text-[55px]"
          >
            Elevate Your Living Space with{" "}
            <span className="text-[#C9B27B] font-semibold whitespace-nowrap">
              Casa&nbsp;Blancc.
            </span>
          </h1>

          {/* Subline */}
          <p
            className="font-quicksand opacity-85 leading-relaxed
                        text-[23px] max-sm:text-[17px] max-md:text-[20px] max-w-lg"
          >
            Smart solutions crafted to upgrade every corner of your home.
          </p>

          {/* CTA */}
          <a
            href="/products"
            className="inline-block bg-[#C9B27B] text-[#111111]
                       px-6 py-3 sm:px-7 sm:py-3 md:px-10 md:py-4
                       rounded-md font-semibold shadow-lg
                       hover:bg-[#c3a86d] transition-all duration-200 w-fit"
          >
            Shop Now
          </a>
        </div>
      </div>
    </section>
  );
};

export default Hero;
