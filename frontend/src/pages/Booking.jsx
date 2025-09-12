import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import PassengerDetails from '../components/booking/PassengerDetails';
import BookingSummary from '../components/booking/BookingSummary';
import { createBooking, validatePromoCode } from '../services/api';
import { User, CreditCard, ArrowLeft } from 'lucide-react';

const Booking = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { type, selectedItem, searchParams, formData } = location.state || {};
  
  const [currentStep, setCurrentStep] = useState(1);
  const [booking, setBooking] = useState(null);
  const [passengers, setPassengers] = useState([{
    firstName: '',
    lastName: '',
    dateOfBirth: '',
    gender: '',
    passportNumber: '',
    nationality: ''
  }]);
  const [contactInfo, setContactInfo] = useState({
    email: '',
    phone: '',
    address: {
      street: '',
      city: '',
      state: '',
      zipCode: '',
      country: ''
    }
  });
  const [promoCode, setPromoCode] = useState('');
  const [discount, setDiscount] = useState(0);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!type || !selectedItem) {
      navigate('/');
      return;
    }

    // Calculate base price based on selected item
    const basePrice = parseFloat(selectedItem.price?.total || selectedItem.price || 0);
    
    // Create initial booking object
    setBooking({
      type,
      details: {
        ...selectedItem,
        ...searchParams,
        ...formData
      },
      passengers: [],
      contactInfo: {},
      pricing: {
        basePrice,
        discount: 0,
        finalPrice: basePrice,
        currency: 'USD'
      },
      promoCode: '',
      status: 'pending'
    });
  }, [type, selectedItem, searchParams, formData, navigate]);

  const handlePassengerChange = (field, value) => {
    if (field === 'passengers') {
      setPassengers(value);
    } else if (field === 'contactInfo') {
      setContactInfo(value);
    }
  };

  const handlePromoCodeApply = async () => {
    if (!promoCode.trim()) return;

    try {
      setLoading(true);
      const response = await validatePromoCode({
        code: promoCode,
        amount: booking.pricing.basePrice
      });

      if (response.success) {
        setDiscount(response.data.discount);
        setBooking(prev => ({
          ...prev,
          pricing: {
            ...prev.pricing,
            discount: response.data.discount,
            finalPrice: prev.pricing.basePrice - response.data.discount
          },
          promoCode: promoCode
        }));
        alert('Promo code applied successfully!');
      } else {
        alert('Invalid promo code');
      }
    } catch (error) {
      alert('Error applying promo code: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleProceedToPayment = async () => {
    try {
      setLoading(true);
      
      // Create the booking
      const bookingData = {
        type: booking.type,
        details: booking.details,
        passengers,
        contactInfo,
        promoCode: booking.promoCode
      };

      const response = await createBooking(bookingData);
      
      if (response.success) {
        navigate('/payment', {
          state: {
            booking: response.data
          }
        });
      } else {
        alert('Error creating booking: ' + response.message);
      }
    } catch (error) {
      alert('Error creating booking: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  if (!booking) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Progress Steps */}
      <div className="flex justify-center mb-8">
        <div className="flex items-center space-x-8">
          <div className={`flex items-center ${currentStep >= 1 ? 'text-blue-600' : 'text-gray-400'}`}>
            <div className={`w-8 h-8 rounded-full flex items-center justify-center border-2 ${
              currentStep >= 1 ? 'bg-blue-600 border-blue-600 text-white' : 'border-gray-300'
            }`}>
              1
            </div>
            <span className="ml-2 font-medium">Passenger Details</span>
          </div>

          <div className="w-16 h-0.5 bg-gray-300"></div>

          <div className={`flex items-center ${currentStep >= 2 ? 'text-blue-600' : 'text-gray-400'}`}>
            <div className={`w-8 h-8 rounded-full flex items-center justify-center border-2 ${
              currentStep >= 2 ? 'bg-blue-600 border-blue-600 text-white' : 'border-gray-300'
            }`}>
              2
            </div>
            <span className="ml-2 font-medium">Booking Summary</span>
          </div>

          <div className="w-16 h-0.5 bg-gray-300"></div>

          <div className={`flex items-center ${currentStep >= 3 ? 'text-blue-600' : 'text-gray-400'}`}>
            <div className={`w-8 h-8 rounded-full flex items-center justify-center border-2 ${
              currentStep >= 3 ? 'bg-blue-600 border-blue-600 text-white' : 'border-gray-300'
            }`}>
              3
            </div>
            <span className="ml-2 font-medium">Payment</span>
          </div>
        </div>
      </div>

      {/* Back Button */}
      <button
        onClick={() => currentStep > 1 ? setCurrentStep(currentStep - 1) : navigate(-1)}
        className="flex items-center text-blue-600 hover:text-blue-700 mb-6"
      >
        <ArrowLeft className="h-4 w-4 mr-1" />
        Back
      </button>

      {/* Step 1: Passenger Details */}
      {currentStep === 1 && (
        <PassengerDetails
          passengers={passengers}
          contactInfo={contactInfo}
          onChange={handlePassengerChange}
          onNext={() => setCurrentStep(2)}
        />
      )}

      {/* Step 2: Booking Summary */}
      {currentStep === 2 && (
        <div className="space-y-6">
          {/* Promo Code Section */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-lg font-semibold mb-4">Apply Promo Code</h3>
            <div className="flex space-x-2">
              <input
                type="text"
                placeholder="Enter promo code"
                value={promoCode}
                onChange={(e) => setPromoCode(e.target.value.toUpperCase())}
                className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <button
                onClick={handlePromoCodeApply}
                disabled={loading || !promoCode.trim()}
                className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-md disabled:bg-gray-300 disabled:cursor-not-allowed"
              >
                {loading ? 'Applying...' : 'Apply'}
              </button>
            </div>
            {discount > 0 && (
              <p className="text-green-600 mt-2">
                Discount applied: ${discount.toFixed(2)}
              </p>
            )}
          </div>

          <BookingSummary
            booking={{
              ...booking,
              passengers,
              contactInfo
            }}
            onProceedToPayment={handleProceedToPayment}
          />
        </div>
      )}

      {/* Loading Overlay */}
      {loading && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg flex flex-col items-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mb-4"></div>
            <p className="text-gray-700">
              {currentStep === 2 ? 'Processing your booking...' : 'Loading...'}
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default Booking;