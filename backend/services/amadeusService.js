const { amadeus, extractAmadeusError } = require('../config/amadeus');

class AmadeusService {
  // Check if Amadeus API is properly configured and working
  // Check if Amadeus API is properly configured and working
  async isAmadeusAvailable() {
    try {
      // ✅ Call checkinLinks with a sample airline code (BA = British Airways)
      await amadeus.referenceData.urls.checkinLinks.get({
        airlineCode: 'BA'
      });

      console.log('Amadeus API is available');
      return true;
    } catch (error) {
      const errorMessage = extractAmadeusError(error);
      console.log('Amadeus API not available:', errorMessage);

      // If the error is just about airlineCode (bad input), we still treat API as "available"
      if (errorMessage.includes('MANDATORY DATA MISSING') || errorMessage.includes('airlineCode')) {
        console.log('Amadeus API responded, so connectivity is fine (parameter issue, not connectivity)');
        return true;
      }

      return false;
    }
  }


  // Flight search
  async searchFlights(params) {
    try {
      const isAvailable = await this.isAmadeusAvailable();
      if (!isAvailable) {
        console.log('Using mock data for flight search');
        return this.getMockFlightData(params);
      }

      const requestParams = {
        originLocationCode: params.origin,
        destinationLocationCode: params.destination,
        departureDate: params.fromDate,
        adults: params.adults || 1,
        children: params.children || 0,
        travelClass: params.travelClass || 'ECONOMY',
        max: 20
      };

      // Add return date for round trips
      if (params.tripType === 'roundTrip' && params.toDate) {
        requestParams.returnDate = params.toDate;
      }

      console.log('Searching flights with Amadeus API:', requestParams);

      const response = await amadeus.shopping.flightOffersSearch.get(requestParams);

      // Format the response for easier consumption
      return this.formatFlightResponse(response.data);
    } catch (error) {
      const errorMessage = extractAmadeusError(error);
      console.error('Amadeus Flight Search Error:', errorMessage);

      // Fallback to mock data
      console.log('Falling back to mock flight data');
      return this.getMockFlightData(params);
    }
  }

  // Hotel search
  async searchHotels(params) {
    try {
      const isAvailable = await this.isAmadeusAvailable();
      if (!isAvailable) {
        console.log('Using mock data for hotel search');
        return this.getMockHotelData(params);
      }

      const response = await amadeus.shopping.hotelOffers.get({
        cityCode: params.destination,
        checkInDate: params.checkInDate,
        checkOutDate: params.checkOutDate,
        roomQuantity: params.rooms || 1,
        adults: params.adults || 1,
        radius: 50,
        radiusUnit: 'KM',
        bestRateOnly: true,
        includeClosed: false,
        view: 'FULL',
        sort: 'NONE'
      });

      return this.formatHotelResponse(response.data);
    } catch (error) {
      const errorMessage = extractAmadeusError(error);
      console.error('Amadeus Hotel Search Error:', errorMessage);

      // Fallback to mock data
      console.log('Falling back to mock hotel data');
      return this.getMockHotelData(params);
    }
  }

  // Car search (mock - Amadeus doesn't have car rental in this package)
  async searchCars(params) {
    console.log('Using mock car data (Amadeus car API not available in this package)');
    return this.getMockCarData(params);
  }

  // Cruise search (mock - Amadeus doesn't have cruise API)
  async searchCruises(params) {
    console.log('Using mock cruise data (Amadeus cruise API not available)');
    return this.getMockCruiseData(params);
  }

  // Format flight response
  formatFlightResponse(data) {
    if (!data || !Array.isArray(data)) {
      console.log('No flight data received from Amadeus');
      return [];
    }

    console.log(`Received ${data.length} flight offers from Amadeus`);

    return data.map(offer => {
      const itineraries = offer.itineraries || [];
      const firstSegment = itineraries[0]?.segments?.[0] || {};
      const lastSegment = itineraries[0]?.segments?.[itineraries[0]?.segments?.length - 1] || {};
      const price = offer.price || {};

      return {
        id: offer.id,
        airline: firstSegment.carrierCode || 'Unknown',
        flightNumber: `${firstSegment.carrierCode}${firstSegment.number}`,
        departure: {
          airport: firstSegment.departure?.iataCode,
          time: firstSegment.departure?.at,
          terminal: firstSegment.departure?.terminal
        },
        arrival: {
          airport: lastSegment.arrival?.iataCode,
          time: lastSegment.arrival?.at,
          terminal: lastSegment.arrival?.terminal
        },
        duration: itineraries[0]?.duration,
        stops: (itineraries[0]?.segments?.length || 1) - 1,
        price: {
          total: price.total || '0',
          currency: price.currency || 'USD'
        },
        class: offer.class?.[0] || 'ECONOMY',
        source: 'amadeus' // Mark as real data
      };
    });
  }

  // Format hotel response
  formatHotelResponse(data) {
    if (!data || !Array.isArray(data)) {
      console.log('No hotel data received from Amadeus');
      return [];
    }

    console.log(`Received ${data.length} hotel offers from Amadeus`);

    return data.map(hotel => {
      const offer = hotel.offers?.[0] || {};
      const price = offer.price || {};
      const hotelInfo = hotel.hotel || {};

      return {
        id: hotelInfo.hotelId,
        name: hotelInfo.name,
        rating: hotelInfo.rating || 0,
        address: {
          line1: hotelInfo.address?.lines?.[0],
          city: hotelInfo.address?.cityName,
          country: hotelInfo.address?.countryCode
        },
        coordinates: {
          latitude: hotelInfo.geoCode?.latitude,
          longitude: hotelInfo.geoCode?.longitude
        },
        price: {
          total: price.total,
          currency: price.currency,
          base: price.base
        },
        checkIn: offer.checkInDate,
        checkOut: offer.checkOutDate,
        roomType: offer.room?.typeEstimated?.category || 'Standard',
        description: offer.room?.description?.text,
        source: 'amadeus' // Mark as real data
      };
    });
  }

  // Mock flight data for development
  getMockFlightData(params) {
    const basePrice = 300 + Math.floor(Math.random() * 400);
    const returnPrice = params.tripType === 'roundTrip' ? basePrice + 100 : 0;

    const results = [
      {
        id: 'mock-1',
        airline: 'AA',
        flightNumber: 'AA123',
        departure: {
          airport: params.origin,
          time: `${params.fromDate}T08:00:00`,
          terminal: '1'
        },
        arrival: {
          airport: params.destination,
          time: `${params.fromDate}T11:30:00`,
          terminal: '2'
        },
        duration: 'PT3H30M',
        stops: 0,
        price: {
          total: basePrice.toFixed(2),
          currency: 'USD'
        },
        class: params.travelClass || 'ECONOMY',
        source: 'mock',
        return: params.tripType === 'roundTrip' ? {
          departure: {
            airport: params.destination,
            time: `${params.toDate}T14:00:00`,
            terminal: '2'
          },
          arrival: {
            airport: params.origin,
            time: `${params.toDate}T17:30:00`,
            terminal: '1'
          },
          duration: 'PT3H30M',
          stops: 0,
          price: {
            total: returnPrice.toFixed(2),
            currency: 'USD'
          }
        } : null
      },
      {
        id: 'mock-2',
        airline: 'DL',
        flightNumber: 'DL456',
        departure: {
          airport: params.origin,
          time: `${params.fromDate}T14:00:00`,
          terminal: '3'
        },
        arrival: {
          airport: params.destination,
          time: `${params.fromDate}T18:45:00`,
          terminal: '1'
        },
        duration: 'PT4H45M',
        stops: 1,
        price: {
          total: (basePrice - 40).toFixed(2),
          currency: 'USD'
        },
        class: params.travelClass || 'ECONOMY',
        source: 'mock',
        return: params.tripType === 'roundTrip' ? {
          departure: {
            airport: params.destination,
            time: `${params.toDate}T09:00:00`,
            terminal: '1'
          },
          arrival: {
            airport: params.origin,
            time: `${params.toDate}T12:15:00`,
            terminal: '3'
          },
          duration: 'PT3H15M',
          stops: 0,
          price: {
            total: (returnPrice - 40).toFixed(2),
            currency: 'USD'
          }
        } : null
      }
    ];

    console.log(`Generated ${results.length} mock flight offers`);
    return results;
  }

  // Mock hotel data for development
  getMockHotelData(params) {
    const nights = Math.ceil((new Date(params.checkOutDate) - new Date(params.checkInDate)) / (1000 * 60 * 60 * 24));
    const basePrice = 100 + Math.floor(Math.random() * 200);

    const results = [
      {
        id: 'mock-1',
        name: 'Luxury Hotel',
        rating: 4.5,
        address: {
          line1: '123 Main Street',
          city: params.destination,
          country: 'US'
        },
        coordinates: {
          latitude: 40.7128,
          longitude: -74.0060
        },
        price: {
          total: (basePrice * nights).toFixed(2),
          currency: 'USD',
          base: (basePrice * nights).toFixed(2)
        },
        checkIn: params.checkInDate,
        checkOut: params.checkOutDate,
        roomType: 'Deluxe King',
        description: 'Spacious room with king bed and city view',
        amenities: ['Free WiFi', 'Swimming Pool', 'Fitness Center', 'Restaurant'],
        source: 'mock'
      },
      {
        id: 'mock-2',
        name: 'Budget Inn',
        rating: 3.2,
        address: {
          line1: '456 Side Street',
          city: params.destination,
          country: 'US'
        },
        coordinates: {
          latitude: 40.7138,
          longitude: -74.0070
        },
        price: {
          total: (basePrice * 0.6 * nights).toFixed(2),
          currency: 'USD',
          base: (basePrice * 0.6 * nights).toFixed(2)
        },
        checkIn: params.checkInDate,
        checkOut: params.checkOutDate,
        roomType: 'Standard Queen',
        description: 'Comfortable room with queen bed',
        amenities: ['Free WiFi', 'Parking', 'Breakfast Included'],
        source: 'mock'
      }
    ];

    console.log(`Generated ${results.length} mock hotel offers`);
    return results;
  }

  // Mock car data for development
  getMockCarData(params) {
    const days = Math.ceil((new Date(params.toDateTime) - new Date(params.fromDateTime)) / (1000 * 60 * 60 * 24));
    const basePrice = 30 + Math.floor(Math.random() * 70);

    const results = [
      {
        id: 'mock-1',
        provider: 'Hertz',
        carType: 'Economy',
        model: 'Toyota Corolla',
        price: (basePrice * days).toFixed(2),
        duration: `${days} days`,
        image: '/images/car-1.jpg',
        features: ['5 Seats', 'Automatic', 'Air Conditioning'],
        pickupLocation: params.pickupLocation,
        dropLocation: params.dropLocation || params.pickupLocation,
        fromDateTime: params.fromDateTime,
        toDateTime: params.toDateTime,
        source: 'mock'
      },
      {
        id: 'mock-2',
        provider: 'Avis',
        carType: 'SUV',
        model: 'Honda CR-V',
        price: (basePrice * 1.5 * days).toFixed(2),
        duration: `${days} days`,
        image: '/images/car-2.jpg',
        features: ['5 Seats', 'Automatic', 'Air Conditioning', 'GPS'],
        pickupLocation: params.pickupLocation,
        dropLocation: params.dropLocation || params.pickupLocation,
        fromDateTime: params.fromDateTime,
        toDateTime: params.toDateTime,
        source: 'mock'
      }
    ];

    console.log(`Generated ${results.length} mock car offers`);
    return results;
  }

  // Mock cruise data for development
  getMockCruiseData(params) {
    const basePrice = 500 + Math.floor(Math.random() * 1000);

    const results = [
      {
        id: 'mock-1',
        cruiseLine: 'Royal Caribbean',
        shipName: 'Symphony of the Seas',
        destination: params.destination || 'Caribbean',
        nights: params.nights || 7,
        price: (basePrice * (params.nights || 7)).toFixed(2),
        departureDate: params.fromDate || '2023-12-15',
        image: '/images/cruise-1.jpg',
        itinerary: ['Miami', 'Nassau', 'St. Thomas', 'St. Maarten'],
        amenities: ['All Meals Included', 'Swimming Pools', 'Entertainment', 'Fitness Center'],
        source: 'mock'
      },
      {
        id: 'mock-2',
        cruiseLine: 'Norwegian',
        shipName: 'Norwegian Escape',
        destination: params.destination || 'Bahamas',
        nights: params.nights || 4,
        price: (basePrice * 0.8 * (params.nights || 4)).toFixed(2),
        departureDate: params.fromDate || '2023-12-20',
        image: '/images/cruise-2.jpg',
        itinerary: ['Orlando', 'Great Stirrup Cay', 'Nassau'],
        amenities: ['All Meals Included', 'Casino', 'Spa', 'Multiple Restaurants'],
        source: 'mock'
      }
    ];

    console.log(`Generated ${results.length} mock cruise offers`);
    return results;
  }
}

module.exports = new AmadeusService();