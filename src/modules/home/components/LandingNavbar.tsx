import { Link } from "react-router-dom"

import { useAuth } from "../../../auth/hooks/useAuth.ts"; //Review route
import { useLandingHome } from "../hooks/custom/useLandingHome.tsx"

//import { useAuthStore } from "@/utils/authMe/auth.store.ts"

export const LandingNavbar = () => {
    const { navLinks, handleNavClick } = useLandingHome();

    const auth = useAuth();
    /* 
    const { isAuthenticated, isInitializing, checkAuth } = useAuthStore();

    useEffect(() => {
        if (isInitializing) {
            checkAuth();
        }
    }, [checkAuth, isInitializing]);
    */

    return (
        <nav className="flex items-center justify-between px-20 py-5 border-b border-border-subtle sticky top-0 z-50 bg-[rgba(10,14,19,0.92)] backdrop-blur-md">
            <div className="text-lg font-bold">
                B<span className="text-warning">Flow</span>
            </div>

            <div className="flex items-center gap-8">
                {navLinks.map(({ label, id }: { label: string; id: string }) => (
                    <button
                        key={id}
                        onClick={() => handleNavClick(id)}
                        className="text-sm text-text-muted hover:text-white transition-colors cursor-pointer bg-none border-none p-0"
                    >
                        {label}
                    </button>
                ))}
            </div>

            <div className="flex items-center gap-3">
                {auth.isAuthenticated ? (
                    <Link to="/app/dashboard">
                        <button className="text-sm text-text-muted border border-border-subtle px-4 py-2 rounded-lg hover:border-white/20 hover:text-white transition-all">
                            Ir al dashboard
                        </button>
                    </Link>
                ) : (
                    <Link to="/auth/login">
                        <button className="text-sm text-text-muted border border-border-subtle px-4 py-2 rounded-lg hover:border-white/20 hover:text-white transition-all">
                            Iniciar sesión
                        </button>
                    </Link>
                )}
                <Link to="/auth/register">
                    <button className="text-sm font-medium bg-warning text-white px-4 py-2 rounded-lg hover:opacity-90 transition-opacity">
                        Empezar gratis
                    </button>
                </Link>
            </div>
        </nav>
    )
}
