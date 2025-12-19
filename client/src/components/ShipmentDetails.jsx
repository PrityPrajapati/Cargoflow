import { useState, useEffect } from 'react';
import { useShipments } from '../context/ShipmentContext';
import { Truck, Navigation, AlertTriangle, User, FileText, X } from 'lucide-react';
import useAuth from '../hooks/useAuth';
import api from '../services/api';

const ShipmentDetails = ({ shipmentId, onClose }) => {
    const { shipments } = useShipments();
    const { user } = useAuth();
    const shipment = shipments.find(s => s.shipmentId === shipmentId);

    // Local state for editing location
    const [isEditing, setIsEditing] = useState(false);
    const [editLat, setEditLat] = useState(0);
    const [editLng, setEditLng] = useState(0);

    useEffect(() => {
        if (shipment) {
            setEditLat(shipment.currentLocation.coordinates[1]);
            setEditLng(shipment.currentLocation.coordinates[0]);
        }
    }, [shipment]);

    if (!shipment) return null;

    const handleUpdateLocation = async () => {
        try {
            await api.patch(`/shipments/${shipmentId}/location`, {
                lat: parseFloat(editLat),
                lng: parseFloat(editLng)
            });
            setIsEditing(false);
        } catch (error) {
            console.error("Failed to update location", error);
            alert("Failed to update location");
        }
    };

    return (
        <div className="fixed inset-0 z-[2000] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="bg-white/95 dark:bg-[#0b1120]/95 backdrop-blur-xl border border-slate-200 dark:border-white/10 rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl">

                {/* Header */}
                <div className="p-6 border-b border-slate-200 dark:border-white/10 flex justify-between items-start bg-slate-50/80 dark:bg-slate-800/50 sticky top-0 z-10 backdrop-blur-md">
                    <div>
                        <div className="flex items-center gap-3">
                            <h2 className="text-2xl font-bold text-slate-900 dark:text-white font-display">{shipment.shipmentId}</h2>
                            <span className={`px-2 py-1 rounded-md text-xs font-bold border ${shipment.status === 'Delayed' ? 'bg-red-500/10 text-red-600 dark:text-red-400 border-red-500/20' :
                                shipment.status === 'Stopped' ? 'bg-orange-500/10 text-orange-600 dark:text-orange-400 border-orange-500/20' :
                                    'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20'
                                }`}>
                                {shipment.status}
                            </span>
                        </div>
                        <p className="text-slate-500 dark:text-slate-400 mt-1 font-medium">{shipment.vesselName} • {shipment.type}</p>
                    </div>
                    <button onClick={onClose} className="text-slate-400 hover:text-slate-600 dark:hover:text-white transition-colors bg-slate-100 dark:bg-white/5 p-2 rounded-lg">
                        <X size={20} />
                    </button>
                </div>

                <div className="p-6 space-y-6">

                    {/* Route Info */}
                    <div className="grid grid-cols-2 gap-4">
                        <div className="bg-slate-50 dark:bg-slate-800/50 p-4 rounded-xl border border-slate-200 dark:border-white/5">
                            <p className="text-xs text-slate-500 uppercase tracking-wider mb-1 font-bold">Origin</p>
                            <p className="text-slate-900 dark:text-white font-medium text-lg">{shipment.origin.address}</p>
                            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 font-mono">{shipment.origin.coordinates.join(', ')}</p>
                        </div>
                        <div className="bg-slate-50 dark:bg-slate-800/50 p-4 rounded-xl border border-slate-200 dark:border-white/5">
                            <p className="text-xs text-slate-500 uppercase tracking-wider mb-1 font-bold">Destination</p>
                            <p className="text-slate-900 dark:text-white font-medium text-lg">{shipment.destination.address}</p>
                            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 font-mono">{shipment.destination.coordinates.join(', ')}</p>
                        </div>
                    </div>

                    {/* Admin Controls */}
                    {user?.role === 'admin' && (
                        <div className="bg-brand-50/50 dark:bg-slate-800/30 p-5 rounded-xl border border-brand-200 dark:border-white/5">
                            <div className="flex justify-between items-center mb-4">
                                <h3 className="text-brand-900 dark:text-white font-bold flex items-center text-sm uppercase tracking-wide">
                                    <Navigation className="w-4 h-4 mr-2 text-brand-600 dark:text-brand-500" />
                                    Manual Override
                                </h3>
                                <button
                                    onClick={() => setIsEditing(!isEditing)}
                                    className="text-xs text-brand-600 dark:text-brand-400 hover:text-brand-700 dark:hover:text-brand-300 font-medium underline decoration-2 underline-offset-2"
                                >
                                    {isEditing ? 'Cancel Edit' : 'Edit Coordinates'}
                                </button>
                            </div>

                            {isEditing ? (
                                <div className="flex gap-4 items-end">
                                    <div className="flex-1">
                                        <label className="text-xs text-slate-500 dark:text-slate-400 block mb-1 font-medium">Latitude</label>
                                        <input type="number" step="0.0001" value={editLat} onChange={e => setEditLat(e.target.value)} className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg px-3 py-2 text-slate-900 dark:text-white text-sm focus:ring-2 focus:ring-brand-500/20 outline-none" />
                                    </div>
                                    <div className="flex-1">
                                        <label className="text-xs text-slate-500 dark:text-slate-400 block mb-1 font-medium">Longitude</label>
                                        <input type="number" step="0.0001" value={editLng} onChange={e => setEditLng(e.target.value)} className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg px-3 py-2 text-slate-900 dark:text-white text-sm focus:ring-2 focus:ring-brand-500/20 outline-none" />
                                    </div>
                                    <button onClick={handleUpdateLocation} className="bg-brand-600 hover:bg-brand-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors shadow-lg shadow-brand-500/20">
                                        Update
                                    </button>
                                </div>
                            ) : (
                                <p className="text-sm text-slate-600 dark:text-slate-400 font-mono bg-white/50 dark:bg-black/20 p-2 rounded-lg inline-block border border-brand-100 dark:border-white/5">
                                    Current Position: {shipment.currentLocation.coordinates[1].toFixed(4)}, {shipment.currentLocation.coordinates[0].toFixed(4)}
                                </p>
                            )}
                        </div>
                    )}

                    {/* Crew & Personnel */}
                    <div>
                        <h3 className="text-slate-800 dark:text-slate-200 font-bold mb-3 flex items-center text-sm uppercase tracking-wide">
                            <User className="w-4 h-4 mr-2 text-brand-500" />
                            Crew Manifest
                        </h3>
                        <div className="bg-white dark:bg-slate-800/50 rounded-xl overflow-hidden border border-slate-200 dark:border-white/5 shadow-sm">
                            <div className="p-4 border-b border-slate-100 dark:border-white/5 flex justify-between items-center bg-slate-50/50 dark:bg-white/5">
                                <span className="text-slate-500 dark:text-slate-400 text-sm font-medium">Captain</span>
                                <span className="text-slate-900 dark:text-white text-sm font-bold font-display">{shipment.personnel?.captain || 'Unknown'}</span>
                            </div>
                            <div className="p-4">
                                <span className="text-slate-500 dark:text-slate-400 text-xs font-bold uppercase tracking-wider block mb-3">Crew Members</span>
                                <div className="flex flex-wrap gap-2">
                                    {shipment.personnel?.crew?.map((crew, i) => (
                                        <span key={i} className="bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 text-xs px-3 py-1.5 rounded-full font-medium border border-slate-200 dark:border-white/5">
                                            {crew}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Cargo Manifest */}
                    <div>
                        <h3 className="text-slate-800 dark:text-slate-200 font-bold mb-3 flex items-center text-sm uppercase tracking-wide">
                            <FileText className="w-4 h-4 mr-2 text-brand-500" />
                            Cargo Manifest
                        </h3>
                        <div className="overflow-hidden rounded-xl border border-slate-200 dark:border-white/5 shadow-sm">
                            <table className="w-full text-sm text-left">
                                <thead className="bg-slate-50 dark:bg-slate-800 text-slate-500 dark:text-slate-400">
                                    <tr>
                                        <th className="px-4 py-3 font-semibold text-xs uppercase tracking-wider">Item</th>
                                        <th className="px-4 py-3 font-semibold text-xs uppercase tracking-wider">Qty</th>
                                        <th className="px-4 py-3 font-semibold text-xs uppercase tracking-wider">Weight</th>
                                        <th className="px-4 py-3 font-semibold text-xs uppercase tracking-wider">Value</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100 dark:divide-white/5 bg-white dark:bg-slate-800/50">
                                    {shipment.manifest?.map((item, i) => (
                                        <tr key={i} className="hover:bg-slate-50 dark:hover:bg-white/5 transition-colors">
                                            <td className="px-4 py-3 text-slate-900 dark:text-white font-medium">{item.item}</td>
                                            <td className="px-4 py-3 text-slate-500 dark:text-slate-300">{item.quantity}</td>
                                            <td className="px-4 py-3 text-slate-500 dark:text-slate-300">{item.weight}</td>
                                            <td className="px-4 py-3 text-slate-500 dark:text-slate-300">{item.value}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
};

export default ShipmentDetails;
