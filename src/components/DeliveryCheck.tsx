"use client";
import { useState } from "react";

// Dummy data for delivery areas
const DELIVERY_PINCODES = [
  "110001", // Delhi
  "110002",
  "110003",
  "400001", // Mumbai
  "400002",
  "400003",
  "560001", // Bangalore
  "560002",
  "560003",
  "700001", // Kolkata
  "700002",
  "700003",
  "600001", // Chennai
  "600002",
  "600003",
  "500001", // Hyderabad
  "500002",
  "500003",
  "411001", // Pune
  "411002",
  "411003",
  "302001", // Jaipur
  "302002",
  "302003",
];

// Dummy data for COD available areas
const COD_PINCODES = [
  "110001",
  "110002",
  "400001",
  "400002",
  "560001",
  "560002",
  "700001",
  "600001",
  "500001",
  "411001",
  "302001",
];

export default function DeliveryCheck() {
  const [inputValue, setInputValue] = useState("");
  const [pincode, setPincode] = useState("");
  const [checked, setChecked] = useState(false);
  const [isDeliveryAvailable, setIsDeliveryAvailable] = useState(false);
  const [isCodAvailable, setIsCodAvailable] = useState(false);

  const handleCheckDelivery = () => {
    if (!inputValue.trim()) {
      alert("Please enter a valid pincode");
      return;
    }

    setPincode(inputValue);
    const deliveryAvailable = DELIVERY_PINCODES.includes(inputValue);
    const codAvailable = COD_PINCODES.includes(inputValue);

    setIsDeliveryAvailable(deliveryAvailable);
    setIsCodAvailable(codAvailable);
    setChecked(true);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleCheckDelivery();
    }
  };

  return (
    <div className="space-y-6 max-sm:space-y-4 mt-6 p-6 border border-[#C9B27B] rounded-lg bg-zinc-900 text-[#FFFFFF]/70">
      {/* Delivery Time Info */}
      <div className="bg-zinc-700 rounded-lg p-4">
        <div className="flex items-start gap-3">
          <div className="flex flex-col gap-3 max-md:gap-2 max-sm:gap-1">
            <h3 className="text-[20px] max-sm:text-[14px] max-md:text-[17px] text-white/70 font-montserrat leading-[1.05]">
              Delivery Timeline
            </h3>
            <p className="text-[16px] max-md:text-[14px] text-white/50 font-quicksand leading-[1.05] text-start">
              Standard delivery typically takes{" "}
              <span className="font-semibold">4-5 business days</span> from the
              date of order confirmation.
            </p>
          </div>
        </div>
      </div>

      {/* Delivery Check Section */}
      <div className="space-y-4 max-sm:space-y-2">
        <h3 className="text-[20px] max-sm:text-[14px] max-md:text-[17px] text-white/70 font-montserrat leading-[1.05]">
          Check Delivery Availability
        </h3>

        <div className="flex gap-2 max-sm:flex-col">
          <div className="flex-1 relative flex items-center border-b border-[#C9B27B] py-1 ">
            <input
              type="text"
              placeholder="Enter your pincode"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyPress={handleKeyPress}
              maxLength={6}
              className="w-full px-4 py-2 pr-16  text-white/50 rounded-lg focus:outline-none focus:border-[#C9B27B]"
            />
            <button
              onClick={handleCheckDelivery}
              className="absolute right-1 px-3 py-1 bg-[#C9B27B] text-black font-bold rounded hover:bg-[#b5a265] transition text-sm"
            >
              Check
            </button>
          </div>
        </div>

        {/* Results */}
        {checked && (
          <div className="space-y-3 mt-4">
            {/* Delivery Result */}
            <div
              className={`p-4 rounded-lg flex items-center gap-3 ${
                isDeliveryAvailable
                  ? "bg-green-50 border border-green-200"
                  : "bg-red-50 border border-red-200"
              }`}
            >
              <div>
                <p className="font-semibold text-gray-800 text-[20px] max-sm:text-[14px] max-md:text-[17px] font-monserrat">
                  {isDeliveryAvailable
                    ? "We Deliver to Your Area"
                    : "Delivery Unavailable"}
                </p>
                <p className="text-[16px] max-md:text-[14px] font-quicksand text-gray-600">
                  {isDeliveryAvailable
                    ? `Pincode ${pincode} is in our delivery zone`
                    : `We regret to inform you that delivery is not currently available to pincode  ${pincode}. We apologize for the inconvenience and appreciate your understanding.`}
                </p>
              </div>
            </div>

            {/* COD Result - Only show if delivery is available */}
            {isDeliveryAvailable && (
              <div
                className={`p-4 rounded-lg flex items-center gap-3 ${
                  isCodAvailable
                    ? "bg-green-200 border border-green-200"
                    : "bg-orange-50 border border-orange-200"
                }`}
              >
                <div>
                  <p className="font-semibold text-gray-800 text-[20px] max-sm:text-[14px] max-md:text-[17px] font-monserrat">
                    {isCodAvailable ? "COD Available" : "COD Not Available"}
                  </p>
                  <p className="text-[16px] max-md:text-[14px] font-quicksand text-gray-600">
                    {isCodAvailable
                      ? "Cash on Delivery is available for your area"
                      : "Only online payment available for this area"}
                  </p>
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Info Box */}
      <div className="  p-4 text-sm text-gray-600">
        <p className="text-[20px] max-sm:text-[14px] max-md:text-[17px] text-white/70 font-montserrat leading-[1.05] mb-2">
          Note:
        </p>
        <ul className="list-disc list-inside space-y-1 text-white/50 text-[16px] max-md:text-[14px] font-quicksand">
          <li>
            Delivery times may vary based on location and order complexity
          </li>
          <li>Orders are processed within 24 hours</li>
          <li>Delivery charges may apply for certain areas</li>
        </ul>
      </div>
    </div>
  );
}
