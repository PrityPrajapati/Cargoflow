const Shipment = require('../models/Shipment');

// @desc    Get shipment statistics
// @route   GET /api/shipments/stats
// @access  Public (for debugging)
exports.getStats = async (req, res) => {
    try {
        const total = await Shipment.countDocuments();
        const byStatus = await Shipment.aggregate([
            { $group: { _id: '$status', count: { $sum: 1 } } }
        ]);

        res.json({
            total,
            byStatus,
            message: 'Database is working!'
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
