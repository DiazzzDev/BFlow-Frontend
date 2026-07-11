import { useState } from "react"
import { useLocation, matchPath } from "react-router-dom"
import { toast } from "sonner"
import { Bell, LogOut, User, X } from "lucide-react";

import { useAuthStore } from "@/auth/authStore";
import { useLogout } from "@/auth/hooks/useLogout";

const routes = [
    { path: "/app/dashboard", crumbs: ["Dashboard"] },
    { path: "/app/wallets", crumbs: ["Billeteras"] },
    { path: "/app/wallets/:id", crumbs: ["Billetera", "Detalle"] },
    { path: "/app/incomes", crumbs: ["Ingresos"] },
    { path: "/app/expenses", crumbs: ["Gastos"] },
    { path: "/app/budgets", crumbs: ["Presupuestos"] },
    { path: "/app/transfers", crumbs: ["Transferencias"] },
    { path: "/app/settings", crumbs: ["Ajustes"] },
];

const getBreadcrumbs = (pathname: string) => {
    for (const route of routes) {
        if (matchPath(route.path, pathname)) {
            return route.crumbs;
        }
    }
    return ["..."];
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
        } catch(error){
            toast.error('Error al cerrar sesión');
            console.error(
                "Error logout:",
                error
            );

        }
    };

    return (
        <header className="flex items-center justify-between px-8 py-5 border-b border-border bg-background text-foreground">
            <div className="flex items-center gap-2 text-lg font-medium">
                {crumbs.map((crumb, i) => (
                    <span className="flex items-center gap-2" key={i}>
                        {i > 0 && <span className="text-muted-foreground">/</span>}
                        <span className={i === crumbs.length - 1
                            ? "text-foreground font-medium"
                            : "text-muted-foreground"
                        }>
                            {crumb}
                        </span>
                    </span>
                ))}
            </div>

            <div className="flex items-center gap-4">
                {user?.email && (
                    <span className="text-sm">
                        {user.email}
                    </span>
                )}

                <button
                    type="button"
                    className="hover:text-foreground transition-colors cursor-pointer"
                    onClick={() => setNotificationsOpen(true)}
                >
                    <Bell className="h-5 w-5" />
                </button>

                {notificationsOpen && (
                    <div className="fixed inset-0 z-50">
                        <button
                            type="button"
                            aria-label="Cerrar notificaciones"
                            className="absolute inset-0 bg-background/70"
                            onClick={() => setNotificationsOpen(false)}
                        />
                        <aside className="absolute right-0 top-0 h-full w-full max-w-sm border-l border-border bg-card p-4 shadow-custom">
                            <div className="flex items-center justify-between mb-4">
                                <h2 className="text-base font-medium">Notificaciones</h2>
                                <button
                                    type="button"
                                    onClick={() => setNotificationsOpen(false)}
                                    className="text-muted-foreground hover:text-foreground cursor-pointer"
                                >
                                    <X className="h-4 w-4" />
                                </button>
                            </div>
                        </aside>
                    </div>
                )}

                <button
                    onClick={() => { void handleLogout()}}
                    className="hover:text-foreground transition-colors cursor-pointer"
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
