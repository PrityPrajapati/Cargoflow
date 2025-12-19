import { createContext, useState, useEffect, useContext } from 'react';
import api from '../services/api';
import { io } from 'socket.io-client';
import useAuth from '../hooks/useAuth';
import { useSettings } from './SettingsContext';

const ShipmentContext = createContext();

export const ShipmentProvider = ({ children }) => {
    const [shipments, setShipments] = useState([]);
    const [loading, setLoading] = useState(true);
    const { user } = useAuth();
    const { settings } = useSettings();
    const [socket, setSocket] = useState(null);

    // Initial Fetch
    const fetchShipments = async () => {
        try {
            console.log('Fetching shipments...');
            const { data } = await api.get('/shipments');
            console.log('Shipments fetched:', data.length);
            setShipments(data);
            setLoading(false);
        } catch (error) {
            console.error("Failed to fetch shipments", error);
            console.error("Error details:", error.response?.data || error.message);
            setLoading(false);
        }
    };

    useEffect(() => {
        console.log('ShipmentContext: User changed or settings updated:', { user: user?.email, autoRefresh: settings.autoRefresh, interval: settings.refreshInterval });

        let intervalId = null;

        if (user) {
            // Initial Fetch
            fetchShipments();

            // Setup Socket
            const newSocket = io('https://cargoflow-858j.onrender.com');
            setSocket(newSocket);

            newSocket.on('connect', () => {
                console.log('Socket Connected');
                newSocket.emit('join_room', 'global');
            });

            newSocket.on('location_update', (update) => {
                console.log('Location Update:', update);
                setShipments(prev => prev.map(s =>
                    s.shipmentId === update.shipmentId
                        ? { ...s, currentLocation: update.currentLocation, status: update.status }
                        : s
                ));
            });

            // Polling Fallback (if Auto Refresh is ON)
            if (settings.autoRefresh) {
                console.log(`Setting up polling every ${settings.refreshInterval} seconds`);
                intervalId = setInterval(() => {
                    console.log('Polling shipments...');
                    fetchShipments();
                }, settings.refreshInterval * 1000);
            }

            return () => {
                newSocket.disconnect();
                if (intervalId) clearInterval(intervalId);
            };
        }
    }, [user, settings.autoRefresh, settings.refreshInterval]);

    return (
        <ShipmentContext.Provider value={{ shipments, loading, socket, fetchShipments }}>
            {children}
        </ShipmentContext.Provider>
    );
};

export const useShipments = () => useContext(ShipmentContext);
export default ShipmentContext;
