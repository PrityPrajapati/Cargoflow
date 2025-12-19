const express = require('express');
const router = express.Router();
const { createShipment, getShipments, getShipmentById, ingestGPS, updateLocation } = require('../controllers/shipmentController');
const { protect, authorize } = require('../middleware/authMiddleware');

// Webhook typically strictly secured, for now public or basic auth
router.post('/webhook/gps', ingestGPS);

// Debug stats endpoint (must be before /:id route)
router.get('/stats', require('../controllers/statsController').getStats);

// Specific ID routes
router.route('/:id')
    .get(protect, getShipmentById)
    .patch(protect, authorize('admin', 'operations_executive'), updateLocation);

// General routes
router.route('/')
    .get(protect, getShipments)
    .post(protect, authorize('admin', 'operations_executive'), createShipment);

module.exports = router;
