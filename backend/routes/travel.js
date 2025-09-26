const express = require('express');
const router = express.Router();
const travelController = require('../controllers/travelController');
const amadeusService = require('../services/amadeusService')

// Flight search route
router.post('/flights', travelController.searchFlights);

// Hotel search route
router.post('/hotels', travelController.searchHotels);

// Car search route
router.post('/cars', travelController.searchCars);

// Cruise search route
router.post('/cruises', travelController.searchCruises);

// Airport and city search endpoint
router.get('/airports', async (req, res) => {
    try {
        const { q } = req.query;

        if (!q || q.length < 2) {
            return res.status(400).json({
                success: false,
                message: 'Search query must be at least 2 characters long'
            });
        }

        console.log('🔍 Airport search request for:', q);

        const results = await amadeusService.searchAirports(q);

        res.json({
            success: true,
            data: results,
            message: 'Airport search completed successfully'
        });
    } catch (error) {
        console.error('Airport search route error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to search airports',
            error: error.message
        });
    }
});

module.exports = router;