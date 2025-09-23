import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Calendar, Users, ArrowRightLeft } from "lucide-react";

const FlightForm = () => {
  const navigate = useNavigate();
  const today = new Date().toISOString().split("T")[0];

  const today2 = new Date();
  today2.setDate(today2.getDate() + 5); // ✅ add 5 days
  const fiveDaysLater = today2.toISOString().split("T")[0];

  const [formData, setFormData] = useState({
    tripType: "roundTrip",
    origin: "",
    destination: "",
    fromDate: today,
    toDate: fiveDaysLater,
    adults: 1,
    children: 0,
    travelClass: "ECONOMY",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate form
    if (!formData.origin || !formData.destination || !formData.fromDate) {
      alert("Please fill in all required fields");
      return;
    }

    if (formData.tripType === "roundTrip" && !formData.toDate) {
      alert("Please select return date for round trip");
      return;
    }

    // Prepare data for backend API
    const apiData = {
      tripType: formData.tripType,
      origin: formData.origin.toUpperCase().substring(0, 3), // Ensure 3-letter code
      destination: formData.destination.toUpperCase().substring(0, 3), // Ensure 3-letter code
      fromDate: formData.fromDate,
      toDate: formData.tripType === "roundTrip" ? formData.toDate : undefined,
      adults: parseInt(formData.adults),
      children: parseInt(formData.children),
      travelClass: formData.travelClass,
    };

    // Navigate to results page with search parameters
    navigate("/results", {
      state: {
        searchType: "flights",
        formData: apiData, // Send the properly formatted data
        searchParams: {
          origin: formData.origin,
          destination: formData.destination,
          fromDate: formData.fromDate,
          toDate: formData.toDate,
          passengers: parseInt(formData.adults) + parseInt(formData.children),
        },
      },
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* Row 1: Trip Type - Responsive for mobile */}
      <div className="flex sm:flex-row space-x-4 justify-center sm:justify-start">
        <button
          type="button"
          className={`flex items-center justify-center space-x-2 px-4 py-3 rounded-lg border transition-colors h-12 ${
            formData.tripType === "roundTrip"
              ? "bg-[var(--primary)] border-[var(--primary)] text-white"
              : "border-gray-300 text-gray-600 hover:border-[var(--primary)]"
          }`}
          onClick={() =>
            setFormData((prev) => ({ ...prev, tripType: "roundTrip" }))
          }
        >
          <ArrowRightLeft className="h-4 w-4" />
          <span>Round Trip</span>
        </button>

        <button
          type="button"
          className={`flex items-center justify-center space-x-2 px-4 py-3 rounded-lg border transition-colors h-12 ${
            formData.tripType === "oneWay"
              ? "bg-[var(--primary)] border-[var(--primary)] text-white"
              : "border-gray-300 text-gray-600 hover:border-[var(--primary)]"
          }`}
          onClick={() =>
            setFormData((prev) => ({ ...prev, tripType: "oneWay" }))
          }
        >
          <ArrowRightLeft className="h-4 w-4" />
          <span>One Way</span>
        </button>
      </div>

      {/* Row 2: All other elements - Responsive for mobile */}
      <div className="grid grid-cols-1 sm:grid-cols-8 gap-3 items-end">
        {/* Travel Class */}
        <div className="sm:col-span-1">
          <div className="relative">
            <select
              name="travelClass"
              value={formData.travelClass}
              onChange={handleChange}
              className="w-full px-3 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-[var(--primary)] h-12"
            >
              <option value="ECONOMY">Economy</option>
              <option value="PREMIUM_ECONOMY">Premium Economy</option>
              <option value="BUSINESS">Business</option>
              <option value="FIRST">First Class</option>
            </select>
          </div>
        </div>

        {/* From */}
        <div className="sm:col-span-1">
          <input
            type="text"
            name="origin"
            value={formData.origin}
            onChange={handleChange}
            placeholder="From (e.g., JFK)"
            className="w-full px-3 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-[var(--primary)] h-12"
            required
            maxLength={3}
            pattern="[A-Za-z]{3}"
          />
        </div>

        {/* To */}
        <div className="sm:col-span-1">
          <input
            type="text"
            name="destination"
            value={formData.destination}
            onChange={handleChange}
            placeholder="To (e.g., LAX)"
            className="w-full px-3 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-[var(--primary)] h-12"
            required
            maxLength={3}
            pattern="[A-Za-z]{3}"
          />
        </div>

        {/* Departure Date */}
        <div className="sm:col-span-1">
          <div className="relative">
            <input
              type="date"
              name="fromDate"
              value={formData.fromDate}
              onChange={handleChange}
              min={new Date().toISOString().split("T")[0]}
              className="w-full px-3 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-[var(--primary)] h-12"
              required
            />
            {/* <Calendar className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" /> */}
          </div>
        </div>

        {/* Return Date (only if roundTrip) */}
        {formData.tripType === "roundTrip" ? (
          <div className="sm:col-span-1">
            <div className="relative">
              <input
                type="date"
                name="toDate"
                value={formData.toDate}
                onChange={handleChange}
                min={
                  formData.fromDate || new Date().toISOString().split("T")[0]
                }
                className="w-full px-3 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-[var(--primary)] h-12"
                required
              />
              {/* <Calendar className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" /> */}
            </div>
          </div>
        ) : (
          <div className="sm:col-span-1 hidden sm:block"></div>
        )}

        {/* Adults */}
        <div className="sm:col-span-1">
          <div className="relative">
            <select
              name="adults"
              value={formData.adults}
              onChange={handleChange}
              className="w-full px-3 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-[var(--primary)] h-12 appearance-none"
            >
              {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((num) => (
                <option key={num} value={num}>
                  {num} Adult{num > 1 ? "s" : ""}
                </option>
              ))}
            </select>
            <Users className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
          </div>
        </div>

        {/* Children */}
        <div className="sm:col-span-1">
          <div className="relative">
            <select
              name="children"
              value={formData.children}
              onChange={handleChange}
              className="w-full px-3 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-[var(--primary)] h-12 appearance-none"
            >
              {[0, 1, 2, 3, 4, 5, 6].map((num) => (
                <option key={num} value={num}>
                  {num} Child{num !== 1 ? "ren" : ""}
                </option>
              ))}
            </select>
            <Users className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
          </div>
        </div>

        {/* Search Button */}
        <div className="sm:col-span-1">
          <button
            type="submit"
            className="w-full bg-[var(--accent-dark)] hover:bg-[var(--accent)] text-white py-3 rounded-md font-medium transition-colors duration-200 h-12"
          >
            Search
          </button>
        </div>
      </div>
    </form>
  );
};

export default FlightForm;
