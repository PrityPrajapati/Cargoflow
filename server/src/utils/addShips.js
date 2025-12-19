const mongoose = require('mongoose');
const Shipment = require('../models/Shipment');
const dotenv = require('dotenv');

dotenv.config({ path: './.env' });

const addShips = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/projectv');
        console.log('Connected to MongoDB...');

        // Find 10 random shipments to convert to Sea
        // We'll reset all to Air first to be clean, then pick 10 for Sea
        await Shipment.updateMany({}, { type: 'Air' });

        const shipments = await Shipment.aggregate([{ $sample: { size: 10 } }]);
        const ids = shipments.map(s => s._id);

        await Shipment.updateMany(
            { _id: { $in: ids } },
            { $set: { type: 'Sea' } }
        );

        console.log(`✅ Successfully converted ${ids.length} shipments to 'Sea' type.`);
        console.log('Run the simulation to see them moving!');
        process.exit();
    } catch (error) {
        console.error('Error:', error);
        process.exit(1);
    }
};

addShips();
