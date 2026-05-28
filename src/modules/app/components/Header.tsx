import { useLocation, matchPath, useNavigate } from "react-router-dom"
import { toast } from "react-toastify"
import { Bell, LogOut, User } from "lucide-react";

import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "../../../components/ui/sheet"
import { useAuthStore } from "../../../utils/authMe/auth.store.ts"

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
    const navigate = useNavigate();
    const { user, logout } = useAuthStore();
    const crumbs = getBreadcrumbs(pathname);

    const handleLogout = async () => {
        try {
            await logout();
            toast.success('Sesión cerrada correctamente');
            navigate('/');
        } catch (error) {
            console.error('Error al cerrar sesión:', error);
            toast.error('Error al cerrar sesión');
        }
    };

    return (
        <header className="flex items-center justify-between px-8 py-5 border-b border-border bg-background text-foreground">
            <div className="flex items-center gap-2 text-lg font-medium">
                {crumbs.map((crumb, i) => (
                    <span className="flex items-center gap-2" key={i}>
                        {i > 0 && <span className="text-text-muted">/</span>}
                        <span className={i === crumbs.length - 1
                            ? "text-foreground font-medium"
                            : "text-text-muted"
                        }>
                            {crumb}
                        </span>
                    </span>
                ))}
            </div>

            <div className="flex items-center gap-4">
                {/* Mostrar email del usuario si está disponible */}
                {user?.email && (
                    <span className="text-sm">
                        {user.email}
                    </span>
                )}

                <Sheet>
                    <SheetTrigger asChild>
                        {/* tu botón de la campana va aquí */}
                        <button className="hover:text-white transition-colors">
                            <Bell className="h-5 w-5" />
                        </button>
                    </SheetTrigger>
                    <SheetContent>
                        <SheetHeader>
                            <SheetTitle>Notificaciones</SheetTitle>
                        </SheetHeader>
                    </SheetContent>
                </Sheet>

                {/* Botón de logout */}
                <button
                    onClick={handleLogout}
                    className="hover:text-white transition-colors"
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
