const mongoose = require('mongoose');

const alertSchema = new mongoose.Schema({
    shipmentId: {
        type: String,
        required: true
    },
    type: {
        type: String,
        enum: ['location_update', 'delay', 'stopped', 'delivered', 'exception'],
        default: 'location_update'
    },
    message: {
        type: String,
        required: true
    },
    severity: {
        type: String,
        enum: ['info', 'warning', 'critical'],
        default: 'info'
    },
    location: {
        type: {
            type: String,
            enum: ['Point']
        },
        coordinates: [Number]
    },
    metadata: {
        type: mongoose.Schema.Types.Mixed
    },
    read: {
        type: Boolean,
        default: false
    }
}, {
    timestamps: true
});

alertSchema.index({ createdAt: -1 });
alertSchema.index({ shipmentId: 1 });

const Alert = mongoose.model('Alert', alertSchema);
module.exports = Alert;
