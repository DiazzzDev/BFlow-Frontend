import { useEffect } from "react";
import { NavLink, useLocation } from "react-router";
import {
    ChartBarIcon,
    LayoutDashboard,
    Settings,
    Wallet,
    X,
} from "lucide-react";

import BflowLogo from ".././../../assets/BFlow logo.svg";

const navItems = [
    { label: "Dashboard", to: "/app/dashboard", icon: <LayoutDashboard size={17} /> },
    { label: "Billeteras", to: "/app/wallets", icon: <Wallet size={17} /> },
    { label: "Presupuestos", to: "/app/budgets", icon: <ChartBarIcon size={17} /> },
];

interface NavbarProps {
    isOpen: boolean;
    onClose: () => void;
}

export const Navbar = ({ isOpen, onClose }: NavbarProps) => {
    const { pathname } = useLocation();

    useEffect(() => {
        onClose();
        // Solo cerrar al cambiar de ruta; onClose del padre es inline.
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [pathname]);

    useEffect(() => {
        if (!isOpen) { return; }

        const previousOverflow = document.body.style.overflow;
        document.body.style.overflow = "hidden";

        return () => {
            document.body.style.overflow = previousOverflow;
        };
    }, [isOpen]);

    const linkClassName = ({ isActive }: { isActive: boolean }) =>
        `flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-light transition-colors duration-150 ${isActive ? "bg-secondary font-medium" : "font-normal hover:bg-light-5"
        }`;

    return (
        <>
            <button
                type="button"
                aria-label="Cerrar menú"
                onClick={onClose}
                className={`fixed inset-0 z-40 bg-surface-hard/70 transition-opacity lg:hidden ${isOpen ? "opacity-100" : "pointer-events-none opacity-0"
                    }`}
            />

            <aside
                className={`fixed inset-y-0 left-0 z-50 flex w-64 flex-col border-r border-light-10 bg-surface px-3 py-6 transition-transform duration-300 ease-out lg:static lg:z-0 lg:w-50 lg:translate-x-0 ${isOpen ? "translate-x-0" : "-translate-x-full"
                    }`}
            >
                <div className="mb-8 flex items-start justify-between gap-3 px-3">
                    <div>
                        <img src={BflowLogo} alt="BFlow Studio" className="w-5 h-5" />
                        <p className="mt-0.5 text-sm text-helper">Finance tool</p>
                    </div>

                    <button
                        type="button"
                        onClick={onClose}
                        aria-label="Cerrar menú"
                        className="rounded-lg p-1.5 text-helper transition-colors hover:bg-light-5 hover:text-light cursor-pointer lg:hidden"
                    >
                        <X className="h-5 w-5" />
                    </button>
                </div>

                <nav className="flex flex-1 flex-col gap-1">
                    {navItems.map(({ label, to, icon }) => (
                        <NavLink key={to} to={to} className={linkClassName}>
                            <span className="shrink-0">{icon}</span>
                            {label}
                        </NavLink>
                    ))}
                </nav>

                <div className="mt-auto">
                    <NavLink to="/app/settings" className={linkClassName}>
                        <span className="shrink-0">
                            <Settings size={17} />
                        </span>
                        Ajustes
                    </NavLink>
                </div>
            </aside>
        </>
    );
};
