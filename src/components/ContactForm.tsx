"use client";

import { useState } from "react";
import { IoCheckmarkCircle } from "react-icons/io5";
import { toast } from "sonner";

export default function ContactForm() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "",
    message: "",
  });
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Validate form
      if (
        !formData.name ||
        !formData.email ||
        !formData.subject ||
        !formData.message
      ) {
        toast.error("Please fill in all required fields");
        setLoading(false);
        return;
      }

      // Email validation
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(formData.email)) {
        toast.error("Please enter a valid email");
        setLoading(false);
        return;
      }

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1500));

      setSubmitted(true);
      toast.success("Message sent successfully! We'll get back to you soon.");

      // Reset form after 3 seconds
      setTimeout(() => {
        setFormData({
          name: "",
          email: "",
          phone: "",
          subject: "",
          message: "",
        });
        setSubmitted(false);
      }, 3000);
    } catch (error) {
      toast.error("Failed to send message. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full">
      <style>{`
        @keyframes slideUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }

        @keyframes pulse-ring {
          0% {
            box-shadow: 0 0 0 0 rgba(201, 178, 123, 0.7);
          }
          70% {
            box-shadow: 0 0 0 10px rgba(201, 178, 123, 0);
          }
          100% {
            box-shadow: 0 0 0 0 rgba(201, 178, 123, 0);
          }
        }

        @keyframes shimmer-input {
          0% {
            background-position: -1000px 0;
          }
          100% {
            background-position: 1000px 0;
          }
        }

        .form-container {
          animation: slideUp 0.6s ease-out;
        }

        .form-input-group {
          animation: slideUp 0.6s ease-out;
        }

        .form-input-group:nth-child(1) {
          animation-delay: 0.1s;
        }

        .form-input-group:nth-child(2) {
          animation-delay: 0.2s;
        }

        .form-input-group:nth-child(3) {
          animation-delay: 0.3s;
        }

        .form-input-group:nth-child(4) {
          animation-delay: 0.4s;
        }

        .form-input-group:nth-child(5) {
          animation-delay: 0.5s;
        }

        .submit-btn {
          animation: slideUp 0.6s ease-out 0.6s both;
        }

        .input-focus {
          position: relative;
          transition: all 0.3s ease;
        }

        .input-focus:focus-within {
          transform: translateY(-2px);
        }

        .input-focus:focus-within input,
        .input-focus:focus-within textarea {
          border-color: #C9B27B;
          box-shadow: 0 0 0 3px rgba(201, 178, 123, 0.1);
        }

        .success-checkmark {
          animation: pulse-ring 1.5s ease-out;
        }

        .loading-spinner {
          animation: spin 1s linear infinite;
        }

        @keyframes spin {
          from {
            transform: rotate(0deg);
          }
          to {
            transform: rotate(360deg);
          }
        }
      `}</style>

      <form onSubmit={handleSubmit} className="form-container space-y-6">
        {/* Success Message */}
        {submitted && (
          <div className="fixed inset-0 flex items-center justify-center z-50 pointer-events-none">
            <div className="bg-green-500/90 backdrop-blur-sm text-white px-8 py-6 rounded-lg shadow-2xl flex items-center gap-4 animate-fade-in">
              <IoCheckmarkCircle size={32} className="success-checkmark" />
              <div>
                <p className="font-semibold text-lg">Message Sent!</p>
                <p className="text-sm opacity-90">
                  We'll get back to you shortly.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Name Field */}
        <div className="form-input-group input-focus">
          <label className="block text-sm font-quicksand font-semibold text-white/80 mb-2">
            Full Name <span className="text-red-400">*</span>
          </label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="John Doe"
            className="w-full px-4 py-3 bg-zinc-800 border border-zinc-700 rounded-lg text-white placeholder-zinc-500 focus:outline-none transition-all duration-300"
            disabled={loading}
          />
        </div>

        {/* Email Field */}
        <div className="form-input-group input-focus">
          <label className="block text-sm font-quicksand font-semibold text-white/80 mb-2">
            Email Address <span className="text-red-400">*</span>
          </label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="john@example.com"
            className="w-full px-4 py-3 bg-zinc-800 border border-zinc-700 rounded-lg text-white placeholder-zinc-500 focus:outline-none transition-all duration-300"
            disabled={loading}
          />
        </div>

        {/* Phone Field */}
        <div className="form-input-group input-focus">
          <label className="block text-sm font-quicksand font-semibold text-white/80 mb-2">
            Phone Number
          </label>
          <input
            type="tel"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            placeholder="+91 98765 43210"
            className="w-full px-4 py-3 bg-zinc-800 border border-zinc-700 rounded-lg text-white placeholder-zinc-500 focus:outline-none transition-all duration-300"
            disabled={loading}
          />
        </div>

        {/* Subject Field */}
        <div className="form-input-group input-focus">
          <label className="block text-sm font-quicksand font-semibold text-white/80 mb-2">
            Subject <span className="text-red-400">*</span>
          </label>
          <input
            type="text"
            name="subject"
            value={formData.subject}
            onChange={handleChange}
            placeholder="How can we help?"
            className="w-full px-4 py-3 bg-zinc-800 border border-zinc-700 rounded-lg text-white placeholder-zinc-500 focus:outline-none transition-all duration-300"
            disabled={loading}
          />
        </div>

        {/* Message Field */}
        <div className="form-input-group input-focus">
          <label className="block text-sm font-quicksand font-semibold text-white/80 mb-2">
            Message <span className="text-red-400">*</span>
          </label>
          <textarea
            name="message"
            value={formData.message}
            onChange={handleChange}
            placeholder="Tell us more about your inquiry..."
            rows={5}
            className="w-full px-4 py-3 bg-zinc-800 border border-zinc-700 rounded-lg text-white placeholder-zinc-500 focus:outline-none resize-none transition-all duration-300"
            disabled={loading}
          />
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={loading}
          className="submit-btn w-full px-6 py-3 bg-[#C9B27B] text-black font-semibold rounded-lg hover:bg-[#b5a265] transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 group"
        >
          {loading ? (
            <>
              <div className="loading-spinner">
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  />
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  />
                </svg>
              </div>
              Sending...
            </>
          ) : (
            <>
              Send Message
              <svg
                className="w-5 h-5 group-hover:translate-x-1 transition-transform"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M13 7l5 5m0 0l-5 5m5-5H6"
                />
              </svg>
            </>
          )}
        </button>

        {/* Help Text */}
        <p className="text-center text-sm text-zinc-400 font-quicksand">
          We typically respond within 24 hours
        </p>
      </form>
    </div>
  );
}
