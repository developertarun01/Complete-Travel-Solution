import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { MapPin, Calendar, Car, User } from "lucide-react";

const CarForm = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    pickupLocation: "",
    dropLocation: "",
    fromDateTime: "",
    toDateTime: "",
    age: 25,
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

    if (
      !formData.pickupLocation ||
      !formData.fromDateTime ||
      !formData.toDateTime
    ) {
      alert("Please fill in all required fields");
      return;
    }

    navigate("/results", {
      state: {
        searchType: "cars",
        formData,
        searchParams: {
          pickupLocation: formData.pickupLocation,
          dropLocation: formData.dropLocation,
          duration: `${formData.fromDateTime} to ${formData.toDateTime}`,
        },
      },
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="flex flex-col md:flex-row gap-4 items-end">
        {/* Pick-up Location */}
        <div className="w-full flex-1">
          <div className="relative">
            <MapPin className="h-5 w-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              name="pickupLocation"
              value={formData.pickupLocation}
              onChange={handleChange}
              placeholder="Pick-up Location"
              className="w-full pl-10 pr-3 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-[var(--primary)]"
              required
            />
          </div>
        </div>

        {/* Drop-off Location */}
        <div className="w-full flex-1">
          <div className="relative">
            <MapPin className="h-5 w-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              name="dropLocation"
              value={formData.dropLocation}
              onChange={handleChange}
              placeholder="Drop-off Location"
              className="w-full pl-10 pr-3 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-[var(--primary)]"
            />
          </div>
        </div>

        {/* Pick-up Date & Time */}
        <div className="w-full flex-1">
          <div className="relative">
            <Calendar className="h-5 w-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="datetime-local"
              name="fromDateTime"
              value={formData.fromDateTime}
              onChange={handleChange}
              min={new Date().toISOString().slice(0, 16)}
              className="w-full pl-10 pr-3 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-[var(--primary)]"
              required
            />
          </div>
        </div>

        {/* Drop-off Date & Time */}
        <div className="w-full flex-1">
          <div className="relative">
            <Calendar className="h-5 w-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="datetime-local"
              name="toDateTime"
              value={formData.toDateTime}
              onChange={handleChange}
              min={
                formData.fromDateTime || new Date().toISOString().slice(0, 16)
              }
              className="w-full pl-10 pr-3 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-[var(--primary)]"
              required
            />
          </div>
        </div>

        {/* Driver's Age */}
        <div className="w-full flex-1">
          <div className="relative">
            <User className="h-5 w-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <select
              name="age"
              value={formData.age}
              onChange={handleChange}
              className="w-full pl-10 pr-3 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-[var(--primary)] appearance-none"
            >
              {Array.from({ length: 50 }, (_, i) => i + 21).map((age) => (
                <option key={age} value={age}>
                  {age} years
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Search Button */}
        <div className="w-full flex-1">
          <button
            type="submit"
            className="w-full bg-[var(--accent-dark)] hover:bg-[var(--accent)] text-white px-6 py-3 rounded-md font-medium transition-colors duration-200 flex items-center justify-center"
          >
            Search
          </button>
        </div>
      </div>
    </form>
  );
};

export default CarForm;
