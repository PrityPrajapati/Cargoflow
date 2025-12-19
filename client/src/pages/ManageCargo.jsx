import { useState, useEffect } from 'react';
import { useShipments } from '../context/ShipmentContext';
import api from '../services/api';
import { Plus, Table as TableIcon, X, Search, Truck, MapPin, Package, Clock, Bell, Settings, FileText, ChevronDown } from 'lucide-react';
import clsx from 'clsx';
import ShipmentMap from '../components/ShipmentMap';
import { toast } from 'react-hot-toast';

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
    { name: 'Cape Town', coords: [18.4241, -33.9249] },
    { name: 'Moscow', coords: [37.6173, 55.7558] },
    { name: 'Paris', coords: [2.3522, 48.8566] },
];

const generateRoute = (start, end, steps = 100) => {
    const route = [];
    const latStep = (end[1] - start[1]) / steps;
    const lngStep = (end[0] - start[0]) / steps;
    for (let i = 0; i <= steps; i++) {
        let lng = start[0] + lngStep * i;
        let lat = start[1] + latStep * i;
        const curve = Math.sin((i / steps) * Math.PI) * 2;
        if (Math.abs(lngStep) > Math.abs(latStep)) lat += curve;
        else lng += curve;
        route.push([lng, lat]);
    }
    return route;
};

const ManageCargo = () => {
    const { shipments, loading, fetchShipments } = useShipments();
    const [searchTerm, setSearchTerm] = useState('');
    const [showCreateForm, setShowCreateForm] = useState(false);
    const [selectedShipment, setSelectedShipment] = useState(null);
    const [creating, setCreating] = useState(false);

    const [formData, setFormData] = useState({
        shipmentId: `DEZ${Math.floor(Math.random() * 900000) + 100000}`,
        carrier: '',
        driver: '',
        status: 'Pending',
        type: 'Air',
        category: 'Electronic',
        originCity: 'New York',
        destinationCity: 'Tokyo',
        manifest: []
    });

    useEffect(() => {
        if (shipments.length > 0 && !selectedShipment) {
            setSelectedShipment(shipments[0]);
        }
    }, [shipments, selectedShipment]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!formData.carrier) return toast.error('Please enter carrier name');
        if (!formData.driver) return toast.error('Please enter driver name');

        setCreating(true);
        const originCity = CITIES.find(c => c.name === formData.originCity);
        const destCity = CITIES.find(c => c.name === formData.destinationCity);

        const payload = {
            shipmentId: formData.shipmentId,
            carrier: formData.carrier,
            status: formData.status,
            type: formData.type,
            personnel: {
                captain: formData.driver,
                crew: []
            },
            origin: {
                type: 'Point',
                address: originCity.name,
                coordinates: originCity.coords
            },
            destination: {
                type: 'Point',
                address: destCity.name,
                coordinates: destCity.coords
            },
            route: {
                type: 'LineString',
                coordinates: generateRoute(originCity.coords, destCity.coords)
            },
            manifest: [{ item: formData.category, quantity: 1, weight: '500kg', value: '$25,000' }]
        };

        try {
            await api.post('/shipments', payload);
            toast.success('Shipment Initialized Successfully');
            setShowCreateForm(false);
            await fetchShipments(); // Refresh context

            // Auto-select the newly created shipment to trigger map zoom
            setSelectedShipment(payload);

            setFormData({
                shipmentId: `DEZ${Math.floor(Math.random() * 900000) + 100000}`,
                carrier: '',
                driver: '',
                status: 'Pending',
                type: 'Air',
                category: 'Electronic',
                originCity: 'New York',
                destinationCity: 'Tokyo',
                manifest: []
            });
        } catch (err) {
            console.error('Failed to create shipment', err);
            toast.error(err.response?.data?.message || 'Failed to initialize load');
        } finally {
            setCreating(false);
        }
    };

    if (loading) return <div className="h-full flex items-center justify-center"><div className="w-12 h-12 border-4 border-[#00E5FF] border-t-transparent rounded-full animate-spin"></div></div>;

    const filteredShipments = shipments.filter(s =>
        s.shipmentId.toLowerCase().includes(searchTerm.toLowerCase()) ||
        s.carrier.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="h-full flex gap-6 overflow-hidden p-0 transition-colors duration-300">
            {/* Left Sidebar List */}
            <div className="w-[360px] flex flex-col gap-4 shrink-0 h-full">
                <div className="bg-[var(--bg-secondary)] border border-[var(--border-color)] rounded-3xl p-5 flex-1 flex flex-col overflow-hidden shadow-2xl transition-colors">
                    <div className="flex items-center justify-between mb-5 shrink-0">
                        <h2 className="text-lg font-bold text-[var(--text-primary)] tracking-tight font-display">All Shipping</h2>
                        <div className="flex gap-2">
                            <button className="p-1.5 bg-[#1c1c1f] rounded-lg border border-[#27272a] text-zinc-400">
                                <Search className="w-4 h-4" />
                            </button>
                        </div>
                    </div>

                    {/* Search Field */}
                    <div className="relative mb-5 shrink-0">
                        <input
                            type="text"
                            placeholder="Search shipments..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full bg-[var(--bg-primary)] border border-[var(--border-color)] rounded-xl py-3 pl-10 pr-4 text-xs text-[var(--text-primary)] focus:outline-none focus:border-accent transition-all placeholder-zinc-600 font-medium"
                        />
                        <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-[var(--text-secondary)]" />
                    </div>

                    {/* Shipments List */}
                    <div className="flex-1 overflow-y-auto pr-1 space-y-3 scrollbar-hide">
                        {filteredShipments.map((s) => (
                            <div
                                key={s.shipmentId}
                                onClick={() => setSelectedShipment(s)}
                                className={clsx(
                                    "p-4 rounded-2xl border transition-all duration-300 cursor-pointer group relative overflow-hidden",
                                    selectedShipment?.shipmentId === s.shipmentId
                                        ? "bg-lavender text-[#000000] border-transparent shadow-lg shadow-lavender/20"
                                        : "bg-[#1c1c1f]/40 hover:bg-[#1c1c1f] border-[#27272a] text-zinc-100 hover:border-lavender/30"
                                )}
                            >
                                <div className="flex items-start justify-between mb-2">
                                    <div className="flex items-center gap-3">
                                        <div className={clsx(
                                            "w-10 h-10 rounded-xl flex items-center justify-center overflow-hidden",
                                            selectedShipment?.shipmentId === s.shipmentId ? "bg-[#000000]/10" : "bg-[#121214]"
                                        )}>
                                            <Truck className={clsx("w-5 h-5", selectedShipment?.shipmentId === s.shipmentId ? "text-[#000000]" : "text-lavender")} />
                                        </div>
                                        <div>
                                            <p className="text-xs font-black uppercase tracking-widest">{s.shipmentId}</p>
                                            <p className={clsx("text-[11px] font-bold mt-0.5", selectedShipment?.shipmentId === s.shipmentId ? "text-[#000000]/70" : "text-zinc-500")}>
                                                {s.carrier}
                                            </p>
                                        </div>
                                    </div>
                                    <span className={clsx(
                                        "text-[8px] font-black uppercase tracking-widest mt-1",
                                        s.status === 'Delayed' ? "text-red-500" : (selectedShipment?.shipmentId === s.shipmentId ? "text-[#000000]" : "text-lavender")
                                    )}>
                                        {s.status}
                                    </span>
                                </div>
                                <div className="flex items-center gap-2 mt-4 px-1">
                                    <MapPin className="w-3 h-3 opacity-60" />
                                    <p className="text-[10px] font-medium truncate opacity-80">{s.origin.address}</p>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Create Button & Dropdown Form */}
                    <div className="mt-4 shrink-0 flex flex-col gap-3">
                        <button
                            onClick={() => setShowCreateForm(!showCreateForm)}
                            className="w-full py-3.5 bg-lavender hover:bg-lavender-brand text-[#000000] font-black uppercase tracking-widest text-xs rounded-2xl transition-all shadow-lg shadow-lavender/20 flex items-center justify-center gap-2"
                        >
                            <Plus className={clsx("w-4 h-4 transition-transform duration-300", showCreateForm ? "rotate-45" : "")} />
                            Add New Load
                        </button>

                        <div className={clsx(
                            "overflow-hidden transition-all duration-500 ease-in-out bg-[var(--bg-primary)] rounded-2xl",
                            showCreateForm ? "max-h-[800px] opacity-100 p-4 border border-[var(--border-color)] mt-2 mb-2" : "max-h-0 opacity-0 border-none m-0 p-0"
                        )}>
                            <form onSubmit={handleSubmit} className="space-y-4">
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="text-[10px] font-black text-[var(--text-secondary)] uppercase px-1">Carrier Name</label>
                                        <input
                                            name="carrier"
                                            placeholder="Carrier name..."
                                            value={formData.carrier}
                                            onChange={handleChange}
                                            className="w-full bg-[var(--bg-secondary)] border border-[var(--border-color)] rounded-xl py-2.5 px-3 text-xs text-[var(--text-primary)] focus:outline-none focus:border-accent"
                                        />
                                    </div>
                                    <div>
                                        <label className="text-[10px] font-black text-[var(--text-secondary)] uppercase px-1">Driver Name</label>
                                        <input
                                            name="driver"
                                            placeholder="Driver name..."
                                            value={formData.driver}
                                            onChange={handleChange}
                                            className="w-full bg-[var(--bg-secondary)] border border-[var(--border-color)] rounded-xl py-2.5 px-3 text-xs text-[var(--text-primary)] focus:outline-none focus:border-accent"
                                        />
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="text-[10px] font-black text-[var(--text-secondary)] uppercase px-1">Origin</label>
                                        <select
                                            name="originCity"
                                            value={formData.originCity}
                                            onChange={handleChange}
                                            className="w-full bg-[var(--bg-secondary)] border border-[var(--border-color)] rounded-xl py-2.5 px-3 text-xs text-[var(--text-primary)] outline-none"
                                        >
                                            {CITIES.map(c => <option key={c.name} value={c.name}>{c.name}</option>)}
                                        </select>
                                    </div>
                                    <div>
                                        <label className="text-[10px] font-black text-[var(--text-secondary)] uppercase px-1">Destination</label>
                                        <select
                                            name="destinationCity"
                                            value={formData.destinationCity}
                                            onChange={handleChange}
                                            className="w-full bg-[var(--bg-secondary)] border border-[var(--border-color)] rounded-xl py-2.5 px-3 text-xs text-[var(--text-primary)] outline-none"
                                        >
                                            {CITIES.map(c => <option key={c.name} value={c.name}>{c.name}</option>)}
                                        </select>
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="text-[10px] font-black text-[var(--text-secondary)] uppercase px-1">Status</label>
                                        <select
                                            name="status"
                                            value={formData.status}
                                            onChange={handleChange}
                                            className="w-full bg-[var(--bg-secondary)] border border-[var(--border-color)] rounded-xl py-2.5 px-3 text-xs text-[var(--text-primary)] outline-none"
                                        >
                                            <option>Pending</option>
                                            <option>In Transit</option>
                                            <option>Delayed</option>
                                        </select>
                                    </div>
                                    <div>
                                        <label className="text-[10px] font-black text-[var(--text-secondary)] uppercase px-1">Category</label>
                                        <select
                                            name="category"
                                            value={formData.category}
                                            onChange={handleChange}
                                            className="w-full bg-[var(--bg-secondary)] border border-[var(--border-color)] rounded-xl py-2.5 px-3 text-xs text-[var(--text-primary)] outline-none"
                                        >
                                            <option>Electronic</option>
                                            <option>Furniture</option>
                                            <option>Food</option>
                                            <option>General</option>
                                        </select>
                                    </div>
                                </div>

                                <button
                                    type="submit"
                                    disabled={creating}
                                    className="w-full py-4 bg-accent text-[#000000] font-black text-[11px] uppercase rounded-xl mt-4 tracking-widest shadow-glow hover:scale-[1.02] active:scale-95 transition-all disabled:opacity-50"
                                >
                                    {creating ? 'Initializing...' : 'Initialize Load'}
                                </button>
                            </form>
                        </div>
                    </div>
                </div>
            </div>

            {/* Main Content Area (Right) */}
            <div className="flex-1 flex flex-col gap-6 overflow-hidden h-full">
                {/* Top Statistics Cards */}
                <div className="grid grid-cols-4 gap-6 shrink-0">
                    <div className="bg-[var(--bg-secondary)] border border-[var(--border-color)] rounded-3xl p-5 shadow-xl relative overflow-hidden group transition-colors">
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 rounded-2xl bg-[var(--bg-primary)] flex items-center justify-center border border-[var(--border-color)] group-hover:border-accent transition-colors">
                                <FileText className="w-6 h-6 text-lavender" />
                            </div>
                            <div>
                                <p className="text-[10px] font-black text-[var(--text-secondary)] uppercase tracking-widest mb-0.5">Shipping ID</p>
                                <p className="text-xl font-black text-[var(--text-primary)] transition-colors">{selectedShipment?.shipmentId || 'N/A'}</p>
                            </div>
                        </div>
                    </div>

                    <div className="bg-[var(--bg-secondary)] border border-[var(--border-color)] rounded-3xl p-5 shadow-xl relative overflow-hidden group transition-colors">
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 rounded-2xl bg-[var(--bg-primary)] flex items-center justify-center border border-[var(--border-color)] group-hover:border-accent transition-colors">
                                <Package className="w-6 h-6 text-accent" />
                            </div>
                            <div>
                                <p className="text-[10px] font-black text-[var(--text-secondary)] uppercase tracking-widest mb-0.5">Load Category</p>
                                <p className="text-xl font-black text-[var(--text-primary)] transition-colors">
                                    {selectedShipment?.manifest?.[0]?.item || 'General'}
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="col-span-2 bg-[var(--bg-secondary)] border border-[var(--border-color)] rounded-3xl p-5 shadow-xl relative overflow-hidden flex items-center justify-between transition-colors">
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 rounded-2xl overflow-hidden border-2 border-accent/20 flex items-center justify-center bg-[var(--bg-primary)]">
                                <span className="text-accent font-black text-sm uppercase">
                                    {(selectedShipment?.personnel?.captain || 'W').charAt(0)}
                                </span>
                            </div>
                            <div>
                                <p className="text-[10px] font-black text-[var(--text-secondary)] uppercase tracking-widest mb-0.5">Truck Driver</p>
                                <p className="text-lg font-black text-[var(--text-primary)] transition-colors">{selectedShipment?.personnel?.captain || 'Williamson'}</p>
                            </div>
                        </div>
                        <div className="flex gap-2">
                            <button className="p-2.5 bg-[var(--bg-primary)] rounded-xl border border-[var(--border-color)] text-[var(--text-secondary)] hover:text-accent transition-all"><Bell className="w-5 h-5" /></button>
                            <button className="p-2.5 bg-[var(--bg-primary)] rounded-xl border border-[var(--border-color)] text-[var(--text-secondary)] hover:text-accent transition-all"><Settings className="w-5 h-5" /></button>
                        </div>
                    </div>
                </div>

                {/* Map Section */}
                <div className="flex-1 bg-[var(--bg-secondary)] border border-[var(--border-color)] rounded-3xl overflow-hidden relative shadow-2xl transition-colors">
                    <div className="absolute top-6 left-6 z-[600] pointer-events-none">
                        <div className="bg-[var(--bg-primary)]/80 backdrop-blur-md px-4 py-2.5 rounded-2xl border border-[var(--border-color)]">
                            <p className="text-[10px] font-black text-[var(--text-secondary)] uppercase tracking-widest">Live Routing</p>
                            <p className="text-sm font-bold text-[var(--text-primary)] mt-0.5 transition-colors">Map Overview</p>
                        </div>
                    </div>
                    <ShipmentMap
                        selectedId={selectedShipment?.shipmentId}
                        onMarkerClick={(id) => {
                            const found = shipments.find(s => s.shipmentId === id);
                            if (found) setSelectedShipment(found);
                        }}
                    />
                </div>

                {/* Bottom Row Details */}
                <div className="grid grid-cols-2 gap-6 shrink-0 mb-2">
                    <div className="bg-[var(--bg-secondary)] border border-[var(--border-color)] rounded-3xl p-6 shadow-xl transition-colors">
                        <div className="flex items-center justify-between mb-6">
                            <h3 className="text-base font-bold text-[var(--text-primary)] tracking-tight font-display transition-colors">Tracking Details</h3>
                            <button className="text-[10px] font-black text-[var(--text-secondary)] uppercase hover:text-[var(--text-primary)] transition-colors">Details info</button>
                        </div>
                        <div className="flex justify-between items-center bg-[var(--bg-primary)] border border-[var(--border-color)] rounded-2xl p-5 transition-colors">
                            <div>
                                <div className="flex items-center gap-2 mb-1">
                                    <Clock className="w-4 h-4 text-lavender" />
                                    <span className="text-xl font-black text-[var(--text-primary)] transition-colors">10:23 PM</span>
                                </div>
                                <p className="text-[10px] text-[var(--text-secondary)] font-bold uppercase tracking-wider transition-colors">Estimate Arrival Time</p>
                            </div>
                            <div className="w-[1px] h-10 bg-[var(--border-color)]"></div>
                            <div className="text-right">
                                <div className="flex items-center justify-end gap-2 mb-1 text-[var(--text-primary)]">
                                    <span className="text-lg font-bold truncate max-w-[150px] transition-colors">{selectedShipment?.destination.address.split(',')[0]}</span>
                                    <MapPin className="w-4 h-4 text-accent" />
                                </div>
                                <p className="text-[10px] text-[var(--text-secondary)] font-bold uppercase tracking-wider transition-colors">Destination</p>
                            </div>
                        </div>

                        {/* Progress Bar Larger */}
                        <div className="mt-6 flex items-center gap-4">
                            <span className="text-[10px] font-bold text-[var(--text-secondary)] uppercase truncate max-w-[100px] transition-colors">{selectedShipment?.origin.address.split(',')[0]}</span>
                            <div className="flex-1 h-2.5 bg-[var(--bg-primary)] rounded-full overflow-hidden relative">
                                <div className="h-full w-[65%] bg-lavender shadow-[0_0_15px_rgba(195,177,225,0.4)]" />
                                <div className="absolute top-1/2 left-[65%] -translate-x-1/2 -translate-y-1/2 w-4 h-4 bg-[var(--bg-secondary)] border-2 border-lavender rounded-xl flex items-center justify-center transition-colors">
                                    <div className="w-1 h-1 bg-lavender rounded-full" />
                                </div>
                            </div>
                            <span className="text-[10px] font-bold text-[var(--text-secondary)] uppercase truncate max-w-[100px] transition-colors">{selectedShipment?.destination.address.split(',')[0]}</span>
                        </div>
                    </div>

                    <div className="bg-[var(--bg-secondary)] border border-[var(--border-color)] rounded-3xl p-6 shadow-xl flex flex-col h-full transition-colors">
                        <div className="flex items-center justify-between mb-6 shrink-0">
                            <h3 className="text-base font-bold text-[var(--text-primary)] tracking-tight font-display transition-colors">Related Documents</h3>
                            <button className="p-1 text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors"><Plus className="w-4 h-4" /></button>
                        </div>
                        <div className="space-y-3 flex-1 overflow-y-auto scrollbar-hide">
                            <div className="flex items-center justify-between bg-[var(--bg-primary)] p-4 rounded-xl border border-[var(--border-color)] hover:border-zinc-700 transition-all cursor-pointer group">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 bg-[var(--bg-secondary)] rounded-lg flex items-center justify-center transition-colors">
                                        <FileText className="w-5 h-5 text-[var(--text-secondary)] group-hover:text-lavender transition-colors" />
                                    </div>
                                    <div>
                                        <p className="text-sm font-bold text-[var(--text-primary)] transition-colors">Travel_document.pdf</p>
                                        <p className="text-[10px] text-[var(--text-secondary)] font-medium transition-colors">2.5 mbps • Uploaded 12/24</p>
                                    </div>
                                </div>
                                <ChevronDown className="w-4 h-4 text-[var(--text-secondary)]" />
                            </div>
                            <div className="flex items-center justify-between bg-[var(--bg-primary)] p-4 rounded-xl border border-[var(--border-color)] hover:border-zinc-700 transition-all cursor-pointer group">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 bg-[var(--bg-secondary)] rounded-lg flex items-center justify-center transition-colors">
                                        <FileText className="w-5 h-5 text-[var(--text-secondary)] group-hover:text-lavender transition-colors" />
                                    </div>
                                    <div>
                                        <p className="text-sm font-bold text-[var(--text-primary)] transition-colors">Load_info_2025.pdf</p>
                                        <p className="text-[10px] text-[var(--text-secondary)] font-medium transition-colors">1.7 mbps • Uploaded 12/23</p>
                                    </div>
                                </div>
                                <ChevronDown className="w-4 h-4 text-[var(--text-secondary)]" />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ManageCargo;
