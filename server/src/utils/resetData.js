const mongoose = require('mongoose');
const Shipment = require('../models/Shipment');
const Alert = require('../models/Alert');
const dotenv = require('dotenv');

dotenv.config({ path: './.env' });

const resetShipments = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/projectv');
        console.log('Connected to MongoDB...');

        // 1. Reset all Shipments
        const shipments = await Shipment.find({});
        console.log(`Resetting ${shipments.length} shipments...`);

        for (const shipment of shipments) {
            // Reset location to origin
            shipment.currentLocation = shipment.origin;

            // Reset status
            shipment.status = 'In Transit';

            await shipment.save();
        }
        console.log('✅ All shipments moved back to origin.');

        // 2. Clear all Alerts
        await Alert.deleteMany({});
        console.log('✅ All alerts cleared.');

        console.log('🚀 Ready to start simulation!');
        process.exit();
    } catch (error) {
        console.error('Error:', error);
        process.exit(1);
    }
};

resetShipments();
