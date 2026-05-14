import { useLocation, matchPath, useNavigate } from "react-router-dom"
import { toast } from "react-toastify"

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
        <header className="flex items-center justify-between px-8 py-5 border-b border-[var(--border)] bg-[var(--bg-surface)]">
            <div className="flex items-center gap-2 text-lg font-medium">
                {crumbs.map((crumb, i) => (
                    <span className="flex items-center gap-2" key={i}>
                        {i > 0 && <span className="text-[var(--text-muted)]">/</span>}
                        <span className={i === crumbs.length - 1
                            ? "text-white font-medium"
                            : "text-[var(--text-muted)]"
                        }>
                            {crumb}
                        </span>
                    </span>
                ))}
            </div>

            <div className="flex items-center gap-4">
                {/* Mostrar email del usuario si está disponible */}
                {user?.email && (
                    <span className="text-sm text-[var(--text-muted)]">
                        {user.email}
                    </span>
                )}

                <Sheet>
                    <SheetTrigger asChild>
                        {/* tu botón de la campana va aquí */}
                        <button className="text-[var(--text-muted)] hover:text-white transition-colors">
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9" />
                                <path d="M10.3 21a1.94 1.94 0 0 0 3.4 0" />
                            </svg>
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
                    className="text-[var(--text-muted)] hover:text-white transition-colors"
                    title="Cerrar sesión"
                >
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                        <polyline points="16,17 21,12 16,7" />
                        <line x1="21" y1="12" x2="9" y2="12" />
                    </svg>
                </button>

                <div className="w-9 h-9 rounded-full bg-[var(--bg-card)] flex items-center justify-center text-[var(--text-muted)]">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <circle cx="12" cy="8" r="4" />
                        <path d="M4 20c0-4 3.6-7 8-7s8 3 8 7" />
                    </svg>
                </div>
            </div>
        </header>
    );
};
