import { Link } from "react-router-dom"

import { useAuth } from "../../../auth/hooks/useAuth.ts";
import { useLandingHome } from "../hooks/custom/useLandingHome.tsx"

export const LandingNavbar = () => {
    const { navLinks, handleNavClick } = useLandingHome();
    const { isAuthenticated, isChecking } = useAuth();

    return (
        <nav className="flex items-center justify-between px-20 py-5 border-b border-light-10 sticky top-0 z-50 bg-surface-hard/95 backdrop-blur-md">
            <div className="text-lg font-bold">
                B<span className="text-primary">Flow</span>
            </div>

            <div className="flex items-center gap-8">
                {navLinks.map(({ label, id }: { label: string; id: string }) => (
                    <button
                        key={id}
                        onClick={() => handleNavClick(id)}
                        className="text-sm text-helper hover:text-light transition-colors cursor-pointer bg-none border-none p-0"
                    >
                        {label}
                    </button>
                ))}
            </div>

            <div className="flex items-center gap-3">
                {isChecking ? null : isAuthenticated ? (
                    <Link to="/app/dashboard">
                        <button className="text-sm text-helper border border-light-10 px-4 py-2 rounded-lg hover:border-light-25 hover:text-light transition-all">
                            Ir al dashboard
                        </button>
                    </Link>
                ) : (
                    <Link to="/auth/login">
                        <button className="text-sm text-helper border border-light-10 px-4 py-2 rounded-lg hover:border-light-25 hover:text-light transition-all">
                            Iniciar sesión
                        </button>
                    </Link>
                )}
                {!isAuthenticated && !isChecking && (
                    <Link to="/auth/register">
                        <button className="text-sm font-medium bg-primary text-light px-4 py-2 rounded-lg hover:bg-primary-dark transition-colors">
                            Empezar gratis
                        </button>
                    </Link>
                )}
            </div>
        </nav>
    )
}
