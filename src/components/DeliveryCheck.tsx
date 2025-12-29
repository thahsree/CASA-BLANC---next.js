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
  const [pincode, setPincode] = useState("");
  const [checked, setChecked] = useState(false);
  const [isDeliveryAvailable, setIsDeliveryAvailable] = useState(false);
  const [isCodAvailable, setIsCodAvailable] = useState(false);

  const handleCheckDelivery = () => {
    if (!pincode.trim()) {
      alert("Please enter a valid pincode");
      return;
    }

    const deliveryAvailable = DELIVERY_PINCODES.includes(pincode);
    const codAvailable = COD_PINCODES.includes(pincode);

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
    <div className="space-y-6 mt-6 p-6 border rounded-lg bg-gray-50">
      {/* Delivery Time Info */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <div className="flex items-start gap-3">
          <div className="text-blue-600 text-xl">📦</div>
          <div>
            <h3 className="font-semibold text-gray-800">Delivery Timeline</h3>
            <p className="text-sm text-gray-600 mt-1">
              Standard delivery typically takes{" "}
              <span className="font-semibold">4-5 business days</span> from the
              date of order confirmation.
            </p>
          </div>
        </div>
      </div>

      {/* Delivery Check Section */}
      <div className="space-y-4">
        <h3 className="font-semibold text-gray-800">
          Check Delivery Availability
        </h3>

        <div className="flex gap-2">
          <input
            type="text"
            placeholder="Enter your pincode"
            value={pincode}
            onChange={(e) => setPincode(e.target.value)}
            onKeyPress={handleKeyPress}
            maxLength="6"
            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-[#C9B27B] text-black"
          />
          <button
            onClick={handleCheckDelivery}
            className="px-6 py-2 bg-[#C9B27B] text-black font-semibold rounded-lg hover:bg-[#b5a265] transition"
          >
            Check
          </button>
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
              <div className="text-2xl">
                {isDeliveryAvailable ? "✅" : "❌"}
              </div>
              <div>
                <p className="font-semibold text-gray-800">
                  {isDeliveryAvailable
                    ? "We Deliver to Your Area"
                    : "Delivery Not Available"}
                </p>
                <p className="text-sm text-gray-600">
                  {isDeliveryAvailable
                    ? `Pincode ${pincode} is in our delivery zone`
                    : `Sorry, we don't deliver to pincode ${pincode} yet`}
                </p>
              </div>
            </div>

            {/* COD Result */}
            <div
              className={`p-4 rounded-lg flex items-center gap-3 ${
                isCodAvailable
                  ? "bg-green-50 border border-green-200"
                  : "bg-orange-50 border border-orange-200"
              }`}
            >
              <div className="text-2xl">{isCodAvailable ? "💳" : "⚠️"}</div>
              <div>
                <p className="font-semibold text-gray-800">
                  {isCodAvailable ? "COD Available" : "COD Not Available"}
                </p>
                <p className="text-sm text-gray-600">
                  {isCodAvailable
                    ? "Cash on Delivery is available for your area"
                    : "Only online payment available for this area"}
                </p>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Info Box */}
      <div className="bg-gray-100 border border-gray-300 rounded-lg p-4 text-sm text-gray-700">
        <p className="font-semibold mb-2">Note:</p>
        <ul className="list-disc list-inside space-y-1 text-gray-600">
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
