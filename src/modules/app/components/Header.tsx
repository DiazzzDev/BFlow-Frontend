import { useState } from "react"
import { useLocation, matchPath, Link } from "react-router"
import { toast } from "sonner"
import { Bell, LogOut, User, X } from "lucide-react";

import { useAuthStore } from "@/auth/authStore";
import { useLogout } from "@/auth/hooks/useLogout";

type Crumb = { text: string; path?: string };

const routes = [
    { path: "/app/dashboard", crumbs: [{ text: "Dashboard" }] },
    { path: "/app/wallets", crumbs: [{ text: "Billeteras" }] },
    // Para las subrutas, le asignamos la ruta estática al padre
    {
        path: "/app/wallets/:id",
        crumbs: [
            { text: "Billeteras", path: "/app/wallets" },
            { text: "Detalle" }
        ]
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

export const Header = () => {
    const { pathname } = useLocation();
    const crumbs = getBreadcrumbs(pathname);
    const [notificationsOpen, setNotificationsOpen] = useState(false);

    const user = useAuthStore(
        state => state.user
    );

    const { mutateAsync: logout } = useLogout();

    const handleLogout = async () => {
        try {
            await logout();
            toast.success('Sesión cerrada correctamente');
        } catch (error) {
            toast.error('Error al cerrar sesión');
            console.error(
                "Error logout:",
                error
            );

        }
    };

    return (
        <header className="flex items-center justify-between px-8 py-5 border-b border-light-10 bg-surface-hard text-light">
            <div className="flex items-center gap-2 text-lg font-medium">
                {crumbs.map((crumb, i) => {
                    const isLast = i === crumbs.length - 1;

                    return (
                        <span className="flex items-center gap-2" key={i}>
                            {i > 0 && <span className="text-helper">/</span>}

                            {/* Si no es el último y tiene un path, se vuelve un Link clickeable */}
                            {!isLast && crumb.path ? (
                                <Link
                                    to={crumb.path}
                                    className="text-helper hover:text-light transition-colors"
                                >
                                    {crumb.text}
                                </Link>
                            ) : (
                                <span className={isLast ? "text-light font-medium" : "text-helper"}>
                                    {crumb.text}
                                </span>
                            )}
                        </span>
                    );
                })}
            </div>

            <div className="flex items-center gap-4">
                {user?.email && (
                    <span className="text-sm">
                        {user.email}
                    </span>
                )}

                <button
                    type="button"
                    className="hover:text-light transition-colors cursor-pointer"
                    onClick={() => setNotificationsOpen(true)}
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
                            <div className="flex items-center justify-between mb-4">
                                <h2 className="text-base font-medium">Notificaciones</h2>
                                <button
                                    type="button"
                                    onClick={() => setNotificationsOpen(false)}
                                    className="text-helper hover:text-light cursor-pointer"
                                >
                                    <X className="h-4 w-4" />
                                </button>
                            </div>
                        </aside>
                    </div>
                )}

                <button
                    onClick={() => { void handleLogout() }}
                    className="hover:text-light transition-colors cursor-pointer"
                    title="Cerrar sesión"
                >
                    <LogOut className="h-5 w-5" />
                </button>

                <div className="w-9 h-9 rounded-full flex items-center justify-center">
                    <User className="h-5 w-5" />
                </div>
            </div>
        </header>
    );
};
