import { useEffect, useState } from "react";
import { NavLink, useLocation, useNavigate } from "react-router";
import { AnimatePresence, motion } from "framer-motion";
import {
    ChartBarIcon,
    LayoutDashboard,
    LogOut,
    Settings,
    Wallet,
    X,
} from "lucide-react";


import BflowLogo from "../../../assets/BFlow logo.svg";
import {
    isWalletParentPath,
    isWalletsSectionPath,
    WALLET_NAV_CHILDREN,
} from "../utils/navItems";

import { useLogout } from "@/auth/hooks/useLogout";

interface NavbarProps {
    isOpen: boolean;
    onClose: () => void;
}

export const Navbar = ({ isOpen, onClose }: NavbarProps) => {
    const { pathname } = useLocation();
    const navigate = useNavigate();
    const isWalletsSectionActive = isWalletsSectionPath(pathname);
    const [walletsExpanded, setWalletsExpanded] = useState(isWalletsSectionActive);
    const { mutate: logout, isPending: isLoggingOut } = useLogout();

    useEffect(() => {
        onClose();
        // Close drawer on route change only; parent onClose is an inline callback
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

    // Icon sits in its own rounded chip so the active state reads as a
    // filled "tab" rather than a flat row. Neutral (no brand orange).
    const linkClassName = ({ isActive }: { isActive: boolean }) =>
        `group relative flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm transition-all duration-150 ${isActive
            ? "bg-secondary font-medium text-light"
            : "font-normal text-light-75 hover:bg-light-5 hover:text-light"
        }`;

    const iconChipClassName = (isActive: boolean) =>
        `flex h-7 w-7 shrink-0 items-center justify-center rounded-lg transition-colors duration-150 ${isActive ? "bg-light-10 text-light" : "bg-light-5 text-helper group-hover:text-light"
        }`;

    const isWalletParentActive = isWalletParentPath(pathname);
    const walletTriggerClassName = `group relative flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left text-sm transition-all duration-150 ${isWalletParentActive
        ? "bg-secondary font-medium text-light"
        : "font-normal text-light-75 hover:bg-light-5 hover:text-light"
    }`;

    return (
        <>
            <button
                type="button"
                aria-label="Cerrar menú"
                onClick={onClose}
                className={`fixed inset-0 z-40 bg-surface-hard/70 backdrop-blur-[2px] transition-opacity lg:hidden ${isOpen ? "opacity-100" : "pointer-events-none opacity-0"
                    }`}
            />

            <aside
                className={`fixed inset-y-0 left-0 z-50 flex w-64 flex-col border-r border-light-10 bg-surface px-3 py-6 transition-transform duration-300 ease-out lg:static lg:z-0 lg:w-56 lg:translate-x-0 ${isOpen ? "translate-x-0" : "-translate-x-full"
                    }`}
            >
                <div className="mb-6 flex items-start justify-between gap-3 px-3">
                    <div className="flex items-center gap-2.5">
                        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-light-5 ring-1 ring-light-10">
                            <img src={BflowLogo} alt="BFlow Studio" className="h-4.5 w-4.5" />
                        </div>
                        <div>
                            <p className="text-sm font-semibold leading-tight text-light">BFlow</p>
                            <p className="text-[11px] leading-tight text-helper">Finance tool</p>
                        </div>
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

                <div className="h-px bg-light-10" />

                <nav className="mt-5 flex flex-1 flex-col gap-1">
                    <NavLink
                        to="/app/dashboard"
                        className={linkClassName}
                        onClick={() => setWalletsExpanded(false)}
                    >
                        {({ isActive }) => (
                            <>
                                <span className={iconChipClassName(isActive)}>
                                    <LayoutDashboard size={15} />
                                </span>
                                Dashboard
                            </>
                        )}
                    </NavLink>

                    <div className="flex flex-col">
                        <button
                            type="button"
                            aria-expanded={walletsExpanded}
                            aria-label={
                                walletsExpanded
                                    ? "Ocultar opciones de billeteras"
                                    : "Mostrar opciones de billeteras"
                            }
                            onClick={() => {
                                setWalletsExpanded(true);
                                void navigate("/app/wallets");
                            }}
                            className={walletTriggerClassName}
                        >
                                <span className={iconChipClassName(isWalletParentActive)}>
                                    <Wallet size={15} />
                                </span>
                                Billeteras
                        </button>

                        <AnimatePresence initial={false}>
                            {walletsExpanded ? (
                                <motion.div
                                    initial={{ height: 0, opacity: 0 }}
                                    animate={{ height: "auto", opacity: 1 }}
                                    exit={{ height: 0, opacity: 0 }}
                                    transition={{ duration: 0.22, ease: "easeInOut" }}
                                    className="overflow-hidden"
                                >
                                    <div className="relative ml-6 mt-1">
                                        {WALLET_NAV_CHILDREN.map(({ label, to }) => (
                                                <div
                                                    key={to}
                                                    className="relative py-2 pl-7"
                                                >
                                                    <NavLink
                                                        to={to}
                                                        className={({ isActive }) =>
                                                            `block text-sm transition-colors duration-150 ${isActive
                                                                ? "font-medium text-light"
                                                                : "text-helper hover:text-light"
                                                            }`
                                                        }
                                                    >
                                                        {label}
                                                    </NavLink>
                                                </div>
                                            ))}
                                    </div>
                                </motion.div>
                            ) : null}
                        </AnimatePresence>
                    </div>

                    <NavLink
                        to="/app/budgets"
                        className={linkClassName}
                        onClick={() => setWalletsExpanded(false)}
                    >
                        {({ isActive }) => (
                            <>
                                <span className={iconChipClassName(isActive)}>
                                    <ChartBarIcon size={15} />
                                </span>
                                Presupuestos
                            </>
                        )}
                    </NavLink>

                    <NavLink
                        to="/app/settings"
                        className={linkClassName}
                        onClick={() => setWalletsExpanded(false)}
                    >
                        {({ isActive }) => (
                            <>
                                <span className={iconChipClassName(isActive)}>
                                    <Settings size={15} />
                                </span>
                                Ajustes
                            </>
                        )}
                    </NavLink>
                </nav>

                <div className="mt-auto pt-4">
                    <div className="mb-3 h-px bg-light-10" />
                    <button
                        type="button"
                        disabled={isLoggingOut}
                        onClick={() => logout()}
                        className="group relative flex w-full cursor-pointer items-center gap-3 rounded-xl px-3 py-2.5 text-left text-sm font-normal text-light-75 transition-all duration-150 hover:bg-light-5 hover:text-light disabled:cursor-not-allowed disabled:opacity-50"
                    >
                        <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-light-5 text-helper transition-colors duration-150 group-hover:text-light">
                            <LogOut size={15} />
                        </span>
                        {isLoggingOut ? "Cerrando..." : "Cerrar sesión"}
                    </button>
                </div>
            </aside>
        </>
    );
};
