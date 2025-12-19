import { useState } from 'react';
import useAuth from '../hooks/useAuth';
import { useNavigate, Link } from 'react-router-dom';
import { Truck, ShieldCheck, ArrowRight, Eye, EyeOff, Lock, Mail } from 'lucide-react';
import toast, { Toaster } from 'react-hot-toast';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const { login } = useAuth();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            await login(email, password);
            toast.success('Access Granted. Redirecting...');
            setTimeout(() => {
                navigate('/dashboard');
            }, 1000);
        } catch (err) {
            toast.error(err.response?.data?.message || 'Unauthorized Access');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-[#09090b] flex items-center justify-center p-6 relative overflow-hidden font-sans">
            <Toaster position="top-right" />

            {/* High-End Background Effects */}
            <div className="absolute inset-0 pointer-events-none">
                <div className="absolute top-[-10%] right-[-5%] w-[1000px] h-[1000px] bg-accent/5 rounded-full blur-[150px] animate-pulse" />
                <div className="absolute bottom-[-10%] left-[-5%] w-[800px] h-[800px] bg-lavender/5 rounded-full blur-[120px] animate-pulse" />
                <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.03] mix-blend-overlay"></div>
            </div>

            <div className="w-full max-w-[480px] relative z-10 transition-all duration-500 animate-in fade-in zoom-in duration-700">
                {/* Brand Identity */}
                <div className="flex flex-col items-center mb-10">
                    <div className="w-16 h-16 bg-[#000000] border border-[#1c1c1f] rounded-2xl flex items-center justify-center mb-6 shadow-2xl relative group">
                        <div className="absolute inset-0 bg-accent/20 blur-xl opacity-0 group-hover:opacity-100 transition-opacity" />
                        <Truck className="w-8 h-8 text-accent relative z-10" />
                    </div>
                    <h1 className="text-4xl font-display font-black text-white tracking-tighter mb-2">CARGO FLOW</h1>
                    <p className="text-zinc-500 font-bold text-[10px] uppercase tracking-[0.3em]">Logistics Intelligence Platform</p>
                </div>

                <div className="bg-[#121214]/80 backdrop-blur-2xl p-10 rounded-[40px] border border-[#1c1c1f] shadow-2xl">
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="space-y-2">
                            <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest ml-1">Secure Email</label>
                            <div className="relative group">
                                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-600 group-focus-within:text-accent transition-colors" />
                                <input
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="w-full bg-[#1c1c1f] border border-[#27272a] rounded-2xl py-4 pl-12 pr-4 text-white text-sm focus:outline-none focus:border-accent/50 focus:bg-[#1c1c1f]/80 transition-all placeholder:text-zinc-700 font-medium"
                                    placeholder="admin@cargoflow.com"
                                    required
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <div className="flex justify-between items-center ml-1">
                                <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">Master Key</label>
                                <button type="button" className="text-[10px] font-black text-accent uppercase tracking-widest hover:underline transition-all">Forgot?</button>
                            </div>
                            <div className="relative group">
                                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-600 group-focus-within:text-accent transition-colors" />
                                <input
                                    type={showPassword ? "text" : "password"}
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="w-full bg-[#1c1c1f] border border-[#27272a] rounded-2xl py-4 pl-12 pr-12 text-white text-sm focus:outline-none focus:border-accent/50 focus:bg-[#1c1c1f]/80 transition-all placeholder:text-zinc-700 font-medium"
                                    placeholder="••••••••••••"
                                    required
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-4 top-1/2 -translate-y-1/2 text-zinc-600 hover:text-white transition-colors"
                                >
                                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                </button>
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full h-[60px] bg-accent hover:bg-accent/90 text-[#000000] rounded-2xl font-black uppercase tracking-widest text-[11px] transition-all transform hover:scale-[1.01] active:scale-95 shadow-glow flex items-center justify-center gap-3 disabled:opacity-50"
                        >
                            {loading ? (
                                <div className="w-5 h-5 border-2 border-[#000000] border-t-transparent rounded-full animate-spin"></div>
                            ) : (
                                <>
                                    Verify Identity
                                    <ArrowRight className="w-4 h-4" />
                                </>
                            )}
                        </button>
                    </form>

                    <div className="mt-10 pt-10 border-t border-[#1c1c1f] flex flex-col items-center gap-6">
                        <div className="flex items-center gap-2 text-[10px] font-black text-zinc-500 uppercase tracking-widest">
                            <ShieldCheck className="w-3.5 h-3.5 text-accent" />
                            Biometric encryption active
                        </div>

                        <p className="text-zinc-400 font-bold text-xs">
                            New operator?
                            <Link to="/signup" className="text-accent hover:text-accent/80 ml-2 transition-colors underline decoration-accent/30 underline-offset-4">Register Terminal</Link>
                        </p>
                    </div>
                </div>

                {/* Footer Disclaimer */}
                <div className="mt-12 text-center">
                    <p className="text-[10px] text-zinc-600 font-bold uppercase tracking-[0.2em] leading-loose">
                        Authorized Personnel Only <br />
                        Global Logistics Data Protection Protocol v4.0.2
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Login;
