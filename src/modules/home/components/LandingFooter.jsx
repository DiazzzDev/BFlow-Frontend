import { Link } from "react-router-dom"

import { useLandingHome } from "../hooks/custom/useLandingHome.jsx";

// components/LandingFooter.jsx
export const LandingFooter = () => {
    const { navLinks, handleNavClick } = useLandingHome();

    return (
        <footer className="border-t border-[var(--border-subtle)] px-20 pt-12 pb-8">
            <div className="grid grid-cols-[2fr_1fr_1fr_1fr] gap-10 mb-12">
                <div>
                    <div className="text-lg font-bold mb-3">
                        B<span className="text-[var(--warning-color)]">Flow</span>
                    </div>
                    <p className="text-sm text-[var(--text-muted)] leading-relaxed max-w-[240px]">
                        Control financiero inteligente para individuos, parejas y familias.
                    </p>
                </div>

                <div>
                    <h4 className="text-sm font-semibold mb-4">Producto</h4>
                    <div className="flex flex-col gap-3">
                        {navLinks.map(({ label, id }) => (
                            <button key={id} onClick={() => handleNavClick(id)} className="text-sm text-[var(--text-muted)] hover:text-white transition-colors text-left cursor-pointer">
                                {label}
                            </button>
                        ))}
                    </div>
                </div>

                <div>
                    <h4 className="text-sm font-semibold mb-4">Empresa</h4>
                    {/* Esto todavia no esta implementado */}
                    <div className="flex flex-col gap-3">
                        <a href="/about" className="text-sm text-[var(--text-muted)] hover:text-white transition-colors">A cerca de</a>
                        <a href="#" className="text-sm text-[var(--text-muted)] hover:text-white transition-colors">Blog</a>
                        <a href="#" className="text-sm text-[var(--text-muted)] hover:text-white transition-colors">Contacto</a>
                    </div>
                </div>

                <div>
                    <h4 className="text-sm font-semibold mb-4">Legal</h4>
                    <div className="flex flex-col gap-3">
                        <Link to="/privacy" className="text-sm text-[var(--text-muted)] hover:text-white transition-colors">Política de privacidad</Link>
                        <Link to="/terms" className="text-sm text-[var(--text-muted)] hover:text-white transition-colors">Términos de uso</Link>
                        {/* Esto de cookies no esta todavia */}
                        <Link to="#" className="text-sm text-[var(--text-muted)] hover:text-white transition-colors">Cookies</Link>
                    </div>
                </div>
            </div>

            <div className="flex items-center justify-center border-t border-[var(--border-subtle)] pt-6">
                <p className="text-xs text-[var(--text-label)]">© 2026 BFlow. Todos los derechos reservados.</p>
            </div>
        </footer>
    )
}