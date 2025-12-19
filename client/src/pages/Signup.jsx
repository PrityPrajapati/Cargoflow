import { useState } from 'react';
import useAuth from '../hooks/useAuth';
import { useNavigate, Link } from 'react-router-dom';
import { Truck, ShieldPlus, ArrowRight, User, Mail, Lock, Globe, Shield } from 'lucide-react';
import toast, { Toaster } from 'react-hot-toast';

const Signup = () => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        role: 'operations_executive',
        assignedRegion: 'Global'
    });
    const { register } = useAuth();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            await register(formData);
            toast.success('Registration Complete. Welcome aboard!');
            setTimeout(() => {
                navigate('/dashboard');
            }, 1000);
        } catch (err) {
            toast.error(err.response?.data?.message || 'Verification Failed');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-[#09090b] flex items-center justify-center p-6 relative overflow-hidden font-sans">
            <Toaster position="top-right" />

            {/* High-End Background Effects */}
            <div className="absolute inset-0 pointer-events-none">
                <div className="absolute top-[-10%] left-[-5%] w-[1000px] h-[1000px] bg-accent/5 rounded-full blur-[150px] animate-pulse" />
                <div className="absolute bottom-[-10%] right-[-5%] w-[800px] h-[800px] bg-lavender/5 rounded-full blur-[120px] animate-pulse" />
                <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.03] mix-blend-overlay"></div>
            </div>

            <div className="w-full max-w-[520px] relative z-10 transition-all duration-500 animate-in fade-in zoom-in duration-700">
                {/* Brand Identity */}
                <div className="flex flex-col items-center mb-8">
                    <div className="w-16 h-16 bg-[#000000] border border-[#1c1c1f] rounded-2xl flex items-center justify-center mb-6 shadow-2xl relative group">
                        <div className="absolute inset-0 bg-accent/20 blur-xl opacity-0 group-hover:opacity-100 transition-opacity" />
                        <Truck className="w-8 h-8 text-accent relative z-10" />
                    </div>
                    <h1 className="text-4xl font-display font-black text-white tracking-tighter mb-2">NETWORK ENTRY</h1>
                    <p className="text-zinc-500 font-bold text-[10px] uppercase tracking-[0.3em]">Initialize Operational Account</p>
                </div>

                <div className="bg-[#121214]/80 backdrop-blur-2xl p-10 rounded-[40px] border border-[#1c1c1f] shadow-2xl">
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest ml-1">Access Level</label>
                                <div className="relative group">
                                    <Shield className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-600 group-focus-within:text-accent transition-colors" />
                                    <select
                                        name="role"
                                        value={formData.role}
                                        onChange={handleChange}
                                        className="w-full bg-[#1c1c1f] border border-[#27272a] rounded-2xl py-4 pl-12 pr-4 text-white text-sm focus:outline-none focus:border-accent/50 transition-all appearance-none cursor-pointer"
                                    >
                                        <option value="admin">System Admin</option>
                                        <option value="regional_manager">Regional Manager</option>
                                        <option value="operations_executive">Operations Executive</option>
                                    </select>
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest ml-1">Access Region</label>
                                <div className="relative group">
                                    <Globe className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-600 group-focus-within:text-accent transition-colors" />
                                    <select
                                        name="assignedRegion"
                                        value={formData.assignedRegion}
                                        onChange={handleChange}
                                        className="w-full bg-[#1c1c1f] border border-[#27272a] rounded-2xl py-4 pl-12 pr-4 text-white text-sm focus:outline-none focus:border-accent/50 transition-all appearance-none cursor-pointer"
                                    >
                                        <option value="Global">Global</option>
                                        <option value="North America">North America</option>
                                        <option value="Europe">Europe</option>
                                        <option value="Asia">Asia</option>
                                    </select>
                                </div>
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest ml-1">Terminal Email</label>
                            <div className="relative group">
                                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-600 group-focus-within:text-accent transition-colors" />
                                <input
                                    type="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    className="w-full bg-[#1c1c1f] border border-[#27272a] rounded-2xl py-4 pl-12 pr-4 text-white text-sm focus:outline-none focus:border-accent/50 focus:bg-[#1c1c1f]/80 transition-all placeholder:text-zinc-700 font-medium"
                                    placeholder="operator@system.com"
                                    required
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest ml-1">Full Name</label>
                            <div className="relative group">
                                <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-600 group-focus-within:text-accent transition-colors" />
                                <input
                                    type="text"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleChange}
                                    className="w-full bg-[#1c1c1f] border border-[#27272a] rounded-2xl py-4 pl-12 pr-4 text-white text-sm focus:outline-none focus:border-accent/50 focus:bg-[#1c1c1f]/80 transition-all placeholder:text-zinc-700 font-medium"
                                    placeholder="John Doe"
                                    required
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest ml-1">Encryption Key</label>
                            <div className="relative group">
                                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-600 group-focus-within:text-accent transition-colors" />
                                <input
                                    type="password"
                                    name="password"
                                    value={formData.password}
                                    onChange={handleChange}
                                    className="w-full bg-[#1c1c1f] border border-[#27272a] rounded-2xl py-4 pl-12 pr-4 text-white text-sm focus:outline-none focus:border-accent/50 focus:bg-[#1c1c1f]/80 transition-all placeholder:text-zinc-700 font-medium"
                                    placeholder="••••••••••••"
                                    required
                                />
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full h-[60px] bg-accent hover:bg-accent/90 text-[#000000] rounded-2xl font-black uppercase tracking-widest text-[11px] transition-all transform hover:scale-[1.01] active:scale-95 shadow-glow flex items-center justify-center gap-3 disabled:opacity-50 mt-4"
                        >
                            {loading ? (
                                <div className="w-5 h-5 border-2 border-[#000000] border-t-transparent rounded-full animate-spin"></div>
                            ) : (
                                <>
                                    Create Operational Account
                                    <ShieldPlus className="w-4 h-4" />
                                </>
                            )}
                        </button>
                    </form>

                    <div className="mt-10 pt-10 border-t border-[#1c1c1f] flex flex-col items-center">
                        <p className="text-zinc-400 font-bold text-xs">
                            Already have access?
                            <Link to="/login" className="text-accent hover:text-accent/80 ml-2 transition-colors underline decoration-accent/30 underline-offset-4">Log in to Terminal</Link>
                        </p>
                    </div>
                </div>

                <div className="mt-8 text-center px-10">
                    <p className="text-[9px] text-zinc-600 font-bold uppercase tracking-[0.2em] leading-relaxed">
                        By registering, you agree to the Automated Asset Tracking Compliance and System Governance protocols.
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Signup;
