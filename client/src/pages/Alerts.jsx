import { useState, useEffect } from 'react';
import api from '../services/api';
import { Bell, Clock, AlertTriangle, Info, Trash2 } from 'lucide-react';
import { format } from 'date-fns';
import clsx from 'clsx';

const Alerts = () => {
    const [alerts, setAlerts] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchAlerts = async () => {
        try {
            const { data } = await api.get('/alerts?limit=200');
            setAlerts(data);
            setLoading(false);
        } catch (error) {
            console.error('Failed to fetch alerts', error);
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchAlerts();

        // Refresh every 10 seconds
        const interval = setInterval(fetchAlerts, 10000);
        return () => clearInterval(interval);
    }, []);

    const clearAllAlerts = async () => {
        if (window.confirm('Clear all alerts?')) {
            try {
                await api.delete('/alerts');
                setAlerts([]);
            } catch (error) {
                alert('Failed to clear alerts');
            }
        }
    };

    const getIcon = (type) => {
        switch (type) {
            case 'location_update': return <Clock className="w-5 h-5" />;
            case 'delay': return <AlertTriangle className="w-5 h-5" />;
            default: return <Info className="w-5 h-5" />;
        }
    };

    if (loading) {
        return <div className="h-full flex items-center justify-center p-8"><div className="w-12 h-12 border-4 border-[#00E5FF] border-t-transparent rounded-full animate-spin"></div></div>;
    }

    return (
        <div className="h-full flex flex-col p-2">
            <div className="flex justify-between items-center mb-10 px-6 pt-4">
                <div>
                    <h1 className="text-4xl font-display font-black flex items-center text-[var(--text-primary)] tracking-tighter">
                        <Bell className="w-8 h-8 mr-4 text-accent" />
                        System Alerts
                    </h1>
                    <p className="text-[var(--text-secondary)] mt-2 font-medium tracking-tight">Monitoring {alerts.length} active telemetry events across the fleet</p>
                </div>
                <button
                    onClick={clearAllAlerts}
                    className="bg-red-500/10 hover:bg-red-500/20 text-red-500 border border-red-500/20 px-8 py-3.5 rounded-2xl flex items-center gap-2 transition-all font-black uppercase tracking-widest text-[10px]"
                >
                    <Trash2 className="w-4 h-4" />
                    Clear History
                </button>
            </div>

            <div className="flex-1 overflow-y-auto px-6 pb-24 space-y-4 scrollbar-hide">
                {alerts.length === 0 ? (
                    <div className="bg-[var(--bg-secondary)] border border-[var(--border-color)] rounded-[32px] p-20 text-center shadow-xl transition-colors">
                        <div className="bg-[var(--bg-primary)] w-24 h-24 rounded-[30px] flex items-center justify-center mx-auto mb-8 border border-[var(--border-color)] shadow-inner transition-colors">
                            <Bell className="w-10 h-10 text-[var(--text-secondary)]" />
                        </div>
                        <h3 className="text-2xl font-black text-[var(--text-primary)] mb-3 font-display tracking-tight transition-colors">No Active Alerts</h3>
                        <p className="text-[var(--text-secondary)] max-w-md mx-auto font-medium transition-colors">System is running within nominal parameters. Fleet telemetry is stable.</p>
                    </div>
                ) : (
                    alerts.map(alert => (
                        <div
                            key={alert._id}
                            className={clsx(
                                "p-6 rounded-[32px] border transition-all duration-300 group relative overflow-hidden",
                                alert.severity === 'critical'
                                    ? "bg-red-500/5 border-red-500/20 hover:border-red-500/40"
                                    : alert.severity === 'warning'
                                        ? "bg-amber-500/5 border-amber-500/20 hover:border-amber-500/40"
                                        : "bg-[var(--bg-secondary)] border-[var(--border-color)] hover:border-accent/30"
                            )}
                        >
                            <div className="flex items-start justify-between relative z-10">
                                <div className="flex items-start gap-6 flex-1">
                                    <div className={clsx(
                                        "p-4 rounded-2xl border transition-colors",
                                        alert.severity === 'critical' ? 'bg-red-500/10 border-red-500/20 text-red-500' :
                                            alert.severity === 'warning' ? 'bg-amber-500/10 border-amber-500/20 text-amber-500' :
                                                'bg-accent/10 border-accent/20 text-accent'
                                    )}>
                                        {getIcon(alert.type)}
                                    </div>
                                    <div className="flex-1">
                                        <div className="flex items-center gap-3 mb-2">
                                            <span className="font-black text-[var(--text-primary)] text-lg tracking-tight font-display transition-colors">{alert.shipmentId}</span>
                                            <span className={clsx(
                                                "text-[9px] px-3 py-1 rounded-full uppercase tracking-[0.2em] font-black transition-colors",
                                                alert.severity === 'critical' ? "bg-red-500/20 text-red-500" : "bg-[var(--bg-primary)] text-[var(--text-secondary)]"
                                            )}>
                                                {alert.type.replace('_', ' ')}
                                            </span>
                                        </div>
                                        <p className="text-[var(--text-secondary)] font-medium leading-normal tracking-tight max-w-3xl transition-colors">{alert.message}</p>
                                    </div>
                                </div>
                                <div className="text-right pl-6 border-l border-[var(--border-color)] min-w-[120px] transition-colors">
                                    <span className="text-sm font-black text-[var(--text-primary)] block mb-1">
                                        {alert.createdAt && format(new Date(alert.createdAt), 'HH:mm')}
                                    </span>
                                    <span className="text-[10px] text-[var(--text-secondary)] uppercase font-black tracking-widest text-right block">
                                        {alert.createdAt && format(new Date(alert.createdAt), 'MMM dd')}
                                    </span>
                                </div>
                            </div>

                            {alert.severity === 'critical' && (
                                <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-red-500/10 blur-[60px] rounded-full pointer-events-none" />
                            )}
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};

export default Alerts;
