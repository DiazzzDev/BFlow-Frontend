import { NavLink } from "react-router-dom";

import { BudgetIcon, ExpenseIcon, IncomeIcon, LayoutGrid, SettingsIcon, TransferIcon, WalletIcon } from "./NavIcons";


const navItems = [
    { label: "Dashboard", to: "/app/dashboard", icon: <LayoutGrid /> },
    { label: "Billeteras", to: "/app/wallets", icon: <WalletIcon /> },
    { label: "Ingresos", to: "/app/incomes", icon: <IncomeIcon /> },
    { label: "Gastos", to: "/app/expenses", icon: <ExpenseIcon /> },
    { label: "Presupuestos", to: "/app/budgets", icon: <BudgetIcon /> },
    { label: "Transferencias", to: "/app/transfers", icon: <TransferIcon /> },
];

export const Navbar = () => {
    return (
        <aside
            className="flex flex-col w-44 min-h-screen px-3 py-6 border-r bg-[var(--bg-surface)] border-[var(--border)]"
        >
            <div className="px-3 mb-8">
                <p className="text-sm font-bold leading-none tracking-tight text-[var(--text-primary)]">
                    BFlow
                </p>
                <p className="text-xs mt-0.5 text-[var(--text-muted)]">
                    Finance tool
                </p>
            </div>

            <nav className="flex flex-col gap-1 flex-1">
                {navItems.map(({ label, to, icon }) => (
                    <NavLink
                        key={to}
                        to={to}
                        end={to === "/"}
                        className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors duration-150"
                        style={({ isActive }) => ({
                            backgroundColor: isActive ? "var(--bg-card-hover)" : "transparent",
                            color: isActive ? "var(--text-primary)" : "var(--text-muted)",
                            fontWeight: isActive ? "500" : "400",
                        })}
                    >
                        {({ isActive }) => (
                            <>
                                <span style={{ color: isActive ? "var(--text-primary)" : "var(--text-muted)" }}>
                                    {icon}
                                </span>
                                {label}
                            </>
                        )}
                    </NavLink>
                ))}
            </nav>

            <div className="mt-auto">
                <NavLink
                    to="/settings"
                    className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors duration-150"
                    style={({ isActive }) => ({
                        backgroundColor: isActive ? "var(--bg-card-hover)" : "transparent",
                        color: isActive ? "var(--text-primary)" : "var(--text-muted)",
                        fontWeight: isActive ? "500" : "400",
                    })}
                >
                    {({ isActive }) => (
                        <>
                            <span style={{ color: isActive ? "var(--text-primary)" : "var(--text-muted)" }}>
                                <SettingsIcon />
                            </span>
                            Ajustes
                        </>
                    )}
                </NavLink>
            </div>
        </aside>
    );
};
