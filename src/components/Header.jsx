import { useLocation } from "react-router-dom"

const breadcrumbMap = {
    "/": ["Dashboard"],
    "/wallets": ["Billeteras"],
    "/incomes": ["Ingresos"],
    "/expenses": ["Gastos"],
    "/budgets": ["Presupuestos"],
    "/transfers": ["Transferencias"],
    "/settings": ["Ajustes"],
    "/wallets/:id": ["Billetera", "Detalle"],
};

export const Header = () => {
    const { pathname } = useLocation();
    const crumbs = breadcrumbMap[pathname] || ["..."];

    return (
        <header className="flex items-center justify-between px-8 py-5 border-b border-[var(--border-subtle)]">
            <div className="flex items-center gap-2 text-lg font-medium">
                {crumbs.map((crumb, i) => (
                    <span key={i} className="flex items-center gap-2">
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
                <button className="text-[var(--text-muted)] hover:text-white transition-colors">
                    <svg width="25" height="25" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9" /><path d="M10.3 21a1.94 1.94 0 0 0 3.4 0" />
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