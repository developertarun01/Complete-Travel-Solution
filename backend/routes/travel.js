const express = require('express');
const router = express.Router();
const travelController = require('../controllers/travelController');

// Flight search route
router.post('/flights', travelController.searchFlights);

// Hotel search route
router.post('/hotels', travelController.searchHotels);

// Car search route
router.post('/cars', travelController.searchCars);

// Cruise search route
router.post('/cruises', travelController.searchCruises);

module.exports = router;