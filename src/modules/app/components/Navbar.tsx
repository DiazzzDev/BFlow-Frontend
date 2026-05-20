import { NavLink } from "react-router-dom";
import { ArrowUpDown, ChartBarIcon, LayoutDashboard, Settings, TrendingDown, TrendingUp, Wallet } from "lucide-react";


const navItems = [
    { label: "Dashboard", to: "/app/dashboard", icon: <LayoutDashboard size={17} /> },
    { label: "Billeteras", to: "/app/wallets", icon: <Wallet size={17} /> },
    { label: "Ingresos", to: "/app/incomes", icon: <TrendingUp size={17} /> },
    { label: "Gastos", to: "/app/expenses", icon: <TrendingDown size={17} /> },
    { label: "Presupuestos", to: "/app/budgets", icon: <ChartBarIcon size={17} /> },
    { label: "Transferencias", to: "/app/transfers", icon: <ArrowUpDown size={17} /> },
];

export const Navbar = () => {
    return (
        <aside
            className="flex flex-col w-50 min-h-screen px-3 py-6 border-r bg-surface border-border"
        >
            <div className="px-3 mb-8">
                <p className="text-sm font-bold leading-none tracking-tight text-brand-accent">
                    BFlow
                </p>
                <p className="text-xs mt-0.5 text-text-muted">
                    Finance tool
                </p>
            </div>

            <nav className="flex flex-col gap-1 flex-1">
                {navItems.map(({ label, to, icon }) => (
                    <NavLink
                        key={to}
                        to={to}
                        end={to === "/"}
                        className="flex items-center text-foreground gap-3 px-3 py-2 rounded-lg text-sm transition-colors duration-150"
                        style={({ isActive }) => ({
                            backgroundColor: isActive ? "var(--secondary)" : "transparent",
                            fontWeight: isActive ? "500" : "400",
                        })}
                    >
                        <span>
                            {icon}
                        </span>
                        {label}
                    </NavLink>
                ))}
            </nav>

            <div className="mt-auto">
                <NavLink
                    to="/settings"
                    className="flex items-center text-foreground gap-3 px-3 py-2 rounded-lg text-sm transition-colors duration-150"
                    style={({ isActive }) => ({
                        backgroundColor: isActive ? "var(--secondary)" : "transparent",
                        fontWeight: isActive ? "500" : "400",
                    })}
                >
                    <span>
                        <Settings />
                    </span>
                    Ajustes
                </NavLink>
            </div>
        </aside>
    );
};

