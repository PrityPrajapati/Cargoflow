import { useNavigate } from 'react-router-dom';
import { Truck, Globe, BarChart3, Shield, ArrowRight, MapPin, Clock, Users, Activity } from 'lucide-react';

const Overview = () => {
    const navigate = useNavigate();

    return (
        <div className="min-h-full overflow-x-hidden relative bg-[var(--bg-primary)] transition-colors">
            {/* Hero Section */}
            <div className="relative pt-20 pb-32 px-8">
                {/* Background Decor */}
                <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
                    <div className="absolute top-[-10%] right-[20%] w-[800px] h-[800px] bg-accent/5 rounded-full blur-[120px] animate-pulse" style={{ animationDuration: '6s' }}></div>
                    <div className="absolute bottom-[-10%] left-[-10%] w-[600px] h-[600px] bg-accent/5 rounded-full blur-[100px]"></div>
                </div>

                <div className="relative max-w-7xl mx-auto text-center z-10">
                    <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[var(--bg-secondary)] border border-[var(--border-color)] backdrop-blur-sm mb-8 animate-fade-in-up transition-colors">
                        <span className="w-2 h-2 rounded-full bg-accent animate-pulse shadow-[0_0_8px_#00E5FF]"></span>
                        <span className="text-[10px] font-black text-[var(--text-secondary)] tracking-widest uppercase">Global Network Operational</span>
                    </div>

                    <h1 className="text-8xl font-display font-black mb-8 tracking-tighter leading-[0.9] text-[var(--text-primary)]">
                        LOGISTICS,
                        <br />
                        <span className="text-accent drop-shadow-[0_0_15px_rgba(0,229,255,0.3)]">
                            REIMAGINED.
                        </span>
                    </h1>

                    <p className="text-lg text-[var(--text-secondary)] max-w-2xl mx-auto mb-12 font-medium leading-relaxed tracking-tight transition-colors">
                        Experience individual cargo tracking with enterprise-grade precision.
                        Real-time telemetry, predictive analytics, and seamless global coverage in a redefined interface.
                    </p>

                    <div className="flex items-center justify-center gap-6">
                        <button
                            onClick={() => navigate('/dashboard')}
                            className="group relative px-10 py-4 bg-accent hover:bg-accent/90 text-[#000000] rounded-2xl font-black uppercase tracking-widest text-xs transition-all duration-300 shadow-[0_10px_40px_rgba(0,229,255,0.2)] hover:scale-[1.02]"
                        >
                            Launch Dashboard
                        </button>
                        <a
                            href="https://www.youtube.com/watch?v=x9PQgbB4y6M"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="px-10 py-4 rounded-2xl font-black uppercase tracking-widest text-xs text-[var(--text-secondary)] hover:text-[var(--text-primary)] border border-[var(--border-color)] hover:bg-[var(--bg-secondary)] transition-all duration-300 flex items-center justify-center"
                        >
                            Watch Demo
                        </a>
                    </div>
                </div>
            </div>

            {/* Stats Panel */}
            <div className="max-w-7xl mx-auto px-8 mb-24 relative z-10">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                    {[
                        { label: 'Active Shipments', value: '842', trend: '+12%', icon: Truck, color: 'text-accent', bg: 'bg-accent/10' },
                        { label: 'Global Hubs', value: '15', trend: 'Active', icon: Globe, color: 'text-emerald-400', bg: 'bg-emerald-400/10' },
                        { label: 'Uptime', value: '99.9%', trend: 'Stable', icon: Activity, color: 'text-lavender', bg: 'bg-lavender/10' },
                        { label: 'Total Value', value: '$2.4B', trend: 'YTD', icon: Shield, color: 'text-amber-400', bg: 'bg-amber-400/10' },
                    ].map((stat, i) => (
                        <div key={i} className="group p-8 rounded-[32px] bg-[var(--bg-secondary)] border border-[var(--border-color)] hover:border-accent/30 transition-all duration-500 hover:shadow-2xl relative overflow-hidden">
                            <div className="relative z-10">
                                <p className="text-[var(--text-secondary)] font-black text-[10px] uppercase tracking-[0.2em] mb-4">{stat.label}</p>
                                <div className="flex items-center justify-between">
                                    <h3 className="text-4xl font-black text-[var(--text-primary)] font-display tracking-tighter">{stat.value}</h3>
                                    <div className={`p-3 rounded-2xl ${stat.bg} ${stat.color}`}>
                                        <stat.icon className="w-6 h-6" />
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Features Section */}
            <div className="max-w-7xl mx-auto px-8 pb-32">
                <div className="grid md:grid-cols-3 gap-8">
                    {[
                        { title: 'Real-Time Telemetry', desc: 'Live GPS tracking with 30s update intervals and route prediction.', icon: Clock },
                        { title: 'Global Coverage', desc: 'Seamless tracking across 15+ major international logistics hubs.', icon: Globe },
                        { title: 'Secure Protocol', desc: 'End-to-end encryption for all sensitive cargo and crew data.', icon: Shield },
                    ].map((feature, i) => (
                        <div key={i} className="relative group p-10 rounded-[40px] bg-[var(--bg-secondary)] border border-[var(--border-color)] hover:border-accent/20 transition-all duration-500">
                            <div className="relative z-10">
                                <div className="w-16 h-16 rounded-[20px] bg-[var(--bg-primary)] border border-[var(--border-color)] flex items-center justify-center mb-8 text-accent group-hover:scale-110 transition-transform duration-500 shadow-xl">
                                    <feature.icon className="w-8 h-8" />
                                </div>
                                <h3 className="text-2xl font-black text-[var(--text-primary)] mb-4 font-display tracking-tight transition-colors">{feature.title}</h3>
                                <p className="text-[var(--text-secondary)] font-medium leading-relaxed tracking-tight group-hover:text-[var(--text-primary)]/80 transition-colors">
                                    {feature.desc}
                                </p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default Overview;
