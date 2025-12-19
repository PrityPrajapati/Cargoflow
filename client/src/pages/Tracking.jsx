import ShipmentMap from '../components/ShipmentMap';

const Tracking = () => {
    return (
        <div className="h-full flex flex-col gap-6 p-2">
            <div className="flex items-center justify-between px-4 pt-2">
                <div>
                    <h1 className="text-3xl font-display font-black text-white tracking-tighter uppercase">Live Network Tracking</h1>
                    <p className="text-zinc-500 font-bold text-xs uppercase tracking-widest mt-1">Global fleet telemetry visualization</p>
                </div>
                <div className="flex gap-4">
                    <div className="bg-[#121214] border border-[#27272a] rounded-xl px-4 py-2 flex items-center gap-3">
                        <div className="w-2 h-2 rounded-full bg-accent animate-pulse shadow-glow" />
                        <span className="text-[10px] font-black text-zinc-300 uppercase tracking-widest">Live Streams Active</span>
                    </div>
                </div>
            </div>

            <div className="flex-1 bg-[#121214] border border-[#27272a] rounded-[40px] overflow-hidden shadow-2xl relative">
                <ShipmentMap />

                {/* Floating overlay info */}
                <div className="absolute bottom-10 left-10 z-[600] pointer-events-none">
                    <div className="bg-[#1c1c1f]/90 backdrop-blur-xl border border-[#27272a] p-6 rounded-[32px] shadow-2xl pointer-events-auto">
                        <p className="text-[10px] font-black text-zinc-500 uppercase tracking-widest mb-3">Map Legend</p>
                        <div className="space-y-3">
                            <div className="flex items-center gap-3 text-white">
                                <div className="w-3 h-3 rounded-full bg-accent" />
                                <span className="text-xs font-bold uppercase tracking-tight">Active Vessel</span>
                            </div>
                            <div className="flex items-center gap-3 text-white">
                                <div className="w-3 h-3 rounded-full bg-red-500" />
                                <span className="text-xs font-bold uppercase tracking-tight">Delayed / Alert</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Tracking;
