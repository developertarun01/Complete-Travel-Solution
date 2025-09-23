import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { CheckCircle, Download, Mail, Calendar, MapPin, Users } from 'lucide-react';

const ThankYou = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { booking, payment } = location.state || {};

  if (!booking || !payment) {
    navigate('/');
    return null;
  }

  const handleDownloadItinerary = () => {
    // Create a simple text itinerary for download
    const itinerary = `
      COMPLETE TRAVEL SOLUTION - BOOKING CONFIRMATION
      ================================================

      Booking Reference: ${booking._id}
      Payment Reference: ${payment.paymentId}

      Booking Details:
      ----------------
      Type: ${booking.type.toUpperCase()}
      Status: ${booking.status.toUpperCase()}
      Booking Date: ${new Date(booking.createdAt).toLocaleDateString()}

      ${renderBookingDetails()}

      Passenger Information:
      ---------------------
      ${booking.passengers.map((passenger, index) => `
      Passenger ${index + 1}:
        Name: ${passenger.firstName} ${passenger.lastName}
        Date of Birth: ${passenger.dateOfBirth}
        Gender: ${passenger.gender}
        ${passenger.passportNumber ? `Passport: ${passenger.passportNumber}` : ''}
        ${passenger.nationality ? `Nationality: ${passenger.nationality}` : ''}
      `).join('\n')}

      Contact Information:
      -------------------
      Email: ${booking.contactInfo.email}
      Phone: ${booking.contactInfo.phone}
      Address: ${Object.values(booking.contactInfo.address).join(', ')}

      Payment Details:
      ---------------
      Amount: ${payment.amount} ${payment.currency}
      Payment Method: ${payment.method || 'Credit Card'}
      Payment Status: ${payment.status.toUpperCase()}
      Payment Date: ${new Date(payment.paidAt).toLocaleDateString()}

      Thank you for choosing Complete Travel Solution!
      For support, please contact: support@completetravel.com
    `;

    const blob = new Blob([itinerary], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `itinerary-${booking._id}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleEmailItinerary = () => {
    alert('Itinerary would be sent to: ' + booking.contactInfo.email);
    // In a real app, this would trigger an API call to send the email
  };

  const renderBookingDetails = () => {
    switch (booking.type) {
      case 'flight':
        return `
      Flight Details:
      ---------------
      Airline: ${booking.details.airline}
      Flight Number: ${booking.details.flightNumber}
      Route: ${booking.details.origin} → ${booking.details.destination}
      Departure: ${new Date(booking.details.departureDate).toLocaleString()}
      ${booking.details.returnDate ? `Return: ${new Date(booking.details.returnDate).toLocaleString()}` : ''}
      Class: ${booking.details.travelClass}
        `;

      case 'hotel':
        return `
      Hotel Details:
      --------------
      Hotel: ${booking.details.hotelName}
      Location: ${booking.details.location}
      Check-in: ${new Date(booking.details.checkInDate).toLocaleDateString()}
      Check-out: ${new Date(booking.details.checkOutDate).toLocaleDateString()}
      Guests: ${booking.details.guests}
      Rooms: ${booking.details.rooms}
        `;

      case 'car':
        return `
      Car Rental Details:
      -------------------
      Car Type: ${booking.details.carType}
      Provider: ${booking.details.provider}
      Pick-up: ${booking.details.pickupLocation}
      Drop-off: ${booking.details.dropLocation || 'Same as pick-up'}
      Duration: ${booking.details.duration}
        `;

      case 'cruise':
        return `
      Cruise Details:
      ---------------
      Cruise Line: ${booking.details.cruiseLine}
      Ship: ${booking.details.shipName}
      Destination: ${booking.details.destination}
      Duration: ${booking.details.nights} nights
      Departure: ${new Date(booking.details.departureDate).toLocaleDateString()}
        `;

      default:
        return '';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Success Header */}
          <div className="text-center mb-8">
            <div className="bg-green-100 rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-6">
              <CheckCircle className="h-10 w-10 text-green-600" />
            </div>
            <h1 className="text-4xl font-bold text-green-600 mb-4">Booking Confirmed!</h1>
            <p className="text-xl text-gray-600">
              Thank you for your booking. Your {booking.type} has been successfully reserved.
            </p>
          </div>

          {/* Booking Summary */}
          <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
            <h2 className="text-2xl font-bold mb-6">Booking Summary</h2>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div>
                <h3 className="text-lg font-semibold mb-4 flex items-center">
                  <Calendar className="h-5 w-5 mr-2 text-[var(--primary)]" />
                  Booking Information
                </h3>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Booking Reference:</span>
                    <span className="font-mono font-semibold">{booking._id}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Booking Date:</span>
                    <span>{new Date(booking.createdAt).toLocaleDateString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Status:</span>
                    <span className="capitalize bg-green-100 text-green-800 px-2 py-1 rounded text-sm">
                      {booking.status}
                    </span>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-semibold mb-4 flex items-center">
                  <MapPin className="h-5 w-5 mr-2 text-[var(--primary)]" />
                  Travel Details
                </h3>
                <div className="space-y-3">
                  {booking.type === 'flight' && (
                    <>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Flight:</span>
                        <span>{booking.details.airline} {booking.details.flightNumber}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Route:</span>
                        <span>{booking.details.origin} → {booking.details.destination}</span>
                      </div>
                    </>
                  )}
                  {booking.type === 'hotel' && (
                    <div className="flex justify-between">
                      <span className="text-gray-600">Hotel:</span>
                      <span>{booking.details.hotelName}</span>
                    </div>
                  )}
                  {booking.type === 'car' && (
                    <div className="flex justify-between">
                      <span className="text-gray-600">Car:</span>
                      <span>{booking.details.carType}</span>
                    </div>
                  )}
                  {booking.type === 'cruise' && (
                    <div className="flex justify-between">
                      <span className="text-gray-600">Cruise:</span>
                      <span>{booking.details.cruiseLine}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Passenger Information */}
          <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
            <h2 className="text-2xl font-bold mb-6 flex items-center">
              <Users className="h-6 w-6 mr-2 text-[var(--primary)]" />
              Passenger Information
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {booking.passengers.map((passenger, index) => (
                <div key={index} className="border rounded-lg p-4">
                  <h4 className="font-semibold mb-3">Passenger {index + 1}</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Name:</span>
                      <span>{passenger.firstName} {passenger.lastName}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Date of Birth:</span>
                      <span>{passenger.dateOfBirth}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Gender:</span>
                      <span className="capitalize">{passenger.gender}</span>
                    </div>
                    {passenger.passportNumber && (
                      <div className="flex justify-between">
                        <span className="text-gray-600">Passport:</span>
                        <span>{passenger.passportNumber}</span>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Payment Information */}
          <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
            <h2 className="text-2xl font-bold mb-6">Payment Confirmation</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="text-lg font-semibold mb-4">Payment Details</h3>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Amount Paid:</span>
                    <span className="font-semibold">${payment.amount} {payment.currency}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Payment Method:</span>
                    <span>{payment.method || 'Credit Card'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Payment Date:</span>
                    <span>{new Date(payment.paidAt).toLocaleDateString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Status:</span>
                    <span className="capitalize bg-green-100 text-green-800 px-2 py-1 rounded text-sm">
                      {payment.status}
                    </span>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-semibold mb-4">Next Steps</h3>
                <ul className="space-y-2 text-gray-600">
                  <li>• You will receive a confirmation email shortly</li>
                  <li>• Check your email for detailed instructions</li>
                  <li>• Keep this booking reference for your records</li>
                  <li>• Contact support if you have any questions</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={handleDownloadItinerary}
              className="flex items-center justify-center space-x-2 bg-[var(--accent-dark)] hover:bg-[var(--accent)] text-white px-6 py-3 rounded-lg transition-colors"
            >
              <Download className="h-5 w-5" />
              <span>Download Itinerary</span>
            </button>

            <button
              onClick={handleEmailItinerary}
              className="flex items-center justify-center space-x-2 bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg transition-colors"
            >
              <Mail className="h-5 w-5" />
              <span>Email Itinerary</span>
            </button>

            <button
              onClick={() => navigate('/')}
              className="flex items-center justify-center space-x-2 bg-gray-600 hover:bg-gray-700 text-white px-6 py-3 rounded-lg transition-colors"
            >
              <span>Book Another Trip</span>
            </button>
          </div>

          {/* Support Information */}
          <div className="text-center mt-12">
            <p className="text-gray-600 mb-2">Need help with your booking?</p>
            <p className="text-[var(--primary)] font-semibold">support@completetravel.com • +1 (555) 123-4567</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ThankYou;