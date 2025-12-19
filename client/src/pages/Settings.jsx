import { useState } from 'react';
import { Moon, Sun, Monitor, Globe, Bell, User, Palette, Zap, Save } from 'lucide-react';
import useAuth from '../hooks/useAuth';
import { useSettings } from '../context/SettingsContext';
import clsx from 'clsx';

const Settings = () => {
    const { user } = useAuth();
    const { settings, updateSettings } = useSettings();
    const [saved, setSaved] = useState(false);

    const handleUpdate = (key, value) => {
        updateSettings({ [key]: value });
        setSaved(true);
        setTimeout(() => setSaved(false), 2000);
    };

    return (
        <div className="h-full overflow-y-auto px-6 pb-24 pt-4 scrollbar-hide transition-colors">
            <div className="flex justify-between items-center mb-10">
                <div>
                    <h1 className="text-4xl font-display font-black text-[var(--text-primary)] tracking-tighter">System Settings</h1>
                    <p className="text-[var(--text-secondary)] mt-2 font-medium tracking-tight">Customize your cargo flow environment</p>
                </div>
                {saved && (
                    <div className="px-5 py-2.5 bg-accent/10 border border-accent/20 text-accent rounded-2xl text-xs font-black uppercase tracking-widest flex items-center gap-2 animate-fade-in-up shadow-glow">
                        <Save className="w-4 h-4" />
                        Settings Saved
                    </div>
                )}
            </div>

            <div className="grid gap-8 max-w-5xl">
                {/* Account Section */}
                <div className="bg-[var(--bg-secondary)] border border-[var(--border-color)] rounded-[32px] p-8 shadow-xl relative overflow-hidden group transition-colors">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-accent/5 rounded-full blur-[100px] group-hover:bg-accent/10 transition-all duration-500"></div>
                    <div className="flex items-center gap-8 relative z-10">
                        <div className="w-24 h-24 rounded-3xl bg-gradient-to-tr from-accent to-teal-500 p-0.5 shadow-2xl flex-shrink-0">
                            <div className="w-full h-full bg-[var(--bg-secondary)] rounded-[22px] flex items-center justify-center text-3xl font-black text-[var(--text-primary)] transition-colors">
                                {user?.name?.substring(0, 2).toUpperCase()}
                            </div>
                        </div>
                        <div>
                            <p className="text-[10px] font-black text-[var(--text-secondary)] uppercase tracking-widest mb-1">Authenticated Operator</p>
                            <p className="text-3xl font-black text-[var(--text-primary)] font-display tracking-tight transition-colors">{user?.name}</p>
                            <p className="text-[var(--text-secondary)] font-medium text-sm mt-1">{user?.email}</p>
                            <div className="flex items-center gap-3 mt-4">
                                <span className="inline-flex items-center px-4 py-1.5 bg-accent/10 rounded-xl text-[10px] font-black text-accent border border-accent/20 uppercase tracking-[0.2em]">
                                    {user?.role}
                                </span>
                                <span className="text-[10px] font-bold text-[var(--text-secondary)] uppercase tracking-widest">ID: {user?._id?.substring(0, 8)}</span>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="grid md:grid-cols-2 gap-8">
                    {/* Theme Preferences */}
                    <div className="bg-[var(--bg-secondary)] border border-[var(--border-color)] rounded-[32px] p-8 shadow-xl transition-colors">
                        <h2 className="text-xl font-black mb-8 flex items-center font-display text-[var(--text-primary)] tracking-tight transition-colors">
                            <Palette className="w-6 h-6 mr-3 text-lavender" />
                            Interface Theme
                        </h2>

                        <div className="grid grid-cols-1 gap-4">
                            {['light', 'dark', 'auto'].map(theme => (
                                <button
                                    key={theme}
                                    onClick={() => handleUpdate('theme', theme)}
                                    className={clsx(
                                        "flex items-center justify-between px-6 py-4 rounded-2xl transition-all duration-300 border font-black uppercase tracking-widest text-[10px]",
                                        settings.theme === theme
                                            ? "bg-accent text-[#000000] border-transparent shadow-glow"
                                            : "bg-[var(--bg-primary)] border-[var(--border-color)] text-[var(--text-secondary)] hover:border-zinc-600 hover:text-[var(--text-primary)]"
                                    )}
                                >
                                    <div className="flex items-center gap-4">
                                        {theme === 'light' && <Sun className="w-4 h-4" />}
                                        {theme === 'dark' && <Moon className="w-4 h-4" />}
                                        {theme === 'auto' && <Monitor className="w-4 h-4" />}
                                        <span>{theme} mode</span>
                                    </div>
                                    {settings.theme === theme && <div className="w-1.5 h-1.5 rounded-full bg-[#000000]" />}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Map Visualization */}
                    <div className="bg-[var(--bg-secondary)] border border-[var(--border-color)] rounded-[32px] p-8 shadow-xl transition-colors">
                        <h2 className="text-xl font-black mb-8 flex items-center font-display text-[var(--text-primary)] tracking-tight transition-colors">
                            <Globe className="w-6 h-6 mr-3 text-accent" />
                            Map Visualization
                        </h2>

                        <div className="space-y-6">
                            <div>
                                <label className="text-[10px] font-black text-[var(--text-secondary)] uppercase tracking-widest mb-3 block px-1">Base Map Layer</label>
                                <select
                                    value={settings.mapStyle}
                                    onChange={e => handleUpdate('mapStyle', e.target.value)}
                                    className="w-full bg-[var(--bg-primary)] border border-[var(--border-color)] rounded-2xl px-5 py-4 text-xs text-[var(--text-primary)] font-bold focus:outline-none focus:border-accent/50 appearance-none transition-all"
                                >
                                    <option value="dark">Dark Matter (Vector)</option>
                                    <option value="light">Positron (Clean)</option>
                                    <option value="satellite">Satellite Imagery</option>
                                    <option value="terrain">Topographic Terrain</option>
                                </select>
                            </div>

                            <div>
                                <label className="text-[10px] font-black text-[var(--text-secondary)] uppercase tracking-widest mb-3 block px-1">Marker Scaling</label>
                                <div className="flex bg-[var(--bg-primary)] rounded-2xl p-1.5 border border-[var(--border-color)] transition-colors">
                                    {['small', 'normal', 'large'].map(size => (
                                        <button
                                            key={size}
                                            onClick={() => handleUpdate('markerSize', size)}
                                            className={clsx(
                                                "flex-1 py-2.5 text-[10px] font-black uppercase tracking-widest rounded-xl transition-all duration-300",
                                                settings.markerSize === size
                                                    ? "bg-accent text-[#000000] shadow-sm"
                                                    : "text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
                                            )}
                                        >
                                            {size}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* System Controls */}
                <div className="bg-[var(--bg-secondary)] border border-[var(--border-color)] rounded-[32px] p-8 shadow-xl transition-colors">
                    <h2 className="text-xl font-black mb-8 flex items-center font-display text-[var(--text-primary)] tracking-tight transition-colors">
                        <Zap className="w-6 h-6 mr-3 text-amber-400" />
                        System Performance
                    </h2>

                    <div className="grid md:grid-cols-2 gap-12">
                        <div>
                            <div className="flex justify-between mb-4 px-1">
                                <label className="text-[10px] font-black text-[var(--text-secondary)] uppercase tracking-widest">Polling Interval</label>
                                <span className="text-accent font-black text-sm">{settings.refreshInterval}s</span>
                            </div>
                            <input
                                type="range"
                                min="10"
                                max="60"
                                step="5"
                                value={settings.refreshInterval}
                                onChange={e => handleUpdate('refreshInterval', parseInt(e.target.value))}
                                className="w-full h-1.5 bg-[var(--bg-primary)] rounded-full appearance-none cursor-pointer accent-accent"
                            />
                            <p className="text-[10px] text-zinc-600 mt-4 font-bold uppercase tracking-tight px-1">Sync frequency with global telemetry servers.</p>
                        </div>

                        <div className="space-y-4">
                            <div className="flex items-center justify-between p-5 bg-[var(--bg-primary)] rounded-[24px] border border-[var(--border-color)] hover:border-accent/20 transition-all">
                                <div>
                                    <p className="font-black text-[var(--text-primary)] text-xs uppercase tracking-widest transition-colors">Real-time Sockets</p>
                                    <p className="text-[10px] text-[var(--text-secondary)] font-bold uppercase tracking-tight mt-1">Bi-directional streams</p>
                                </div>
                                <div className="w-2.5 h-2.5 rounded-full bg-accent shadow-glow animate-pulse"></div>
                            </div>

                            <div className="flex items-center justify-between p-5 bg-[var(--bg-primary)] rounded-[24px] border border-[var(--border-color)] hover:border-accent/20 transition-all">
                                <div>
                                    <p className="font-black text-[var(--text-primary)] text-xs uppercase tracking-widest transition-colors">Sound Alerts</p>
                                    <p className="text-[10px] text-[var(--text-secondary)] font-bold uppercase tracking-tight mt-1">Audio telemetry feedback</p>
                                </div>
                                <label className="relative inline-flex items-center cursor-pointer">
                                    <input
                                        type="checkbox"
                                        checked={settings.soundAlerts}
                                        onChange={e => handleUpdate('soundAlerts', e.target.checked)}
                                        className="sr-only peer"
                                    />
                                    <div className="w-11 h-6 bg-[var(--bg-secondary)] peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-[#000000] after:content-[''] after:absolute after:top-[4px] after:left-[4px] after:bg-zinc-500 peer-checked:after:bg-[#000000] after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-accent shadow-inner"></div>
                                </label>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Settings;
