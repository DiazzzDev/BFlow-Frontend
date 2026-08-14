import { useState } from "react";
import { useLocation, matchPath, Link } from "react-router";
import { toast } from "sonner";
import { Bell, LogOut, Menu, User, X } from "lucide-react";

import { useAuthStore } from "@/auth/authStore";
import { useLogout } from "@/auth/hooks/useLogout";

type Crumb = { text: string; path?: string };

const routes = [
    { path: "/app/dashboard", crumbs: [{ text: "Dashboard" }] },
    { path: "/app/wallets", crumbs: [{ text: "Billeteras" }] },
    {
        path: "/app/wallets/:id",
        crumbs: [
            { text: "Billeteras", path: "/app/wallets" },
            { text: "Detalle" },
        ],
    },
    { path: "/app/incomes", crumbs: [{ text: "Ingresos" }] },
    { path: "/app/expenses", crumbs: [{ text: "Gastos" }] },
    { path: "/app/budgets", crumbs: [{ text: "Presupuestos" }] },
    {
        path: "/app/budgets/:id",
        crumbs: [
            { text: "Presupuestos", path: "/app/budgets" },
            { text: "Detalle" },
        ],
    },
    { path: "/app/transfers", crumbs: [{ text: "Transferencias" }] },
    { path: "/app/settings", crumbs: [{ text: "Ajustes" }] },
];

const getBreadcrumbs = (pathname: string): Crumb[] => {
    for (const route of routes) {
        if (matchPath(route.path, pathname)) {
            return route.crumbs;
        }
    }
    return [{ text: "..." }];
};

interface HeaderProps {
    onOpenNav: () => void;
}

export const Header = ({ onOpenNav }: HeaderProps) => {
    const { pathname } = useLocation();
    const crumbs = getBreadcrumbs(pathname);
    const [notificationsOpen, setNotificationsOpen] = useState(false);

    const user = useAuthStore((state) => state.user);
    const { mutateAsync: logout } = useLogout();

    const handleLogout = async () => {
        try {
            await logout();
            toast.success("Sesión cerrada correctamente");
        } catch (error) {
            toast.error("Error al cerrar sesión");
            console.error("Error logout:", error);
        }
    };

    return (
        <header className="flex items-center justify-between gap-3 border-b border-light-10 bg-surface-hard px-4 py-4 text-light sm:px-6 lg:px-8 lg:py-5">
            <div className="flex min-w-0 items-center gap-2 sm:gap-3">
                <button
                    type="button"
                    onClick={onOpenNav}
                    aria-label="Abrir menú"
                    className="shrink-0 rounded-lg p-2 text-helper transition-colors hover:bg-light-5 hover:text-light cursor-pointer lg:hidden"
                >
                    <Menu className="h-5 w-5" />
                </button>

                <div className="flex min-w-0 items-center gap-2 text-base font-medium sm:text-lg">
                    {crumbs.map((crumb, i) => {
                        const isLast = i === crumbs.length - 1;

                        return (
                            <span className="flex min-w-0 items-center gap-2" key={i}>
                                {i > 0 && <span className="shrink-0 text-helper">/</span>}

                                {!isLast && crumb.path ? (
                                    <Link
                                        to={crumb.path}
                                        className="truncate text-helper transition-colors hover:text-light"
                                    >
                                        {crumb.text}
                                    </Link>
                                ) : (
                                    <span
                                        className={`truncate ${
                                            isLast ? "text-light font-medium" : "text-helper"
                                        }`}
                                    >
                                        {crumb.text}
                                    </span>
                                )}
                            </span>
                        );
                    })}
                </div>
            </div>

            <div className="flex shrink-0 items-center gap-2 sm:gap-4">
                {user?.name || user?.email ? (
                    <span className="hidden max-w-48 truncate text-sm text-helper md:inline">
                        {user.name || user.email}
                    </span>
                ) : null}

                <button
                    type="button"
                    className="rounded-lg p-2 text-helper transition-colors hover:bg-light-5 hover:text-light cursor-pointer"
                    onClick={() => setNotificationsOpen(true)}
                    aria-label="Notificaciones"
                >
                    <Bell className="h-5 w-5" />
                </button>

                {notificationsOpen && (
                    <div className="fixed inset-0 z-50">
                        <button
                            type="button"
                            aria-label="Cerrar notificaciones"
                            className="absolute inset-0 bg-surface-hard/70"
                            onClick={() => setNotificationsOpen(false)}
                        />
                        <aside className="absolute right-0 top-0 h-full w-full max-w-sm border-l border-light-10 bg-surface p-4 shadow-custom">
                            <div className="mb-4 flex items-center justify-between">
                                <h2 className="text-base font-medium">Notificaciones</h2>
                                <button
                                    type="button"
                                    onClick={() => setNotificationsOpen(false)}
                                    className="rounded-lg p-1.5 text-helper transition-colors hover:bg-light-5 hover:text-light cursor-pointer"
                                >
                                    <X className="h-4 w-4" />
                                </button>
                            </div>
                        </aside>
                    </div>
                )}

                <button
                    type="button"
                    onClick={() => {
                        void handleLogout();
                    }}
                    className="rounded-lg p-2 text-helper transition-colors hover:bg-light-5 hover:text-light cursor-pointer"
                    title="Cerrar sesión"
                    aria-label="Cerrar sesión"
                >
                    <LogOut className="h-5 w-5" />
                </button>

                {user?.pictureUrl ? (
                    <img
                        src={user.pictureUrl}
                        alt={user.name || user.email || "Usuario"}
                        className="h-9 w-9 rounded-full object-cover"
                        referrerPolicy="no-referrer"
                    />
                ) : (
                    <div className="flex h-9 w-9 items-center justify-center rounded-full bg-secondary">
                        <User className="h-5 w-5" />
                    </div>
                )}
            </div>
        </header>
    );
};
