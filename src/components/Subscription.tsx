const Subscription = ({ image = "/kitchen2.png" }) => {
  return (
    <section className="relative w-full h-[70vh] max-md:h-[50vh] max-sm:h-[40vh]  overflow-hidden">
      {/* Background image */}
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: `url(${image})` }}
      />

      {/* Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/50 to-transparent md:from-black/70 md:via-black/40" />

      <div className="relative z-10 flex items-center justify-center h-full px-8 md:px-12">
        <div className="relative z-10 flex items-center justify-center h-full px-6 w-full">
          <div className="text-center space-y-5 max-sm:space-y-3 max-md:space-y-4 w-full flex flex-col items-center max-sm:items-start">
            <p className="text-white/60 tracking-[0.3em] uppercase text-[20px] max-sm:text-[10px] max-md:text-[17px] font-montserrat leading-[1.05]">
              Exclusive for Subscribers
            </p>

            <h2 className="font-montserrat text-white/90 tracking-tight leading-[1.1] font-medium text-[64px] max-sm:text-[32px] max-md:text-[55px] text-center max-sm:text-left">
              Upgrade Your Everyday Living.
            </h2>

            <p className="max-w-3xl text-center text-[20px] max-sm:text-[10px] max-md:text-[17px] text-white/70 font-quicksand leading-[1.05] max-sm:text-left">
              Get early access to premium kitchen & home essentials — built for
              Indian cooking, modern design, and everyday use.
            </p>

            <div className="pt-3 flex justify-center">
              <div className="flex w-full max-w-md bg-white rounded-lg overflow-hidden">
                <input
                  type="email"
                  placeholder="Enter your email"
                  className="flex-1 px-4 py-3 text-black outline-none max-sm:px-1 max-sm:py-2 max-md:px-3 max-md:py-2 font-quicksand text-[16px] max-sm:text-[12px] max-md:text-[14px]"
                />
                <button
                  className="inline-block bg-[#C9B27B] text-[#111111] text-lg max-sm:text-xs max-md:text-sm
                       px-6 py-3 sm:px-7 max-sm:py-1 max-md:px-2 max-md:py-2
                       rounded-md font-semibold shadow-lg
                       hover:bg-[#c3a86d] transition-all duration-200 w-fit font-montserrat"
                >
                  Subscribe
                </button>
              </div>
            </div>

            <p className="text-white/50 text-sm max-sm:text-xs max-md:text-sm font-quicksand leading-[1.05]">
              No spam. Unsubscribe anytime.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Subscription;
