import { useRef, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useShipments } from '../context/ShipmentContext';
import { useSettings } from '../context/SettingsContext';
import {
    Truck, AlertTriangle, CheckCircle, Clock,
    Search, Calendar, Download, Plus,
    ArrowUpRight, MoreHorizontal, ChevronRight, Package, Box
} from 'lucide-react';
import toast, { Toaster } from 'react-hot-toast';
import { io } from 'socket.io-client';
import {
    LineChart, Line, XAxis, YAxis, CartesianGrid,
    Tooltip, ResponsiveContainer, AreaChart, Area
} from 'recharts';
import clsx from 'clsx';

const chartData = [
    { name: '1', value: 180 },
    { name: '4', value: 250 },
    { name: '7', value: 310 },
    { name: '10', value: 280 },
    { name: '13', value: 380 },
    { name: '16', value: 320 },
    { name: '19', value: 450 },
    { name: '22', value: 380 },
    { name: '25', value: 480 },
];

const Dashboard = () => {
    const navigate = useNavigate();
    const { shipments, loading } = useShipments();
    const { settings } = useSettings();
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedShipment, setSelectedShipment] = useState(null);

    useEffect(() => {
        if (shipments.length > 0 && !selectedShipment) {
            setSelectedShipment(shipments[0]);
        }
    }, [shipments, selectedShipment]);

    if (loading) return <div className="h-full flex items-center justify-center p-8"><div className="w-12 h-12 border-4 border-[#00E5FF] border-t-transparent rounded-full animate-spin"></div></div>;

    const stats = [
        { label: 'Total shipment', value: '19,329', items: '758 items', icon: Package, color: 'text-purple-500', bg: 'bg-purple-500/10' },
        { label: 'In transit', value: '12,000', items: null, icon: Box, color: 'text-emerald-500', bg: 'bg-emerald-500/10' },
        { label: 'Pending packages', value: '345', items: null, icon: Clock, color: 'text-amber-500', bg: 'bg-amber-500/10' },
        { label: 'Delivered', value: '7,000', items: '45 items', icon: CheckCircle, color: 'text-blue-500', bg: 'bg-blue-500/10' },
    ];

    const getTrackingSteps = (shipment) => {
        if (!shipment) return [];
        return [
            { status: 'Checking', time: '12:35', active: shipment.status !== 'Delivered' },
            { status: 'In Transit', time: '02:00', active: shipment.status === 'In Transit' },
            { status: 'Out for Delivery', time: '12:00 (Nov 2, 2025)', active: shipment.status === 'Delivered' },
        ];
    };

    const handleNext = () => {
        if (shipments.length === 0) return;
        const currentIndex = shipments.findIndex(s => s._id === selectedShipment?._id);
        const nextIndex = (currentIndex + 1) % shipments.length;
        setSelectedShipment(shipments[nextIndex]);
    };

    const handlePrev = () => {
        if (shipments.length === 0) return;
        const currentIndex = shipments.findIndex(s => s._id === selectedShipment?._id);
        const prevIndex = (currentIndex - 1 + shipments.length) % shipments.length;
        setSelectedShipment(shipments[prevIndex]);
    };

    return (
        <div className="h-full flex flex-col gap-8 p-2 overflow-y-auto scrollbar-hide">
            <Toaster />

            {/* Header Section */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mt-2">
                <div>
                    <h2 className="text-[10px] font-black text-zinc-500 uppercase tracking-widest mb-1">Hello Admin,</h2>
                    <h1 className="text-4xl font-display font-black text-white tracking-tighter">
                        {(() => {
                            const hour = new Date().getHours();
                            if (hour >= 5 && hour < 12) return 'Good Morning';
                            if (hour >= 12 && hour < 17) return 'Good Afternoon';
                            if (hour >= 17 && hour < 21) return 'Good Evening';
                            return 'Good Night';
                        })()}
                    </h1>
                </div>
                <div className="flex items-center gap-3">
                    <div className="flex items-center bg-[var(--bg-secondary)] border border-[var(--border-color)] rounded-xl px-4 py-2.5 transition-colors">
                        <span className="text-[10px] font-black text-[var(--text-secondary)] uppercase tracking-widest mr-4">Timeframe</span>
                        <select className="bg-transparent text-xs font-bold text-[var(--text-primary)] outline-none cursor-pointer">
                            <option>Feb 2025</option>
                            <option>Jan 2025</option>
                        </select>
                    </div>
                    <button
                        onClick={() => toast.success('Shipment data exported successfully!')}
                        className="flex items-center gap-2 bg-[var(--bg-secondary)] border border-[var(--border-color)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] px-5 py-2.5 rounded-xl font-black uppercase tracking-widest text-[10px] transition-all"
                    >
                        <Download className="w-4 h-4" />
                        Export CSV
                    </button>
                    <button
                        onClick={() => navigate('/manage')}
                        className="flex items-center gap-2 bg-[#00E5FF] hover:bg-[#00E5FF]/90 text-[#000000] px-6 py-2.5 rounded-xl font-black uppercase tracking-widest text-[10px] transition-all shadow-glow"
                    >
                        <Plus className="w-4 h-4" />
                        Add new shipment
                    </button>
                </div>
            </div>

            {/* Stats Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                {stats.map((stat, i) => (
                    <div key={i} className="bg-[var(--bg-secondary)] border border-[var(--border-color)] rounded-[32px] p-8 shadow-xl relative overflow-hidden group hover:border-zinc-700 transition-colors">
                        <div className={clsx("w-12 h-12 rounded-2xl flex items-center justify-center mb-6", stat.bg)}>
                            <stat.icon className={clsx("w-6 h-6", stat.color)} />
                        </div>
                        <p className="text-[10px] font-black text-[var(--text-secondary)] uppercase tracking-widest mb-2">{stat.label}</p>
                        <div className="flex items-baseline gap-3">
                            <h3 className="text-3xl font-black text-[var(--text-primary)] font-display tracking-tight">{stat.value}</h3>
                            {stat.items && (
                                <span className="text-[10px] font-black text-blue-400 flex items-center gap-1">
                                    <div className="w-1.5 h-1.5 rounded-full bg-blue-500" />
                                    {stat.items}
                                </span>
                            )}
                        </div>
                        <div className={clsx("absolute -bottom-4 -right-4 w-24 h-24 blur-3xl opacity-10 group-hover:opacity-20 transition-opacity", stat.bg.split(' ')[0])} />
                    </div>
                ))}
            </div>

            {/* Middle Section: Chart & Live Tracking */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Chart Section */}
                <div className="lg:col-span-2 bg-[var(--bg-secondary)] border border-[var(--border-color)] rounded-[32px] p-8 shadow-xl transition-colors">
                    <div className="flex items-center justify-between mb-8">
                        <h3 className="text-xl font-black text-[var(--text-primary)] font-display tracking-tight">Shipment Over Time</h3>
                        <div className="flex items-center bg-[var(--bg-primary)] px-3 py-1.5 rounded-lg border border-[var(--border-color)] transition-colors">
                            <Calendar className="w-3.5 h-3.5 text-[var(--text-secondary)] mr-2" />
                            <span className="text-[10px] font-black text-[var(--text-secondary)] uppercase tracking-widest">Feb 2025</span>
                        </div>
                    </div>
                    <div className="h-[300px] w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={chartData}>
                                <defs>
                                    <linearGradient id="colorVal" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#00E5FF" stopOpacity={0.2} />
                                        <stop offset="95%" stopColor="#00E5FF" stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" stroke="#1c1c1f" vertical={false} />
                                <XAxis
                                    dataKey="name"
                                    stroke="#52525b"
                                    fontSize={10}
                                    tickLine={false}
                                    axisLine={false}
                                    dy={10}
                                />
                                <YAxis
                                    stroke="#52525b"
                                    fontSize={10}
                                    tickLine={false}
                                    axisLine={false}
                                    dx={-10}
                                />
                                <Tooltip
                                    contentStyle={{ background: '#121214', border: '1px solid #27272a', borderRadius: '12px' }}
                                    itemStyle={{ color: '#00E5FF', fontSize: '12px', fontWeight: 'bold' }}
                                />
                                <Area
                                    type="monotone"
                                    dataKey="value"
                                    stroke="#00E5FF"
                                    strokeWidth={3}
                                    fillOpacity={1}
                                    fill="url(#colorVal)"
                                />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Live Tracking Timeline Section */}
                <div className="bg-[var(--bg-secondary)] border border-[var(--border-color)] rounded-[32px] p-8 shadow-xl relative overflow-hidden flex flex-col transition-colors">
                    <div className="flex items-center justify-between mb-8">
                        <h3 className="text-xl font-black text-[var(--text-primary)] font-display tracking-tight">Live Tracking</h3>
                        <div className="flex gap-2">
                            <button
                                onClick={handlePrev}
                                className="p-2 bg-[var(--bg-primary)] rounded-lg border border-[var(--border-color)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-all"
                            >
                                <ChevronRight className="w-4 h-4 rotate-180" />
                            </button>
                            <button
                                onClick={handleNext}
                                className="p-2 bg-[var(--bg-primary)] rounded-lg border border-[var(--border-color)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-all"
                            >
                                <ChevronRight className="w-4 h-4" />
                            </button>
                        </div>
                    </div>

                    <div className="space-y-1 mb-10 relative z-10">
                        <p className="text-[10px] font-black text-[var(--text-secondary)] uppercase tracking-widest">Tracking Number:</p>
                        <p className="text-2xl font-black text-[var(--text-primary)] font-mono break-all tracking-tight uppercase">
                            {selectedShipment?.shipmentId || '#---'}
                        </p>
                    </div>

                    <div className="space-y-10 relative flex-1">
                        {/* Perfect Alignment for the Vertical Line */}
                        <div className="absolute left-[9px] top-2 bottom-2 w-[2px] bg-zinc-800" />

                        {getTrackingSteps(selectedShipment).map((step, i) => (
                            <div key={i} className="flex justify-between items-center relative z-10 pl-10">
                                {/* Circle perfectly centered on the line */}
                                <div className={clsx(
                                    "absolute left-0 top-1/2 -translate-y-1/2 w-5 h-5 rounded-full border-2 transition-all duration-500",
                                    step.active
                                        ? "bg-[var(--bg-primary)] border-accent shadow-glow scale-110"
                                        : "bg-zinc-800 border-zinc-700 opacity-40"
                                )} />
                                <span className={clsx(
                                    "text-sm font-black uppercase tracking-wide transition-colors",
                                    step.active ? "text-[var(--text-primary)]" : "text-[var(--text-secondary)]"
                                )}>
                                    {step.status}
                                </span>
                                <span className="text-[10px] font-black text-[var(--text-secondary)] uppercase">{step.time}</span>
                            </div>
                        ))}
                    </div>

                    <button
                        onClick={() => navigate('/tracking')}
                        className="w-full mt-10 py-5 bg-accent text-[#000000] font-black uppercase tracking-widest text-[11px] rounded-2xl shadow-glow hover:scale-[1.02] active:scale-95 transition-all"
                    >
                        Track this order
                    </button>

                    {/* Enhanced Wavy SVG Pattern */}
                    <div className="absolute top-20 right-0 w-full h-1/2 opacity-[0.05] pointer-events-none overflow-hidden scale-150 origin-top-right">
                        <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
                            <path d="M0,50 C20,40 40,60 60,50 C80,40 100,60 120,50" fill="none" stroke="white" strokeWidth="0.5" />
                            <path d="M0,60 C20,50 40,70 60,60 C80,50 100,70 120,60" fill="none" stroke="white" strokeWidth="0.5" />
                            <path d="M0,70 C20,60 40,80 60,70 C80,60 100,80 120,70" fill="none" stroke="white" strokeWidth="0.5" />
                        </svg>
                    </div>
                </div>
            </div>

            {/* Bottom Section: Incoming Orders Table */}
            <div className="bg-[var(--bg-secondary)] border border-[var(--border-color)] rounded-[32px] overflow-hidden shadow-xl mb-12 transition-colors">
                <div className="p-8 border-b border-[var(--border-color)] flex items-center justify-between">
                    <h3 className="text-xl font-black text-[var(--text-primary)] font-display tracking-tight">Incoming Orders</h3>
                    <div className="relative">
                        <input
                            type="text"
                            placeholder="Find order ID..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="bg-[var(--bg-primary)] border border-[var(--border-color)] rounded-xl py-2.5 pl-11 pr-4 text-xs text-[var(--text-primary)] focus:outline-none focus:border-accent/50 transition-all w-64"
                        />
                        <Search className="w-4 h-4 absolute left-4 top-1/2 -translate-y-1/2 text-[var(--text-secondary)]" />
                    </div>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-[#1c1c1f]/50 text-[10px] font-black text-zinc-500 uppercase tracking-[0.2em]">
                                <th className="px-8 py-4 w-12"><input type="checkbox" className="rounded bg-zinc-800 border-zinc-700" /></th>
                                <th className="px-8 py-4">Processing Status</th>
                                <th className="px-8 py-4">Ship Status</th>
                                <th className="px-8 py-4">Pro. Date</th>
                                <th className="px-8 py-4">Order Number</th>
                                <th className="px-8 py-4">Name</th>
                                <th className="px-8 py-4">Carrier</th>
                                <th className="px-8 py-4 text-right">Action</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-[#27272a]">
                            {shipments.filter(s => s.shipmentId.toLowerCase().includes(searchTerm.toLowerCase())).map((s, idx) => (
                                <tr
                                    key={s._id}
                                    onClick={() => setSelectedShipment(s)}
                                    className={clsx(
                                        "hover:bg-[#1c1c1f] cursor-pointer transition-all duration-300 group",
                                        selectedShipment?._id === s._id ? "bg-accent/5" : ""
                                    )}
                                >
                                    <td className="px-8 py-6 border-transparent"><input type="checkbox" className="rounded bg-black border-zinc-700" /></td>
                                    <td className="px-8 py-6">
                                        <span className="text-[11px] font-bold text-zinc-400 uppercase tracking-tight">Ready to process</span>
                                    </td>
                                    <td className="px-8 py-6">
                                        <div className={clsx(
                                            "inline-flex items-center gap-2 px-3 py-1.5 rounded-xl text-[9px] font-black uppercase tracking-[0.1em] border transition-all",
                                            s.status === 'Delayed' ? "bg-red-500/10 text-red-500 border-red-500/20" :
                                                s.status === 'In Transit' ? "bg-amber-500/10 text-amber-500 border-amber-500/20" :
                                                    "bg-emerald-500/10 text-emerald-500 border-emerald-500/20"
                                        )}>
                                            <div className={clsx("w-1.5 h-1.5 rounded-full shadow-glow", s.status === 'Delayed' ? "bg-red-500" : s.status === 'In Transit' ? "bg-amber-500" : "bg-emerald-500")} />
                                            {s.status}
                                        </div>
                                    </td>
                                    <td className="px-8 py-6 text-[11px] font-black text-zinc-500 uppercase">08/02/2025</td>
                                    <td className="px-8 py-6 text-[11px] font-black text-[var(--text-primary)] font-mono uppercase tracking-tight group-hover:text-accent transition-colors">
                                        {s.shipmentId}
                                    </td>
                                    <td className="px-8 py-6 text-[11px] font-black text-[var(--text-secondary)] uppercase tracking-tight">Client {idx + 1}</td>
                                    <td className="px-8 py-6">
                                        <div className="flex items-center gap-3">
                                            <div className="w-8 h-8 rounded-lg bg-[var(--bg-primary)] flex items-center justify-center p-1.5 border border-[var(--border-color)] group-hover:border-accent/40 transition-colors">
                                                <Truck className="w-full h-full text-accent" />
                                            </div>
                                            <span className="text-[11px] font-black text-[var(--text-secondary)] uppercase tracking-widest">{s.carrier}</span>
                                        </div>
                                    </td>
                                    <td className="px-8 py-6 text-right">
                                        <div className="flex items-center justify-end gap-3 opacity-0 group-hover:opacity-100 transition-all duration-300">
                                            <button className="p-2.5 hover:bg-zinc-800 rounded-xl text-zinc-500 hover:text-accent transition-all"><ChevronRight className="w-4 h-4" /></button>
                                            <button className="p-2.5 hover:bg-zinc-800 rounded-xl text-zinc-500 hover:text-white transition-all"><MoreHorizontal className="w-4 h-4" /></button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
