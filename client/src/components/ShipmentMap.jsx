import { MapContainer, TileLayer, Marker, Popup, Polyline, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { useShipments } from '../context/ShipmentContext';
import { useSettings } from '../context/SettingsContext';
import { useState, useEffect } from 'react';
import ShipmentDetails from './ShipmentDetails';

// Custom Hook to handle zoom on click
const ZoomToMarker = ({ position, onClick, isSelected }) => {
    const map = useMap();
    useEffect(() => {
        if (isSelected && position) {
            map.flyTo(position, 8, { duration: 1.5 });
        }
    }, [isSelected, position, map]);

    return null;
};

// Start ShipmentMarker Component
const ShipmentMarker = ({ shipment, onClick, settings }) => {
    const [isHovered, setIsHovered] = useState(false);
    const [lng, lat] = shipment.currentLocation.coordinates;
    const map = useMap();

    // Generate Icon based on type
    const getIcon = () => {
        const size = settings.markerSize === 'large' ? [40, 40] :
            settings.markerSize === 'small' ? [20, 20] : [30, 30];

        // Choose icon color based on Map Style to ensure contrast
        const isDarkMap = settings.mapStyle === 'dark' || settings.mapStyle === 'satellite';

        // Default to Plane
        let iconUrl = 'https://img.icons8.com/color/96/airplane-mode-on.png';

        // If explicitly Sea, show Ship
        if (shipment.type === 'Sea') {
            // Use white icon for dark maps, black for light maps
            iconUrl = isDarkMap
                ? 'https://img.icons8.com/ios-filled/100/ffffff/cargo-ship.png'
                : 'https://img.icons8.com/ios-filled/100/000000/cargo-ship.png';
        }

        return new L.Icon({
            iconUrl,
            iconSize: size,
            iconAnchor: [size[0] / 2, size[1] / 2],
            popupAnchor: [0, -size[1] / 2],
            className: `transition-all duration-300 ${isHovered ? 'drop-shadow-[0_0_10px_rgba(255,255,255,0.5)] scale-110' : ''}`
        });
    };

    return (
        <Marker
            position={[lat, lng]}
            icon={getIcon()}
            eventHandlers={{
                mouseover: () => setIsHovered(true),
                mouseout: () => setIsHovered(false),
                click: () => {
                    map.flyTo([lat, lng], 8, { duration: 1.5 });
                    onClick(shipment.shipmentId);
                }
            }}
        >
            <Popup className="custom-popup">
                <div className="p-1 min-w-[150px]">
                    <h3 className="font-bold text-slate-900">{shipment.shipmentId}</h3>
                    <p className="text-xs text-slate-500 font-medium">{shipment.carrier}</p>
                    <div className="mt-2 flex items-center justify-between">
                        <span className={`text-[10px] uppercase font-bold px-1.5 py-0.5 rounded ${shipment.status === 'Delayed' ? 'bg-red-100 text-red-700' : 'bg-emerald-100 text-emerald-700'
                            }`}>
                            {shipment.status}
                        </span>
                        <span className="text-xs font-mono text-slate-600">
                            {shipment.speed?.toFixed(0) || 0} km/h
                        </span>
                    </div>
                </div>
            </Popup>
        </Marker>
    );
};
// End ShipmentMarker Component

const ShipmentMap = ({ selectedId, onMarkerClick }) => {
    const { shipments, loading } = useShipments();
    const { settings } = useSettings();
    const [selectedShipmentId, setSelectedShipmentId] = useState(selectedId || null);

    // Sync internal state with prop
    useEffect(() => {
        if (selectedId) {
            setSelectedShipmentId(selectedId);
        }
    }, [selectedId]);

    const handleMarkerClick = (id) => {
        setSelectedShipmentId(id);
        if (onMarkerClick) onMarkerClick(id);
    };

    // Get Tile Layer based on settings
    const getTileLayer = () => {
        switch (settings.mapStyle) {
            case 'light':
                return "https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png";
            case 'satellite':
                // Esri World Imagery
                return "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}";
            case 'terrain':
                return "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png";
            case 'dark':
            default:
                return "https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png";
        }
    };

    if (loading) return <div className="h-full w-full bg-slate-900 animate-pulse flex items-center justify-center text-slate-700">Loading Map Data...</div>;

    return (
        <div className="h-full w-full relative">
            <MapContainer center={[20, 0]} zoom={3} style={{ height: "100%", width: "100%", background: '#0f172a' }}>
                <TileLayer
                    url={getTileLayer()}
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                />

                <ZoomToMarker
                    position={selectedShipmentId ? shipments.find(s => s.shipmentId === selectedShipmentId)?.currentLocation.coordinates.slice().reverse() : null}
                    isSelected={!!selectedShipmentId}
                />

                {shipments.map(shipment => {
                    if (!shipment.currentLocation || !shipment.currentLocation.coordinates) return null;
                    const routeCoords = shipment.route.coordinates.map(([lng, lat]) => [lat, lng]);

                    return (
                        <div key={shipment.shipmentId}>
                            <ShipmentMarker
                                shipment={shipment}
                                onClick={handleMarkerClick}
                                settings={settings}
                            />

                            <Polyline
                                positions={routeCoords}
                                color={shipment.status === 'Delayed' ? '#ef4444' : '#0ea5e9'}
                                weight={1}
                                opacity={0.3}
                                dashArray="4, 8"
                            />
                        </div>
                    );
                })}
            </MapContainer>

            {selectedShipmentId && (
                <ShipmentDetails
                    shipmentId={selectedShipmentId}
                    onClose={() => setSelectedShipmentId(null)}
                />
            )}
        </div>
    );
};

export default ShipmentMap;
