const Joi = require('joi');

// Validation schemas for different search types
const searchSchemas = {
  flight: Joi.object({
    tripType: Joi.string().valid('roundTrip', 'oneWay').required(),
    origin: Joi.string().min(3).max(3).required(),
    destination: Joi.string().min(3).max(3).required(),
    fromDate: Joi.date().iso().greater('now').required(),
    toDate: Joi.when('tripType', {
      is: 'roundTrip',
      then: Joi.date().iso().greater(Joi.ref('fromDate')).required(),
      otherwise: Joi.optional()
    }),
    adults: Joi.number().min(1).max(9).default(1),
    children: Joi.number().min(0).max(8).default(0),
    travelClass: Joi.string().valid('ECONOMY', 'PREMIUM_ECONOMY', 'BUSINESS', 'FIRST').default('ECONOMY')
  }),

  hotel: Joi.object({
    destination: Joi.string().min(1).required(),
    checkInDate: Joi.date().iso().greater('now').required(),
    checkOutDate: Joi.date().iso().greater(Joi.ref('checkInDate')).required(),
    rooms: Joi.number().min(1).max(10).default(1),
    adults: Joi.number().min(1).max(20).default(1),
    children: Joi.number().min(0).max(10).default(0)
  }),

  car: Joi.object({
    pickupLocation: Joi.string().min(1).required(),
    dropLocation: Joi.string().min(1).required(),
    fromDateTime: Joi.date().iso().greater('now').required(),
    toDateTime: Joi.date().iso().greater(Joi.ref('fromDateTime')).required(),
    age: Joi.number().min(21).max(100).required()
  }),

  cruise: Joi.object({
    destination: Joi.string().min(1).required(),
    cruiseLine: Joi.string().min(1).optional(),
    shipName: Joi.string().min(1).optional(),
    nights: Joi.number().min(1).max(30).required(),
    name: Joi.string().min(1).required(),
    email: Joi.string().email().required(),
    mobile: Joi.string().min(10).max(15).required()
  })
};

// Validation function
const validateSearchParams = (type, data) => {
  const schema = searchSchemas[type];
  if (!schema) {
    return { error: new Error(`Invalid search type: ${type}`) };
  }
  
  return schema.validate(data, { abortEarly: false });
};

// Booking validation schema
const bookingSchema = Joi.object({
  type: Joi.string().valid('flight', 'hotel', 'car', 'cruise').required(),
  details: Joi.object().required(),
  passengers: Joi.array().items(Joi.object({
    firstName: Joi.string().required(),
    lastName: Joi.string().required(),
    dateOfBirth: Joi.date().required(),
    gender: Joi.string().valid('male', 'female', 'other').required(),
    passportNumber: Joi.string().optional(),
    nationality: Joi.string().optional()
  })).min(1).required(),
  contactInfo: Joi.object({
    email: Joi.string().email().required(),
    phone: Joi.string().min(10).max(15).required(),
    address: Joi.object({
      street: Joi.string().required(),
      city: Joi.string().required(),
      state: Joi.string().required(),
      zipCode: Joi.string().required(),
      country: Joi.string().required()
    }).required()
  }).required(),
  promoCode: Joi.string().optional()
});

// Payment validation schema
const paymentSchema = Joi.object({
  bookingId: Joi.string().required(),
  amount: Joi.number().min(0).required(),
  currency: Joi.string().default('USD')
});

module.exports = {
  validateSearchParams,
  bookingSchema,
  paymentSchema
};