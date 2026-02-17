"use client";
import { useCart } from "@/context/CartContext";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import { toast } from "sonner";

export default function CheckoutForm() {
    const router = useRouter();
    const { cartData } = useCart(); // Assuming you might need cart data to send with order
    const [loading, setLoading] = useState(false);

    // Form state
    const [formData, setFormData] = useState({
        email: "",
        firstName: "",
        lastName: "",
        address: "",
        apartment: "",
        city: "",
        state: "",
        pincode: "",
        phone: ""
    });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    // Mock order placement
    try {
        await new Promise(resolve => setTimeout(resolve, 2000)); // Simulate API call
        toast.success("Order placed successfully!");
        console.log("Order Data:", { formData, cart: cartData });
        router.push("/orders"); // Or success page
    } catch (error) {
        toast.error("Failed to place order. Please try again.");
        console.error("Order error:", error);
    } finally {
        setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      {/* Contact Section */}
      <div className="space-y-4">
        <h2 className="text-xl font-montserrat text-white/90 font-semibold">Contact</h2>
        <input
          type="email"
          name="email"
          placeholder="Email address"
          required
          value={formData.email}
          onChange={handleChange}
          className="w-full bg-zinc-900 border border-zinc-800 rounded px-4 py-3 text-white placeholder:text-zinc-500 focus:outline-none focus:border-[#C9B27B] focus:ring-1 focus:ring-[#C9B27B] transition-all font-quicksand"
        />
      </div>

       {/* Shipping Section */}
       <div className="space-y-4">
        <h2 className="text-xl font-montserrat text-white/90 font-semibold">Shipping address</h2>
        
        <div className="grid grid-cols-2 gap-4">
            <input
            type="text"
            name="firstName"
            placeholder="First name"
            required
            value={formData.firstName}
            onChange={handleChange}
            className="w-full bg-zinc-900 border border-zinc-800 rounded px-4 py-3 text-white placeholder:text-zinc-500 focus:outline-none focus:border-[#C9B27B] focus:ring-1 focus:ring-[#C9B27B] transition-all font-quicksand"
            />
            <input
            type="text"
            name="lastName"
            placeholder="Last name"
            required
            value={formData.lastName}
            onChange={handleChange}
            className="w-full bg-zinc-900 border border-zinc-800 rounded px-4 py-3 text-white placeholder:text-zinc-500 focus:outline-none focus:border-[#C9B27B] focus:ring-1 focus:ring-[#C9B27B] transition-all font-quicksand"
            />
        </div>

        <input
          type="text"
          name="address"
          placeholder="Address"
          required
          value={formData.address}
          onChange={handleChange}
          className="w-full bg-zinc-900 border border-zinc-800 rounded px-4 py-3 text-white placeholder:text-zinc-500 focus:outline-none focus:border-[#C9B27B] focus:ring-1 focus:ring-[#C9B27B] transition-all font-quicksand"
        />

        <input
          type="text"
          name="apartment"
          placeholder="Apartment, suite, etc. (optional)"
          value={formData.apartment}
          onChange={handleChange}
          className="w-full bg-zinc-900 border border-zinc-800 rounded px-4 py-3 text-white placeholder:text-zinc-500 focus:outline-none focus:border-[#C9B27B] focus:ring-1 focus:ring-[#C9B27B] transition-all font-quicksand"
        />

        <div className="grid grid-cols-2 gap-4">
            <input
            type="text"
            name="city"
            placeholder="City"
            required
            value={formData.city}
            onChange={handleChange}
            className="w-full bg-zinc-900 border border-zinc-800 rounded px-4 py-3 text-white placeholder:text-zinc-500 focus:outline-none focus:border-[#C9B27B] focus:ring-1 focus:ring-[#C9B27B] transition-all font-quicksand"
            />
             <input
            type="text"
            name="pincode"
            placeholder="PIN Code"
            required
            value={formData.pincode}
            onChange={handleChange}
            className="w-full bg-zinc-900 border border-zinc-800 rounded px-4 py-3 text-white placeholder:text-zinc-500 focus:outline-none focus:border-[#C9B27B] focus:ring-1 focus:ring-[#C9B27B] transition-all font-quicksand"
            />
        </div>
        
        <input
          type="text"
          name="state"
          placeholder="State"
          required
          value={formData.state}
          onChange={handleChange}
          className="w-full bg-zinc-900 border border-zinc-800 rounded px-4 py-3 text-white placeholder:text-zinc-500 focus:outline-none focus:border-[#C9B27B] focus:ring-1 focus:ring-[#C9B27B] transition-all font-quicksand"
        />

        <input
          type="tel"
          name="phone"
          placeholder="Phone"
          required
          value={formData.phone}
          onChange={handleChange}
          className="w-full bg-zinc-900 border border-zinc-800 rounded px-4 py-3 text-white placeholder:text-zinc-500 focus:outline-none focus:border-[#C9B27B] focus:ring-1 focus:ring-[#C9B27B] transition-all font-quicksand"
        />
      </div>

      <button
        type="submit"
        disabled={loading}
        className="w-full py-4 bg-[#C9B27B] text-black font-bold text-lg rounded hover:bg-[#b5a265] transition-colors shadow-lg disabled:opacity-50 disabled:cursor-not-allowed font-montserrat mt-8"
      >
        {loading ? "Processing..." : "Place Order"}
      </button>
    </form>
  );
}
