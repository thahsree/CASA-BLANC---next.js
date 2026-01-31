import ContactForm from "@/components/ContactForm";
import ContactInfo from "@/components/ContactInfo";

const page = () => {
  return (
    <main className="pt-24 min-h-screen bg-zinc-50 dark:bg-black">
      <style>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(40px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .hero-section {
          animation: fadeInUp 0.8s ease-out;
        }

        .section-title {
          animation: fadeInUp 0.8s ease-out 0.2s both;
        }

        .content-section {
          animation: fadeInUp 0.8s ease-out 0.3s both;
        }
      `}</style>

      {/* Hero Section */}
      <section className="hero-section px-6 md:px-12 py-20 text-center">
        <h1 className="text-5xl md:text-6xl font-montserrat font-bold text-white/90 mb-4">
          Get In Touch
        </h1>
        <p className="text-lg md:text-xl text-white/60 font-quicksand max-w-2xl mx-auto">
          Have a question or feedback? We'd love to hear from you. Send us a
          message and we'll respond as soon as possible.
        </p>
      </section>

      {/* Contact Info Section */}
      <section className="px-6 md:px-12 py-20">
        <div className="section-title text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-montserrat font-semibold text-white/90 mb-2">
            Our Contact Details
          </h2>
          <div className="h-1 w-16 bg-gradient-to-r from-[#C9B27B] to-transparent mx-auto mt-4" />
        </div>
        <div className="content-section">
          <ContactInfo />
        </div>
      </section>

      {/* Contact Form Section */}
      <section className="px-6 md:px-12 py-20 max-w-4xl mx-auto">
        <div className="section-title text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-montserrat font-semibold text-white/90 mb-2">
            Send us a Message
          </h2>
          <p className="text-white/60 font-quicksand">
            Fill out the form below and we'll get back to you shortly
          </p>
        </div>
        <div className="content-section">
          <ContactForm />
        </div>
      </section>

      {/* Map Section (Optional) */}
      <section className="px-6 md:px-12 py-20">
        <div className="section-title text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-montserrat font-semibold text-white/90 mb-2">
            Visit Us
          </h2>
        </div>
        <div className="content-section rounded-lg overflow-hidden shadow-2xl h-96 bg-zinc-800">
          <iframe
            title="Casa Blancc Location"
            width="100%"
            height="100%"
            style={{ border: 0 }}
            loading="lazy"
            allowFullScreen
            referrerPolicy="no-referrer-when-downgrade"
            src="https://maps.google.com/maps?q=pappinisssery&output=embed&z=14"
          />
        </div>
      </section>
    </main>
  );
};

export default page;
