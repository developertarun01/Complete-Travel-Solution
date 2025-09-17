import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { MapPin, Calendar, Bed, Users } from "lucide-react";

const HotelForm = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    destination: "",
    checkInDate: "",
    checkOutDate: "",
    rooms: 1,
    adults: 1,
    children: 0,
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
      !formData.destination ||
      !formData.checkInDate ||
      !formData.checkOutDate
    ) {
      alert("Please fill in all required fields");
      return;
    }

    navigate("/results", {
      state: {
        searchType: "hotels",
        formData,
        searchParams: {
          destination: formData.destination,
          checkInDate: formData.checkInDate,
          checkOutDate: formData.checkOutDate,
          guests: formData.adults + formData.children,
        },
      },
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="flex flex-col md:flex-row gap-4 items-end">
        {/* Destination */}
        <div className="w-full flex-1">
          <div className="relative">
            <MapPin className="h-5 w-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              name="destination"
              value={formData.destination}
              onChange={handleChange}
              placeholder="City, Hotel, or Landmark"
              className="w-full pl-10 pr-3 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-[var(--primary)]"
              required
            />
          </div>
        </div>

        {/* Check-in Date */}
        <div className="w-full flex-1">
          <div className="relative">
            <Calendar className="h-5 w-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="date"
              name="checkInDate"
              value={formData.checkInDate}
              onChange={handleChange}
              min={new Date().toISOString().split("T")[0]}
              className="w-full pl-10 pr-3 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-[var(--primary)]"
              required
            />
          </div>
        </div>

        {/* Check-out Date */}
        <div className="w-full flex-1">
          <div className="relative">
            <Calendar className="h-5 w-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="date"
              name="checkOutDate"
              value={formData.checkOutDate}
              onChange={handleChange}
              min={
                formData.checkInDate || new Date().toISOString().split("T")[0]
              }
              className="w-full pl-10 pr-3 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-[var(--primary)]"
              required
            />
          </div>
        </div>

        {/* Rooms */}
        <div className="w-full flex-1">
          <div className="relative">
            <Bed className="h-5 w-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <select
              name="rooms"
              value={formData.rooms}
              onChange={handleChange}
              className="w-full pl-10 pr-3 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-[var(--primary)] appearance-none"
            >
              {[1, 2, 3, 4, 5].map((num) => (
                <option key={num} value={num}>
                  {num} Room{num > 1 ? "s" : ""}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Adults */}
        <div className="w-full flex-1">
          <div className="relative">
            <Users className="h-5 w-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <select
              name="adults"
              value={formData.adults}
              onChange={handleChange}
              className="w-full pl-10 pr-3 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-[var(--primary)] appearance-none"
            >
              {[1, 2, 3, 4, 5, 6].map((num) => (
                <option key={num} value={num}>
                  {num} Adult{num > 1 ? "s" : ""}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Children */}
        <div className="w-full flex-1">
          <div className="relative">
            <Users className="h-5 w-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <select
              name="children"
              value={formData.children}
              onChange={handleChange}
              className="w-full pl-10 pr-3 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-[var(--primary)] appearance-none"
            >
              {[0, 1, 2, 3, 4].map((num) => (
                <option key={num} value={num}>
                  {num} Child{num !== 1 ? "ren" : ""}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Search Button */}
        <div className="w-full flex-1">
          <button
            type="submit"
            className="w-full bg-[var(--accent-dark)] hover:bg-[var(--accent)] text-white px-6 py-3 rounded-md font-medium transition-colors duration-200"
          >
            Search
          </button>
        </div>
      </div>
    </form>
  );
};

export default HotelForm;
