type Props = {
  image?: string;
};
const TrustSection = ({ image = "/juicer2.png" }: Props) => {
  return (
    <section className="relative w-full py-20 px-6 md:px-12 text-[#FFFFFF] ">
      {/* Background image */}
      <div className="absolute inset-0 bg-center lg:scale-100 md:scale-110 scale-125 flex items-center">
        <div className="b">
          <img
            src={image}
            alt="Trust Section Background"
            className="w-full h-full object-contain "
          />
        </div>
      </div>
      <div className="max-w-7xl mx-auto">
        {/* Top Section */}
        <div className="grid md:grid-cols-2 gap-12 items-center">
          {/* Image */}
          <div className="flex justify-center md:justify-end">
            <div className="w-64 h-80 rounded-md overflow-hidden shadow-sm"></div>
          </div>
          {/* Brand Statement */}
          <div className="text-center md:text-left">
            <h2 className="text-4xl md:text-5xl font-montserrat font-semibold leading-tight">
              Reliable Smart Gadgets
              <br />
              for a Smarter Home.
            </h2>
            <p className="mt-4  text-base md:text-lg font-quicksand">
              Practical solutions. Tested quality. No gimmicks.
            </p>
          </div>
        </div>

        {/* Benefits Section */}
        <div className="mt-24">
          <h3 className="text-center text-3xl font-montserrat font-semibold ">
            Shopping Benefits
          </h3>

          <p className="text-center mt-4 font-quicksand text-base max-w-xl mx-auto">
            Best-in-class support and convenience for your home-tech shopping
            experience.
          </p>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-10 text-center mt-14">
            {/* Benefit 1 */}
            <div>
              <div className="text-4xl mb-3">⚡</div>
              <h4 className="font-semibold text-lg ">Fast Delivery</h4>
              <p className="text-sm opacity-70 mt-2">
                Quick dispatch on all orders
              </p>
            </div>

            {/* Benefit 2 */}
            <div>
              <div className="text-4xl mb-3">🚚</div>
              <h4 className="font-semibold text-lg">Free Shipping</h4>
              <p className="text-sm opacity-70 mt-2">No minimum order value</p>
            </div>

            {/* Benefit 3 */}
            <div>
              <div className="text-4xl mb-3">↩️</div>
              <h4 className="font-semibold text-lg ">Easy Returns</h4>
              <p className="text-sm opacity-70 mt-2">
                Hassle-free replacements
              </p>
            </div>

            {/* Benefit 4 */}
            <div>
              <div className="text-4xl mb-3">⭐</div>
              <h4 className="font-semibold text-lg ">Highly Rated</h4>
              <p className="text-sm opacity-70 mt-2">
                Happy customers love our gadgets
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default TrustSection;
