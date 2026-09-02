import { useEffect, useState } from "react";
import { NavLink, useLocation } from "react-router";
import { AnimatePresence, motion } from "framer-motion";
import {
    ChartBarIcon,
    ChevronDown,
    LayoutDashboard,
    Settings,
    Wallet,
    X,
} from "lucide-react";

import BflowLogo from ".././../../assets/BFlow logo.svg";

const walletChildren = [{ label: "Historial", to: "/app/history" }];

interface NavbarProps {
    isOpen: boolean;
    onClose: () => void;
}

export const Navbar = ({ isOpen, onClose }: NavbarProps) => {
    const { pathname } = useLocation();
    const isWalletsSectionActive =
        pathname.startsWith("/app/wallets") || pathname.startsWith("/app/history");
    const [walletsExpanded, setWalletsExpanded] = useState(isWalletsSectionActive);

    useEffect(() => {
        onClose();
        // Solo cerrar al cambiar de ruta; onClose del padre es inline.
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [pathname]);

    useEffect(() => {
        if (isWalletsSectionActive) {
            setWalletsExpanded(true);
        }
    }, [isWalletsSectionActive]);

    useEffect(() => {
        if (!isOpen) {
            return;
        }

        const previousOverflow = document.body.style.overflow;
        document.body.style.overflow = "hidden";

        return () => {
            document.body.style.overflow = previousOverflow;
        };
    }, [isOpen]);

    const linkClassName = ({ isActive }: { isActive: boolean }) =>
        `flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-light transition-colors duration-150 ${
            isActive ? "bg-secondary font-medium" : "font-normal hover:bg-light-5"
        }`;

    const isWalletParentActive =
        pathname === "/app/wallets" || /^\/app\/wallets\/[^/]+$/.test(pathname);

    return (
        <>
            <button
                type="button"
                aria-label="Cerrar menú"
                onClick={onClose}
                className={`fixed inset-0 z-40 bg-surface-hard/70 transition-opacity lg:hidden ${
                    isOpen ? "opacity-100" : "pointer-events-none opacity-0"
                }`}
            />

            <aside
                className={`fixed inset-y-0 left-0 z-50 flex w-64 flex-col border-r border-light-10 bg-surface px-3 py-6 transition-transform duration-300 ease-out lg:static lg:z-0 lg:w-50 lg:translate-x-0 ${
                    isOpen ? "translate-x-0" : "-translate-x-full"
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
                    <NavLink to="/app/dashboard" className={linkClassName}>
                        <span className="shrink-0">
                            <LayoutDashboard size={17} />
                        </span>
                        Dashboard
                    </NavLink>

                    <div className="flex flex-col">
                        <div className="flex items-center">
                            <NavLink
                                to="/app/wallets"
                                className={() =>
                                    `flex min-w-0 flex-1 items-center gap-3 rounded-lg px-3 py-2.5 text-sm transition-colors duration-150 ${
                                        isWalletParentActive
                                            ? "bg-secondary font-medium text-light"
                                            : "font-normal text-light hover:bg-light-5"
                                    }`
                                }
                            >
                                <span className="shrink-0">
                                    <Wallet size={17} />
                                </span>
                                Billeteras
                            </NavLink>

                            <button
                                type="button"
                                aria-label={
                                    walletsExpanded
                                        ? "Ocultar opciones de billeteras"
                                        : "Mostrar opciones de billeteras"
                                }
                                aria-expanded={walletsExpanded}
                                onClick={() => setWalletsExpanded((current) => !current)}
                                className="mr-2 flex cursor-pointer items-center justify-center p-1 text-helper"
                            >
                                <motion.span
                                    animate={{ rotate: walletsExpanded ? 180 : 0 }}
                                    transition={{
                                        type: "spring",
                                        stiffness: 320,
                                        damping: 22,
                                    }}
                                    className="flex items-center justify-center"
                                >
                                    <ChevronDown className="h-4 w-4" />
                                </motion.span>
                            </button>
                        </div>

                        <AnimatePresence initial={false}>
                            {walletsExpanded ? (
                                <motion.div
                                    initial={{ height: 0, opacity: 0 }}
                                    animate={{ height: "auto", opacity: 1 }}
                                    exit={{ height: 0, opacity: 0 }}
                                    transition={{ duration: 0.22, ease: "easeInOut" }}
                                    className="overflow-hidden"
                                >
                                    <div className="relative ml-6 mt-2">
                                        {walletChildren.map(({ label, to }, index) => {
                                            const isLast =
                                                index === walletChildren.length - 1;

                                            return (
                                                <div
                                                    key={to}
                                                    className="relative py-2 pl-7"
                                                >
                                                    <span
                                                        aria-hidden="true"
                                                        className={`absolute left-0 w-px bg-light-25 ${
                                                            isLast
                                                                ? "top-0 h-1/2"
                                                                : "top-0 bottom-0"
                                                        }`}
                                                    />
                                                    <span
                                                        aria-hidden="true"
                                                        className="absolute left-0 top-1/2 h-px w-6 -translate-y-1/2 bg-light-25"
                                                    />

                                                    <NavLink
                                                        to={to}
                                                        className={({ isActive }) =>
                                                            `block text-sm transition-colors duration-150 ${
                                                                isActive
                                                                    ? "font-medium text-light"
                                                                    : "text-helper hover:text-light"
                                                            }`
                                                        }
                                                    >
                                                        {label}
                                                    </NavLink>
                                                </div>
                                            );
                                        })}
                                    </div>
                                </motion.div>
                            ) : null}
                        </AnimatePresence>
                    </div>

                    <NavLink to="/app/budgets" className={linkClassName}>
                        <span className="shrink-0">
                            <ChartBarIcon size={17} />
                        </span>
                        Presupuestos
                    </NavLink>
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
