import React, { useState } from 'react';
import { User, Mail, Phone, MapPin, Calendar } from 'lucide-react';

const PassengerDetails = ({ passengers, contactInfo, onChange, onNext }) => {
  const [activePassenger, setActivePassenger] = useState(0);

  const handlePassengerChange = (index, field, value) => {
    const updatedPassengers = [...passengers];
    updatedPassengers[index] = {
      ...updatedPassengers[index],
      [field]: value
    };
    onChange('passengers', updatedPassengers);
  };

  const handleContactChange = (field, value) => {
    onChange('contactInfo', {
      ...contactInfo,
      [field]: value
    });
  };

  const addPassenger = () => {
    onChange('passengers', [
      ...passengers,
      {
        firstName: '',
        lastName: '',
        dateOfBirth: '',
        gender: '',
        passportNumber: '',
        nationality: ''
      }
    ]);
  };

  const removePassenger = (index) => {
    if (passengers.length > 1) {
      const updatedPassengers = passengers.filter((_, i) => i !== index);
      onChange('passengers', updatedPassengers);
      if (activePassenger >= updatedPassengers.length) {
        setActivePassenger(updatedPassengers.length - 1);
      }
    }
  };

  const isFormValid = () => {
    // Check if all passengers have required fields
    const allPassengersValid = passengers.every(passenger =>
      passenger.firstName && passenger.lastName && passenger.dateOfBirth && passenger.gender
    );
    
    // Check if contact info is valid
    const contactInfoValid = contactInfo.email && contactInfo.phone &&
      contactInfo.address.street && contactInfo.address.city &&
      contactInfo.address.state && contactInfo.address.zipCode &&
      contactInfo.address.country;

    return allPassengersValid && contactInfoValid;
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-2xl font-bold mb-6">Passenger Details</h2>

      {/* Passenger Tabs */}
      <div className="flex space-x-2 mb-6 overflow-x-auto">
        {passengers.map((_, index) => (
          <button
            key={index}
            onClick={() => setActivePassenger(index)}
            className={`px-4 py-2 rounded-lg border transition-colors ${
              activePassenger === index
                ? 'bg-blue-100 border-blue-500 text-blue-700'
                : 'border-gray-300 text-gray-600 hover:bg-gray-50'
            }`}
          >
            Passenger {index + 1}
          </button>
        ))}
        <button
          onClick={addPassenger}
          className="px-4 py-2 rounded-lg border border-dashed border-gray-300 text-gray-600 hover:bg-gray-50"
        >
          + Add
        </button>
      </div>

      {/* Passenger Form */}
      {passengers.map((passenger, index) => (
        <div
          key={index}
          className={`space-y-4 ${activePassenger === index ? 'block' : 'hidden'}`}
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                First Name *
              </label>
              <input
                type="text"
                value={passenger.firstName}
                onChange={(e) => handlePassengerChange(index, 'firstName', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Last Name *
              </label>
              <input
                type="text"
                value={passenger.lastName}
                onChange={(e) => handlePassengerChange(index, 'lastName', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Calendar className="h-4 w-4 inline mr-1" />
                Date of Birth *
              </label>
              <input
                type="date"
                value={passenger.dateOfBirth}
                onChange={(e) => handlePassengerChange(index, 'dateOfBirth', e.target.value)}
                max={new Date().toISOString().split('T')[0]}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Gender *
              </label>
              <select
                value={passenger.gender}
                onChange={(e) => handlePassengerChange(index, 'gender', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              >
                <option value="">Select Gender</option>
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="other">Other</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Passport Number
              </label>
              <input
                type="text"
                value={passenger.passportNumber}
                onChange={(e) => handlePassengerChange(index, 'passportNumber', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Nationality
              </label>
              <input
                type="text"
                value={passenger.nationality}
                onChange={(e) => handlePassengerChange(index, 'nationality', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          {passengers.length > 1 && (
            <button
              onClick={() => removePassenger(index)}
              className="bg-red-100 text-red-700 px-4 py-2 rounded-lg hover:bg-red-200 transition-colors"
            >
              Remove Passenger
            </button>
          )}
        </div>
      ))}

      {/* Contact Information */}
      <div className="mt-8 pt-6 border-t">
        <h3 className="text-xl font-semibold mb-4">Contact Information</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <Mail className="h-4 w-4 inline mr-1" />
              Email Address *
            </label>
            <input
              type="email"
              value={contactInfo.email}
              onChange={(e) => handleContactChange('email', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <Phone className="h-4 w-4 inline mr-1" />
              Phone Number *
            </label>
            <input
              type="tel"
              value={contactInfo.phone}
              onChange={(e) => handleContactChange('phone', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
        </div>

        <div className="space-y-4">
          <h4 className="font-medium text-gray-700">
            <MapPin className="h-4 w-4 inline mr-1" />
            Address *
          </h4>
          <div className="grid grid-cols-1 gap-4">
            <input
              type="text"
              placeholder="Street Address"
              value={contactInfo.address.street}
              onChange={(e) => handleContactChange('address', { ...contactInfo.address, street: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <input
                type="text"
                placeholder="City"
                value={contactInfo.address.city}
                onChange={(e) => handleContactChange('address', { ...contactInfo.address, city: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
              <input
                type="text"
                placeholder="State"
                value={contactInfo.address.state}
                onChange={(e) => handleContactChange('address', { ...contactInfo.address, state: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
              <input
                type="text"
                placeholder="ZIP Code"
                value={contactInfo.address.zipCode}
                onChange={(e) => handleContactChange('address', { ...contactInfo.address, zipCode: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
              <input
                type="text"
                placeholder="Country"
                value={contactInfo.address.country}
                onChange={(e) => handleContactChange('address', { ...contactInfo.address, country: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
          </div>
        </div>
      </div>

      <div className="mt-8 flex justify-end">
        <button
          onClick={onNext}
          disabled={!isFormValid()}
          className={`px-8 py-3 rounded-lg font-medium text-lg transition-colors duration-200 ${
            isFormValid()
              ? 'bg-blue-600 hover:bg-blue-700 text-white'
              : 'bg-gray-300 text-gray-500 cursor-not-allowed'
          }`}
        >
          Continue to Payment
        </button>
      </div>
    </div>
  );
};

export default PassengerDetails;