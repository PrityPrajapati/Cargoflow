const axios = require('axios');
const mongoose = require('mongoose');
const Shipment = require('../models/Shipment');
const dotenv = require('dotenv');

dotenv.config({ path: './.env' });

// We need DB access just to get the initial routes/state efficiently for the simulation context
// Or we could fetch from API. Let's use DB to load state, then push to Webhook.

const SERVER_URL = 'https://cargoflow-858j.onrender.com/api/shipments/webhook/gps';

const delay = ms => new Promise(resolve => setTimeout(resolve, ms));

const runSimulation = async () => {
    await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/projectv');

    // Map to track progress index
    const shipmentProgress = {};

    while (true) {
        console.log('--- Simulating GPS Pulse ---');

        // Refresh shipments list every cycle to catch new/updated ones
        const activeShipments = await Shipment.find({
            status: { $in: ['In Transit', 'Delayed'] }
        });

        console.log(`Processing ${activeShipments.length} active shipments`);

        // Process all updates in parallel for "continuous" movement effect
        const updatePromises = activeShipments.map(async (shipment) => {
            const route = shipment.route.coordinates;

            // Initialize progress if new
            if (shipmentProgress[shipment.shipmentId] === undefined) {
                shipmentProgress[shipment.shipmentId] = 0;
            }

            let currentIdx = shipmentProgress[shipment.shipmentId];

            // Advance
            if (currentIdx < route.length - 1) {
                currentIdx++;
                shipmentProgress[shipment.shipmentId] = currentIdx;

                const [lng, lat] = route[currentIdx];
                const isLastPoint = currentIdx === route.length - 1;

                const payload = {
                    shipmentId: shipment.shipmentId,
                    lat,
                    lng,
                    speed: 400 + Math.random() * 50, // Higher speed for planes/ships
                    timestamp: new Date()
                };

                // If reached destination
                if (isLastPoint) {
                    payload.status = 'Delivered';
                }

                try {
                    await axios.post(SERVER_URL, payload);
                } catch (error) {
                    // Suppress logs for speed
                }
            }
        });

        await Promise.all(updatePromises);
        process.stdout.write('.'); // visuals for terminal

        await delay(10000); // 10 second delay (Increased speed as per user request)
    }
};

runSimulation();
