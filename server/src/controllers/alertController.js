const Alert = require('../models/Alert');

// @desc    Get all alerts
// @route   GET /api/alerts
// @access  Private
exports.getAlerts = async (req, res) => {
    try {
        const limit = parseInt(req.query.limit) || 100;
        const alerts = await Alert.find()
            .sort({ createdAt: -1 })
            .limit(limit);
        res.json(alerts);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Mark alert as read
// @route   PATCH /api/alerts/:id/read
// @access  Private
exports.markAsRead = async (req, res) => {
    try {
        const alert = await Alert.findByIdAndUpdate(
            req.params.id,
            { read: true },
            { new: true }
        );
        res.json(alert);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Clear all alerts
// @route   DELETE /api/alerts
// @access  Private (Admin)
exports.clearAlerts = async (req, res) => {
    try {
        await Alert.deleteMany({});
        res.json({ message: 'All alerts cleared' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
