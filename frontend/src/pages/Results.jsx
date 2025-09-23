import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { searchFlights, searchHotels, searchCars, searchCruises } from '../services/api';
import { Filter, Plane, Hotel, Car, Ship, Clock, MapPin, Users, Star } from 'lucide-react';

const Results = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { searchType, formData, searchParams } = location.state || {};
  
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState({
    sortBy: 'price',
    minPrice: 0,
    maxPrice: 10000,
    airlines: [],
    stops: 'any',
    rating: 0
  });

  useEffect(() => {
    const fetchResults = async () => {
      if (!searchType || !formData) {
        navigate('/');
        return;
      }

      try {
        setLoading(true);
        setError(null);
        let data;

        switch (searchType) {
          case 'flights':
            data = await searchFlights(formData);
            break;
          case 'hotels':
            data = await searchHotels(formData);
            break;
          case 'cars':
            data = await searchCars(formData);
            break;
          case 'cruises':
            data = await searchCruises(formData);
            break;
          default:
            data = [];
        }

        // Ensure data is always an array
        if (data && Array.isArray(data)) {
          setResults(data);
        } else if (data && data.data && Array.isArray(data.data)) {
          // Handle case where response has data property
          setResults(data.data);
        } else if (data && data.success && Array.isArray(data.data)) {
          // Handle success response format
          setResults(data.data);
        } else {
          console.warn('Unexpected API response format:', data);
          setResults([]);
        }
      } catch (error) {
        console.error('Error fetching results:', error);
        setError(error.message || 'Failed to fetch results');
        setResults([]);
      } finally {
        setLoading(false);
      }
    };

    fetchResults();
  }, [searchType, formData, navigate]);

  const handleSelect = (item) => {
    navigate('/booking', {
      state: {
        type: searchType,
        selectedItem: item,
        searchParams,
        formData
      }
    });
  };

  const renderFlightCard = (flight, index) => (
    <div key={flight.id || index} className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="text-xl font-semibold">{flight.airline} {flight.flightNumber}</h3>
          <p className="text-gray-600">{flight.class}</p>
        </div>
        <div className="text-right">
          <p className="text-2xl font-bold text-[var(--primary)]">${flight.price?.total || flight.price || '299'}</p>
          <p className="text-sm text-gray-600">per person</p>
        </div>
      </div>

      <div className="flex items-center justify-between mb-4">
        <div className="text-center">
          <p className="text-lg font-semibold">
            {flight.departure?.time ? flight.departure.time.split('T')[1].substring(0, 5) : '08:00'}
          </p>
          <p className="text-sm text-gray-600">{flight.departure?.airport || formData?.origin}</p>
        </div>
        
        <div className="flex-1 mx-4">
          <div className="flex items-center">
            <div className="flex-1 border-t-2 border-gray-300"></div>
            <Plane className="h-4 w-4 mx-2 text-gray-400 transform rotate-90" />
            <div className="flex-1 border-t-2 border-gray-300"></div>
          </div>
          <p className="text-xs text-center text-gray-500 mt-1">{flight.duration || '3h 30m'}</p>
          <p className="text-xs text-center text-gray-500">{flight.stops || 0} stop{flight.stops !== 1 ? 's' : ''}</p>
        </div>

        <div className="text-center">
          <p className="text-lg font-semibold">
            {flight.arrival?.time ? flight.arrival.time.split('T')[1].substring(0, 5) : '11:30'}
          </p>
          <p className="text-sm text-gray-600">{flight.arrival?.airport || formData?.destination}</p>
        </div>
      </div>

      <button
        onClick={() => handleSelect(flight)}
        className="w-full bg-[var(--accent-dark)] hover:bg-[var(--accent)] text-white py-2 px-4 rounded-lg transition-colors"
      >
        Select Flight
      </button>
    </div>
  );

  const renderHotelCard = (hotel, index) => (
    <div key={hotel.id || index} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
      <div className="h-48 bg-gray-200 flex items-center justify-center">
        <Hotel className="h-12 w-12 text-gray-400" />
      </div>
      <div className="p-6">
        <div className="flex justify-between items-start mb-3">
          <h3 className="text-xl font-semibold">{hotel.name || 'Luxury Hotel'}</h3>
          <div className="flex items-center">
            <Star className="h-4 w-4 text-yellow-400 fill-current" />
            <span className="ml-1">{hotel.rating || 4.5}</span>
          </div>
        </div>

        <div className="flex items-center text-gray-600 mb-3">
          <MapPin className="h-4 w-4 mr-1" />
          <span className="text-sm">
            {hotel.address?.city || searchParams?.destination}, {hotel.address?.country || 'US'}
          </span>
        </div>

        <div className="flex items-center text-gray-600 mb-4">
          <Users className="h-4 w-4 mr-1" />
          <span className="text-sm">2 Guests • 1 Room</span>
        </div>

        <div className="flex justify-between items-center mb-4">
          <div>
            <p className="text-2xl font-bold text-[var(--primary)]">${hotel.price?.total || hotel.price || '199'}</p>
            <p className="text-sm text-gray-600">for {searchParams?.nights || 1} night(s)</p>
          </div>
        </div>

        <button
          onClick={() => handleSelect(hotel)}
          className="w-full bg-[var(--accent-dark)] hover:bg-[var(--accent)] text-white py-2 px-4 rounded-lg transition-colors"
        >
          Select Hotel
        </button>
      </div>
    </div>
  );

  const renderCarCard = (car, index) => (
    <div key={car.id || index} className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
      <div className="flex items-center mb-4">
        <Car className="h-12 w-12 text-[var(--primary)] mr-4" />
        <div>
          <h3 className="text-xl font-semibold">{car.carType || 'Economy Car'}</h3>
          <p className="text-gray-600">{car.model || 'Standard Model'}</p>
        </div>
      </div>

      <div className="space-y-2 mb-4">
        <div className="flex justify-between">
          <span className="text-gray-600">Provider:</span>
          <span className="font-semibold">{car.provider || 'Hertz'}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-600">Pickup:</span>
          <span>{car.pickupLocation || searchParams?.pickupLocation}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-600">Duration:</span>
          <span>{car.duration || '3 days'}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-600">Features:</span>
          <span className="text-sm">{(car.features || ['Automatic', 'Air Conditioning']).join(', ')}</span>
        </div>
      </div>

      <div className="flex justify-between items-center mb-4">
        <div>
          <p className="text-2xl font-bold text-[var(--primary)]">${car.price || '45'}</p>
          <p className="text-sm text-gray-600">total price</p>
        </div>
      </div>

      <button
        onClick={() => handleSelect(car)}
        className="w-full bg-[var(--accent-dark)] hover:bg-[var(--accent)] text-white py-2 px-4 rounded-lg transition-colors"
      >
        Rent Car
      </button>
    </div>
  );

  const renderCruiseCard = (cruise, index) => (
    <div key={cruise.id || index} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
      <div className="h-48 bg-gray-200 flex items-center justify-center">
        <Ship className="h-12 w-12 text-gray-400" />
      </div>
      <div className="p-6">
        <h3 className="text-xl font-semibold mb-2">{cruise.cruiseLine || 'Royal Caribbean'}</h3>
        <p className="text-gray-600 mb-3">{cruise.shipName || 'Premium Cruise Ship'}</p>

        <div className="space-y-2 mb-4">
          <div className="flex justify-between">
            <span className="text-gray-600">Destination:</span>
            <span className="font-semibold">{cruise.destination || searchParams?.destination}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Duration:</span>
            <span>{cruise.nights || 7} nights</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Departure:</span>
            <span>{new Date(cruise.departureDate || new Date().toISOString()).toLocaleDateString()}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Itinerary:</span>
            <span className="text-sm">{(cruise.itinerary || ['Port 1', 'Port 2']).join(' → ')}</span>
          </div>
        </div>

        <div className="flex justify-between items-center mb-4">
          <div>
            <p className="text-2xl font-bold text-[var(--primary)]">${cruise.price || '899'}</p>
            <p className="text-sm text-gray-600">per person</p>
          </div>
        </div>

        <button
          onClick={() => handleSelect(cruise)}
          className="w-full bg-[var(--accent-dark)] hover:bg-[var(--accent)] text-white py-2 px-4 rounded-lg transition-colors"
        >
          Book Cruise
        </button>
      </div>
    </div>
  );

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[var(--primary)]"></div>
          <span className="ml-4 text-gray-600">Searching for the best deals...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center py-12">
          <div className="bg-red-100 rounded-lg p-8 max-w-md mx-auto">
            <Clock className="h-12 w-12 mx-auto text-red-400 mb-4" />
            <h3 className="text-xl font-semibold mb-2 text-red-800">Search Error</h3>
            <p className="text-red-600 mb-4">{error}</p>
            <button
              onClick={() => navigate('/')}
              className="bg-[var(--accent-dark)] hover:bg-[var(--accent)] text-white px-6 py-2 rounded-lg"
            >
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (!searchType) {
    navigate('/');
    return null;
  }

  // Ensure results is always an array before mapping
  const displayResults = Array.isArray(results) ? results : [];

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h2 className="text-3xl font-bold text-gray-800">
            {searchType.charAt(0).toUpperCase() + searchType.slice(1)} Search Results
          </h2>
          <p className="text-gray-600 mt-2">
            {searchType === 'flights' && `Flights from ${searchParams?.origin} to ${searchParams?.destination}`}
            {searchType === 'hotels' && `Hotels in ${searchParams?.destination}`}
            {searchType === 'cars' && `Car rentals in ${searchParams?.pickupLocation}`}
            {searchType === 'cruises' && `Cruises to ${searchParams?.destination}`}
          </p>
        </div>
        
        <button className="flex items-center space-x-2 bg-white border border-gray-300 px-4 py-2 rounded-lg hover:bg-gray-50">
          <Filter className="h-4 w-4" />
          <span>Filters</span>
        </button>
      </div>

      {displayResults.length === 0 ? (
        <div className="text-center py-12">
          <div className="bg-gray-100 rounded-lg p-8 max-w-md mx-auto">
            <Clock className="h-12 w-12 mx-auto text-gray-400 mb-4" />
            <h3 className="text-xl font-semibold mb-2">No results found</h3>
            <p className="text-gray-600 mb-4">
              {searchType === 'flights' 
                ? 'No flights found for your search criteria. Try different dates or airports.'
                : `No ${searchType} found for your search criteria. Try different options.`
              }
            </p>
            <button
              onClick={() => navigate('/')}
              className="bg-[var(--accent-dark)] hover:bg-[var(--accent)] text-white px-6 py-2 rounded-lg"
            >
              New Search
            </button>
          </div>
        </div>
      ) : (
        <>
          <p className="text-gray-600 mb-6">
            Found {displayResults.length} {displayResults.length === 1 ? 'result' : 'results'}
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {displayResults.map((item, index) => {
              switch (searchType) {
                case 'flights':
                  return renderFlightCard(item, index);
                case 'hotels':
                  return renderHotelCard(item, index);
                case 'cars':
                  return renderCarCard(item, index);
                case 'cruises':
                  return renderCruiseCard(item, index);
                default:
                  return null;
              }
            })}
          </div>
        </>
      )}
    </div>
  );
};

export default Results;