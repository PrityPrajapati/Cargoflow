const Shipment = require('../models/Shipment');
const Alert = require('../models/Alert');

// @desc    Create a new shipment
// @route   POST /api/shipments
// @access  Private (Admin/Ops)
exports.createShipment = async (req, res) => {
    try {
        const { shipmentId, carrier, origin, destination, route, status, type, personnel, manifest } = req.body;

        // Initial location is origin
        const currentLocation = {
            type: 'Point',
            coordinates: origin.coordinates
        };

        const shipment = await Shipment.create({
            shipmentId,
            carrier,
            origin,
            destination,
            currentLocation,
            route,
            status: status || 'Created',
            type,
            personnel,
            manifest
        });

        res.status(201).json(shipment);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// @desc    Get all shipments (all or by region)
// @route   GET /api/shipments
// @access  Private
exports.getShipments = async (req, res) => {
    try {
        console.log('getShipments called by user:', req.user?.email);

        if (!req.user) {
            return res.status(401).json({ message: 'User not authenticated' });
        }

        let query = {};

        // If user is Regional Manager, filter by region
        if (req.user.role === 'regional_manager' && req.user.assignedRegion) {
            query.region = req.user.assignedRegion;
        }

        console.log('Querying shipments with:', query);
        const shipments = await Shipment.find(query).lean(); // Use .lean() for better performance
        console.log(`Found ${shipments.length} shipments`);

        res.json(shipments);
    } catch (error) {
        console.error('Error in getShipments:', error);
        res.status(500).json({ message: error.message, stack: error.stack });
    }
};

// @desc    Get single shipment
// @route   GET /api/shipments/:id
// @access  Private
exports.getShipmentById = async (req, res) => {
    try {
        const shipment = await Shipment.findOne({ shipmentId: req.params.id });
        if (shipment) {
            res.json(shipment);
        } else {
            res.status(404).json({ message: 'Shipment not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Webhook for GPS updates
// @route   POST /api/shipments/webhook/gps
// @access  Public (protected by API Key in real world)
exports.ingestGPS = async (req, res) => {
    try {
        const { shipmentId, lat, lng, speed, timestamp } = req.body;

        // Find shipment
        const shipment = await Shipment.findOne({ shipmentId });

        if (!shipment) {
            return res.status(404).json({ message: 'Shipment not found' });
        }

        // Update location
        shipment.currentLocation = {
            type: 'Point',
            coordinates: [lng, lat]
        };

        // Update status if provided
        if (req.body.status) {
            shipment.status = req.body.status;
        }

        // Simple logic to update status based on location matching destination
        // (In real app, use geofencing lib)

        await shipment.save();

        // Create alert for this location update
        // THROTTLE: Only save to DB if status changed or 10% chance to prevent DB explosion with high-speed simulation
        const isStatusChange = req.body.status && req.body.status !== shipment.status;
        const shouldSaveAlert = isStatusChange || Math.random() < 0.1;

        const io = req.app.get('socketio'); // Define io once here

        if (shouldSaveAlert) {
            const alert = await Alert.create({
                shipmentId,
                type: isStatusChange ? 'exception' : 'location_update',
                message: isStatusChange
                    ? `${shipmentId} status changed to ${req.body.status}`
                    : `${shipmentId} at [${lat.toFixed(4)}, ${lng.toFixed(4)}].`,
                severity: isStatusChange ? 'warning' : 'info',
                location: {
                    type: 'Point',
                    coordinates: [lng, lat]
                },
                metadata: {
                    speed,
                    status: shipment.status,
                    carrier: shipment.carrier,
                    vesselName: shipment.vesselName
                }
            });

            // Emit alert event
            io.emit('new_alert', alert);
        }

        // Emit Socket Event (Always emit location for smooth map movement)
        io.emit('location_update', {
            shipmentId,
            currentLocation: shipment.currentLocation,
            status: shipment.status,
            speed,
            timestamp
        });

        res.json({ success: true });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: error.message });
    }
};

// @desc Manually update location (for Admin UI)
// @route PATCH /api/shipments/:id/location
exports.updateLocation = async (req, res) => {
    try {
        const { lat, lng } = req.body;
        const shipment = await Shipment.findOne({ shipmentId: req.params.id });

        if (!shipment) return res.status(404).json({ message: 'Shipment not found' });

        shipment.currentLocation = {
            type: 'Point',
            coordinates: [lng, lat]
        };
        await shipment.save();

        const io = req.app.get('socketio');
        io.emit('location_update', {
            shipmentId: shipment.shipmentId,
            currentLocation: shipment.currentLocation,
            status: shipment.status
        });

        res.json(shipment);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

