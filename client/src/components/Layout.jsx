import { Outlet, NavLink, useNavigate, useLocation } from 'react-router-dom';
import useAuth from '../hooks/useAuth';
import { Truck, Map, LogOut, LayoutDashboard, Settings, Bell, Package, Home } from 'lucide-react';
import clsx from 'clsx';

const Layout = () => {
    const { logout, user } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    const navItemClass = ({ isActive }) => clsx(
        "flex items-center justify-center w-12 h-12 rounded-2xl transition-all duration-300 group relative",
        isActive
            ? "bg-[#00E5FF] text-[#000000] shadow-glow"
            : "text-zinc-500 hover:text-white hover:bg-zinc-800/50"
    );

    const getPageTitle = () => {
        const path = location.pathname.substring(1);
        if (!path) return 'Dashboard';
        return path.charAt(0).toUpperCase() + path.slice(1);
    };

    return (
        <div className="flex h-screen bg-[var(--bg-primary)] text-[var(--text-primary)] overflow-hidden font-sans transition-colors duration-300">
            {/* Slim Sidebar */}
            <aside className="w-20 bg-[var(--bg-secondary)] border-r border-[var(--border-color)] flex flex-col items-center py-6 relative z-50 transition-colors duration-300">
                <div className="mb-10">
                    <div className="w-12 h-12 bg-accent shadow-glow rounded-xl flex items-center justify-center">
                        <Truck className="w-6 h-6 text-[#000000]" />
                    </div>
                </div>

                <nav className="flex-1 flex flex-col items-center gap-4 w-full text-[var(--text-secondary)]">
                    <NavLink to="/overview" title="Home" className={navItemClass}>
                        <Home className="w-5 h-5" />
                        {({ isActive }) => isActive && <div className="absolute -left-4 top-1/2 -translate-y-1/2 w-1.5 h-6 bg-accent rounded-r-full shadow-glow" />}
                    </NavLink>
                    <NavLink to="/dashboard" title="Dashboard" className={navItemClass}>
                        <LayoutDashboard className="w-5 h-5" />
                        {({ isActive }) => isActive && <div className="absolute -left-4 top-1/2 -translate-y-1/2 w-1.5 h-6 bg-accent rounded-r-full shadow-glow" />}
                    </NavLink>
                    <NavLink to="/manage" title="Shipping" className={navItemClass}>
                        <Package className="w-5 h-5" />
                        {({ isActive }) => isActive && <div className="absolute -left-4 top-1/2 -translate-y-1/2 w-1.5 h-6 bg-accent rounded-r-full shadow-glow" />}
                    </NavLink>
                    <NavLink to="/tracking" title="Tracking" className={navItemClass}>
                        <Map className="w-5 h-5" />
                        {({ isActive }) => isActive && <div className="absolute -left-4 top-1/2 -translate-y-1/2 w-1.5 h-6 bg-accent rounded-r-full shadow-glow" />}
                    </NavLink>
                    <NavLink to="/alerts" title="Alerts" className={navItemClass}>
                        <Bell className="w-5 h-5" />
                        {({ isActive }) => isActive && <div className="absolute -left-4 top-1/2 -translate-y-1/2 w-1.5 h-6 bg-accent rounded-r-full shadow-glow" />}
                    </NavLink>

                    <div className="mt-auto items-center flex flex-col gap-4 w-full">
                        <NavLink to="/settings" title="Settings" className={navItemClass}>
                            <Settings className="w-5 h-5" />
                            {({ isActive }) => isActive && <div className="absolute -left-4 top-1/2 -translate-y-1/2 w-1.5 h-6 bg-accent rounded-r-full shadow-glow" />}
                        </NavLink>
                        <button onClick={handleLogout} className="flex items-center justify-center w-12 h-12 rounded-xl text-zinc-600 hover:text-red-500 hover:bg-red-500/10 transition-all duration-300">
                            <LogOut className="w-5 h-5" />
                        </button>
                    </div>
                </nav>
            </aside>

            {/* Main Content Area */}
            <div className="flex-1 flex flex-col overflow-hidden relative">
                {/* Global Background Elements */}
                <div className="absolute inset-0 pointer-events-none overflow-hidden">
                    <div className="absolute top-[-10%] right-[-10%] w-[800px] h-[800px] bg-accent/5 rounded-full blur-[120px]" />
                    <div className="absolute bottom-[-10%] left-[-10%] w-[600px] h-[600px] bg-teal-500/5 rounded-full blur-[100px]" />
                </div>

                {/* Top Header */}
                <header className="h-20 border-b border-[var(--border-color)] bg-[var(--bg-primary)]/80 backdrop-blur-md flex items-center justify-between px-8 relative z-40 shrink-0 transition-colors duration-300">
                    <div className="flex items-center gap-4">
                        <h1 className="text-2xl font-display font-black tracking-tighter text-[var(--text-primary)] uppercase">{getPageTitle()}</h1>
                        <div className="h-6 w-[1px] bg-[var(--border-color)]"></div>
                        <span className="px-3 py-1 rounded-full bg-accent/10 border border-accent/20 text-accent text-[9px] font-black uppercase tracking-[0.2em] flex items-center gap-2">
                            <span className="w-1.5 h-1.5 rounded-full bg-accent animate-pulse shadow-glow"></span>
                            Verified System
                        </span>
                    </div>

                    <div className="flex items-center gap-6">
                        <div className="hidden md:flex flex-col items-end">
                            <span className="text-sm font-black text-[var(--text-primary)] tracking-tight">
                                {new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}
                            </span>
                            <span className="text-[10px] text-[var(--text-secondary)] uppercase font-bold tracking-widest">
                                {new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                            </span>
                        </div>

                        <div className="h-8 w-[1px] bg-[var(--border-color)]"></div>

                        <div className="flex items-center gap-3">
                            <div className="flex flex-col items-end">
                                <span className="text-sm font-black text-[var(--text-primary)]">{user?.name}</span>
                                <span className="text-[9px] text-accent uppercase font-black tracking-widest">Admin Control</span>
                            </div>
                            <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-accent to-teal-500 p-0.5 shadow-glow">
                                <div className="w-full h-full rounded-2xl bg-[var(--bg-secondary)] flex items-center justify-center text-accent font-black text-xs transition-colors duration-300">
                                    {user?.name?.substring(0, 2).toUpperCase()}
                                </div>
                            </div>
                        </div>
                    </div>
                </header>

                <main className="flex-1 overflow-auto bg-[var(--bg-primary)] relative z-10 p-6 scrollbar-hide transition-colors duration-300">
                    <Outlet />
                </main>
            </div>
        </div>
    );
};

export default Layout;
