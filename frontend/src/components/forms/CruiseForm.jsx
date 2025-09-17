import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { MapPin, Ship, Moon, User, Mail, Phone } from "lucide-react";

const CruiseForm = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    destination: "",
    cruiseLine: "",
    shipName: "",
    nights: 7,
    name: "",
    email: "",
    mobile: "",
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
      !formData.name ||
      !formData.email ||
      !formData.mobile
    ) {
      alert("Please fill in all required fields");
      return;
    }

    navigate("/results", {
      state: {
        searchType: "cruises",
        formData,
        searchParams: {
          destination: formData.destination,
          nights: formData.nights,
          cruiseLine: formData.cruiseLine,
        },
      },
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* Cruise Search Fields */}
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
              placeholder="Destination"
              className="w-full pl-10 pr-3 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-[var(--primary)]"
              required
            />
          </div>
        </div>

        {/* Cruise Line */}
        <div className="w-full flex-1">
          <div className="relative">
            <Ship className="h-5 w-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <select
              name="cruiseLine"
              value={formData.cruiseLine}
              onChange={handleChange}
              className="w-full pl-10 pr-3 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-[var(--primary)] appearance-none"
            >
              <option value="">Any Cruise Line</option>
              <option value="Royal Caribbean">Royal Caribbean</option>
              <option value="Norwegian">Norwegian Cruise Line</option>
              <option value="Carnival">Carnival Cruise Line</option>
              <option value="MSC">MSC Cruises</option>
              <option value="Princess">Princess Cruises</option>
            </select>
          </div>
        </div>

        {/* Ship Name */}
        <div className="w-full flex-1">
          <div className="relative">
            <Ship className="h-5 w-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              name="shipName"
              value={formData.shipName}
              onChange={handleChange}
              placeholder="Ship Name"
              className="w-full pl-10 pr-3 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-[var(--primary)]"
            />
          </div>
        </div>

        {/* Cruise Duration */}
        <div className="w-full flex-1">
          <div className="relative">
            <Moon className="h-5 w-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <select
              name="nights"
              value={formData.nights}
              onChange={handleChange}
              className="w-full pl-10 pr-3 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-[var(--primary)] appearance-none"
            >
              <option value="3">3 Nights</option>
              <option value="4">4 Nights</option>
              <option value="5">5 Nights</option>
              <option value="7">7 Nights</option>
              <option value="10">10 Nights</option>
              <option value="14">14 Nights</option>
            </select>
          </div>
        </div>
      </div>

      {/* Contact Information */}
      <div className="flex flex-col md:flex-row gap-4 items-end">
        {/* Full Name */}
        <div className="w-full flex-1">
          <div className="relative">
            <User className="h-5 w-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Full Name"
              className="w-full pl-10 pr-3 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-[var(--primary)]"
              required
            />
          </div>
        </div>

        {/* Email Address */}
        <div className="w-full flex-1">
          <div className="relative">
            <Mail className="h-5 w-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Email Address"
              className="w-full pl-10 pr-3 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-[var(--primary)]"
              required
            />
          </div>
        </div>

        {/* Mobile Number */}
        <div className="w-full flex-1">
          <div className="relative">
            <Phone className="h-5 w-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="tel"
              name="mobile"
              value={formData.mobile}
              onChange={handleChange}
              placeholder="Mobile Number"
              className="w-full pl-10 pr-3 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-[var(--primary)]"
              required
            />
          </div>
        </div>

        {/* Search Button */}
        <div className="w-full flex-1">
          <button
            type="submit"
            className="w-full bg-[var(--accent-dark)] hover:bg-[var(--accent)] text-white px-6 py-3 rounded-md font-medium transition-colors duration-200 flex items-center justify-center"
          >
            {/* <Ship className="h-5 w-5 mr-2" /> */}
            Search
          </button>
        </div>
      </div>
    </form>
  );
};

export default CruiseForm;
