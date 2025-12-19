const express = require('express');
const router = express.Router();
const { getAlerts, markAsRead, clearAlerts } = require('../controllers/alertController');
const { protect, authorize } = require('../middleware/authMiddleware');

router.get('/', protect, getAlerts);
router.patch('/:id/read', protect, markAsRead);
router.delete('/', protect, authorize('admin'), clearAlerts);

module.exports = router;
