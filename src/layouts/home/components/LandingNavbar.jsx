import { Link } from "react-router-dom"

export const LandingNavbar = () => {
    return (
        <nav className="flex items-center justify-between px-20 py-5 border-b border-[var(--border-subtle)] sticky top-0 z-50 bg-[rgba(10,14,19,0.92)] backdrop-blur-md">
            <div className="text-lg font-bold">
                B<span className="text-[var(--warning-color)]">Flow</span>
            </div>

            <div className="flex items-center gap-8">
                <a href="#features" className="text-sm text-[var(--text-muted)] hover:text-white transition-colors">Funcionalidades</a>
                <a href="#how" className="text-sm text-[var(--text-muted)] hover:text-white transition-colors">Cómo funciona</a>
                <a href="#pricing" className="text-sm text-[var(--text-muted)] hover:text-white transition-colors">Precios</a>
                <a href="#about" className="text-sm text-[var(--text-muted)] hover:text-white transition-colors">A cerca de</a>
            </div>

            <div className="flex items-center gap-3">
                <Link to="/auth/login">
                    <button className="text-sm text-[var(--text-muted)] border border-[var(--border-subtle)] px-4 py-2 rounded-lg hover:border-white/20 hover:text-white transition-all">
                        Iniciar sesión
                    </button>
                </Link>
                <Link to="/auth/register">
                    <button className="text-sm font-medium bg-[var(--warning-color)] text-white px-4 py-2 rounded-lg hover:opacity-90 transition-opacity">
                        Empezar gratis
                    </button>
                </Link>
            </div>
        </nav>
    )
}