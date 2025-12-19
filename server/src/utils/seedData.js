const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Shipment = require('../models/Shipment');
const User = require('../models/User');

dotenv.config({ path: './.env' }); // Adjust path if running from root

const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/projectv');
        console.log('MongoDB Connected');
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
};

// Helper Data
const CARRIERS = ['Maersk', 'DHL', 'FedEx', 'UPS', 'Hapag-Lloyd', 'MSC', 'Evergreen'];
const TYPES = ['Sea', 'Air', 'Land'];
const ITEMS = ['Electronics', 'Textiles', 'Auto Parts', 'Machinery', 'Pharmaceuticals', 'Raw Materials', 'Furniture'];
const NAMES = ['John Smith', 'Sarah Connor', 'James Bond', 'Ellen Ripley', 'Han Solo', 'Jack Sparrow', 'Tony Stark', 'Bruce Wayne', 'Clark Kent', 'Diana Prince'];

const CITIES = [
    { name: 'New York', coords: [-74.006, 40.7128] },
    { name: 'Los Angeles', coords: [-118.2437, 34.0522] },
    { name: 'London', coords: [-0.1276, 51.5074] },
    { name: 'Tokyo', coords: [139.6917, 35.6895] },
    { name: 'Shanghai', coords: [121.4737, 31.2304] },
    { name: 'Singapore', coords: [103.8198, 1.3521] },
    { name: 'Dubai', coords: [55.2708, 25.2048] },
    { name: 'Mumbai', coords: [72.8777, 19.0760] },
    { name: 'Sydney', coords: [151.2093, -33.8688] },
    { name: 'Sao Paulo', coords: [-46.6333, -23.5505] },
    { name: 'Cairo', coords: [31.2357, 30.0444] },
    { name: 'Cape Town', coords: [18.4241, -33.9249] },
    { name: 'Moscow', coords: [37.6173, 55.7558] },
    { name: 'Paris', coords: [2.3522, 48.8566] },
    { name: 'Berlin', coords: [13.4050, 52.5200] }
];

const generateRoute = (start, end, steps = 100) => {
    const route = [];
    const latStep = (end[1] - start[1]) / steps;
    const lngStep = (end[0] - start[0]) / steps;
    // Add some curve/noise to make it realistic
    for (let i = 0; i <= steps; i++) {
        let lng = start[0] + lngStep * i;
        let lat = start[1] + latStep * i;

        // Simple curve logic (parabola-ish)
        const curve = Math.sin((i / steps) * Math.PI) * 5;
        if (Math.abs(lngStep) > Math.abs(latStep)) lat += curve; // curve latitude if moving mostly east/west
        else lng += curve;

        route.push([lng, lat]);
    }
    return route;
};

const getRandom = (arr) => arr[Math.floor(Math.random() * arr.length)];
const getRandomSubset = (arr, count) => {
    const shuffled = arr.sort(() => 0.5 - Math.random());
    return shuffled.slice(0, count);
};

const seed = async () => {
    await connectDB();
    try {
        try {
            await mongoose.connection.db.dropCollection('shipments');
            await mongoose.connection.db.dropCollection('users');
        } catch (e) { console.log('Collections might not exist yet, continuing...'); }

        const admin = await User.create({
            name: 'System Admin',
            email: 'admin@cargoflow.com',
            password: 'password123',
            role: 'admin'
        });
        console.log('Admin user created');

        // Generate 100 Shipments
        for (let i = 0; i < 100; i++) {
            const originCity = getRandom(CITIES);
            let destCity = getRandom(CITIES);
            while (destCity.name === originCity.name) destCity = getRandom(CITIES);

            const routeCoords = generateRoute(originCity.coords, destCity.coords);
            const currentIdx = Math.floor(Math.random() * (routeCoords.length - 2));

            const type = getRandom(TYPES);

            await Shipment.create({
                shipmentId: `SHP-${1000 + i}`,
                carrier: getRandom(CARRIERS),
                vesselName: `${getRandom(['SS', 'MV', 'Air', 'Truck'])} ${getRandom(['Voyager', 'Pioneer', 'Titan', 'Spirit', 'Galaxy'])} ${i}`,
                type: type,
                origin: { type: 'Point', coordinates: originCity.coords, address: originCity.name },
                destination: { type: 'Point', coordinates: destCity.coords, address: destCity.name },
                currentLocation: { type: 'Point', coordinates: routeCoords[currentIdx] },
                route: { type: 'LineString', coordinates: routeCoords },
                status: Math.random() > 0.8 ? 'Delayed' : (Math.random() > 0.9 ? 'Stopped' : 'In Transit'),
                speed: 40 + Math.random() * 40,
                personnel: {
                    captain: getRandom(NAMES),
                    crew: getRandomSubset(NAMES, 3)
                },
                manifest: [
                    { item: getRandom(ITEMS), quantity: Math.floor(Math.random() * 100), weight: `${Math.floor(Math.random() * 1000)}kg`, value: `$${Math.floor(Math.random() * 50000)}` },
                    { item: getRandom(ITEMS), quantity: Math.floor(Math.random() * 50), weight: `${Math.floor(Math.random() * 500)}kg`, value: `$${Math.floor(Math.random() * 10000)}` }
                ]
            });

            if (i % 10 === 0) console.log(`Created ${i} shipments...`);
        }

        console.log('100 Shipments Created Successfully');
        process.exit();
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
};

seed();
