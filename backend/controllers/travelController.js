const amadeusService = require('../services/amadeusService');
const { validateSearchParams } = require('../middleware/validation');

// Search flights
exports.searchFlights = async (req, res, next) => {
  try {
    // Validate request parameters
    const validation = validateSearchParams('flight', req.body);
    if (validation.error) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: validation.error.details
      });
    }

    const flightData = await amadeusService.searchFlights(req.body);
    
    res.json({
      success: true,
      data: flightData,
      message: 'Flights fetched successfully'
    });
  } catch (error) {
    next(error);
  }
};

// Search hotels
exports.searchHotels = async (req, res, next) => {
  try {
    // Validate request parameters
    const validation = validateSearchParams('hotel', req.body);
    if (validation.error) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: validation.error.details
      });
    }

    const hotelData = await amadeusService.searchHotels(req.body);
    
    res.json({
      success: true,
      data: hotelData,
      message: 'Hotels fetched successfully'
    });
  } catch (error) {
    next(error);
  }
};

// Search cars
exports.searchCars = async (req, res, next) => {
  try {
    // Validate request parameters
    const validation = validateSearchParams('car', req.body);
    if (validation.error) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: validation.error.details
      });
    }

    // For demo purposes - in real implementation, integrate with car rental API
    const mockCarData = [
      {
        id: 1,
        provider: 'Hertz',
        carType: 'Economy',
        model: 'Toyota Corolla',
        price: 45.99,
        duration: '3 days',
        image: '/images/car-1.jpg',
        features: ['5 Seats', 'Automatic', 'Air Conditioning']
      },
      {
        id: 2,
        provider: 'Avis',
        carType: 'SUV',
        model: 'Honda CR-V',
        price: 69.99,
        duration: '3 days',
        image: '/images/car-2.jpg',
        features: ['5 Seats', 'Automatic', 'Air Conditioning', 'GPS']
      }
    ];
    
    res.json({
      success: true,
      data: mockCarData,
      message: 'Cars fetched successfully'
    });
  } catch (error) {
    next(error);
  }
};

// Search cruises
exports.searchCruises = async (req, res, next) => {
  try {
    // Validate request parameters
    const validation = validateSearchParams('cruise', req.body);
    if (validation.error) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: validation.error.details
      });
    }

    // For demo purposes - in real implementation, integrate with cruise API
    const mockCruiseData = [
      {
        id: 1,
        cruiseLine: 'Royal Caribbean',
        shipName: 'Symphony of the Seas',
        destination: 'Caribbean',
        nights: 7,
        price: 899.99,
        departureDate: '2023-12-15',
        image: '/images/cruise-1.jpg',
        itinerary: ['Miami', 'Nassau', 'St. Thomas', 'St. Maarten']
      },
      {
        id: 2,
        cruiseLine: 'Norwegian',
        shipName: 'Norwegian Escape',
        destination: 'Bahamas',
        nights: 4,
        price: 549.99,
        departureDate: '2023-12-20',
        image: '/images/cruise-2.jpg',
        itinerary: ['Orlando', 'Great Stirrup Cay', 'Nassau']
      }
    ];
    
    res.json({
      success: true,
      data: mockCruiseData,
      message: 'Cruises fetched successfully'
    });
  } catch (error) {
    next(error);
  }
};