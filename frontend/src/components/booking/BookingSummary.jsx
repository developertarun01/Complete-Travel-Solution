import React from "react";
import { Calendar, Users, MapPin, CreditCard } from "lucide-react";

const BookingSummary = ({ booking, onProceedToPayment }) => {
  if (!booking) return null;

  const renderBookingDetails = () => {
    switch (booking.type) {
      case "flight":
        return (
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="font-semibold">Flight:</span>
              <span>
                {booking.details.airline} {booking.details.flightNumber}
              </span>
            </div>
            <div className="flex justify-between">
              <span>Route:</span>
              <span>
                {booking.details.origin} → {booking.details.destination}
              </span>
            </div>
            <div className="flex justify-between">
              <span>Departure:</span>
              <span>
                {new Date(booking.details.departureDate).toLocaleDateString()}
              </span>
            </div>
            {booking.details.returnDate && (
              <div className="flex justify-between">
                <span>Return:</span>
                <span>
                  {new Date(booking.details.returnDate).toLocaleDateString()}
                </span>
              </div>
            )}
            <div className="flex justify-between">
              <span>Passengers:</span>
              <span>
                {booking.passengers.length}{" "}
                {booking.passengers.length === 1 ? "person" : "people"}
              </span>
            </div>
            <div className="flex justify-between">
              <span>Class:</span>
              <span className="capitalize">
                {booking.details.travelClass.toLowerCase()}
              </span>
            </div>
          </div>
        );

      case "hotel":
        return (
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="font-semibold">Hotel:</span>
              <span>{booking.details.hotelName}</span>
            </div>
            <div className="flex justify-between">
              <span>Location:</span>
              <span>{booking.details.location}</span>
            </div>
            <div className="flex justify-between">
              <span>Check-in:</span>
              <span>
                {new Date(booking.details.checkInDate).toLocaleDateString()}
              </span>
            </div>
            <div className="flex justify-between">
              <span>Check-out:</span>
              <span>
                {new Date(booking.details.checkOutDate).toLocaleDateString()}
              </span>
            </div>
            <div className="flex justify-between">
              <span>Guests:</span>
              <span>
                {booking.details.guests}{" "}
                {booking.details.guests === 1 ? "person" : "people"}
              </span>
            </div>
            <div className="flex justify-between">
              <span>Rooms:</span>
              <span>
                {booking.details.rooms}{" "}
                {booking.details.rooms === 1 ? "room" : "rooms"}
              </span>
            </div>
          </div>
        );

      case "car":
        return (
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="font-semibold">Car Rental:</span>
              <span>{booking.details.carType}</span>
            </div>
            <div className="flex justify-between">
              <span>Pick-up:</span>
              <span>{booking.details.pickupLocation}</span>
            </div>
            <div className="flex justify-between">
              <span>Drop-off:</span>
              <span>{booking.details.dropLocation || "Same as pick-up"}</span>
            </div>
            <div className="flex justify-between">
              <span>Duration:</span>
              <span>{booking.details.duration} days</span>
            </div>
          </div>
        );

      case "cruise":
        return (
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="font-semibold">Cruise:</span>
              <span>{booking.details.cruiseLine}</span>
            </div>
            <div className="flex justify-between">
              <span>Destination:</span>
              <span>{booking.details.destination}</span>
            </div>
            <div className="flex justify-between">
              <span>Duration:</span>
              <span>{booking.details.nights} nights</span>
            </div>
            <div className="flex justify-between">
              <span>Ship:</span>
              <span>{booking.details.shipName}</span>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-2xl font-bold mb-6 flex items-center">
        <CreditCard className="h-6 w-6 mr-2 text-[var(--primary)]" />
        Booking Summary
      </h2>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div>
          <h3 className="text-lg font-semibold mb-4 text-gray-800">
            Booking Details
          </h3>
          {renderBookingDetails()}
        </div>

        <div>
          <h3 className="text-lg font-semibold mb-4 text-gray-800">
            Price Breakdown
          </h3>
          <div className="space-y-3 bg-gray-50 p-4 rounded-lg">
            <div className="flex justify-between">
              <span>Base Price:</span>
              <span>${booking.pricing.basePrice.toFixed(2)}</span>
            </div>
            {booking.pricing.discount > 0 && (
              <div className="flex justify-between text-green-600">
                <span>Discount:</span>
                <span>-${booking.pricing.discount.toFixed(2)}</span>
              </div>
            )}
            <div className="flex justify-between font-bold text-lg border-t pt-3 mt-3">
              <span>Total:</span>
              <span>${booking.pricing.finalPrice.toFixed(2)}</span>
            </div>
            {booking.promoCode && (
              <div className="text-sm text-gray-600 mt-2">
                Promo code applied: {booking.promoCode}
              </div>
            )}
          </div>

          <button
            onClick={onProceedToPayment}
            className="w-full bg-[var(--accent-dark)] hover:bg-[var(--accent)] text-white py-3 px-4 rounded-lg font-medium mt-6 transition-colors duration-200"
          >
            Proceed to Payment
          </button>
        </div>
      </div>
    </div>
  );
};

export default BookingSummary;
