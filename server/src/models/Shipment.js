const mongoose = require('mongoose');

const shipmentSchema = new mongoose.Schema({
    shipmentId: { type: String, required: true, unique: true },
    carrier: { type: String, required: true },
    vesselName: String,
    type: { type: String, enum: ['Air', 'Sea', 'Land'], default: 'Sea' },
    origin: {
        type: { type: String, enum: ['Point'], required: true },
        coordinates: { type: [Number], required: true },
        address: String
    },
    destination: {
        type: { type: String, enum: ['Point'], required: true },
        coordinates: { type: [Number], required: true },
        address: String
    },
    currentLocation: {
        type: { type: String, enum: ['Point'], default: 'Point' },
        coordinates: { type: [Number], default: [0, 0] }
    },
    route: {
        type: { type: String, enum: ['LineString'], required: true },
        coordinates: { type: [[Number]], required: true }
    },
    status: {
        type: String,
        enum: ['Created', 'Pending', 'In Transit', 'Delayed', 'At Port', 'Delivered', 'Exception', 'Stopped'],
        default: 'Created'
    },
    eta: { type: Date },
    speed: { type: Number, default: 0 },
    personnel: {
        captain: String,
        crew: [String]
    },
    manifest: [{
        item: String,
        quantity: Number,
        weight: String,
        value: String
    }],
    region: { type: String, default: 'Global' }
}, {
    timestamps: true
});

shipmentSchema.index({ currentLocation: '2dsphere' });

const Shipment = mongoose.model('Shipment', shipmentSchema);
module.exports = Shipment;
