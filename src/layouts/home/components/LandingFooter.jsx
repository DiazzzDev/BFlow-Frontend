// components/LandingFooter.jsx
export const LandingFooter = () => {
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
                        <a href="#features" className="text-sm text-[var(--text-muted)] hover:text-white transition-colors">Funcionalidades</a>
                        <a href="#pricing" className="text-sm text-[var(--text-muted)] hover:text-white transition-colors">Precios</a>
                        <a href="#how" className="text-sm text-[var(--text-muted)] hover:text-white transition-colors">Cómo funciona</a>
                        <a href="#" className="text-sm text-[var(--text-muted)] hover:text-white transition-colors">Changelog</a>
                    </div>
                </div>

                <div>
                    <h4 className="text-sm font-semibold mb-4">Empresa</h4>
                    <div className="flex flex-col gap-3">
                        <a href="/about" className="text-sm text-[var(--text-muted)] hover:text-white transition-colors">A cerca de</a>
                        <a href="#" className="text-sm text-[var(--text-muted)] hover:text-white transition-colors">Blog</a>
                        <a href="#" className="text-sm text-[var(--text-muted)] hover:text-white transition-colors">Contacto</a>
                    </div>
                </div>

                <div>
                    <h4 className="text-sm font-semibold mb-4">Legal</h4>
                    <div className="flex flex-col gap-3">
                        <a href="/privacy" className="text-sm text-[var(--text-muted)] hover:text-white transition-colors">Política de privacidad</a>
                        <a href="/terms" className="text-sm text-[var(--text-muted)] hover:text-white transition-colors">Términos de uso</a>
                        <a href="#" className="text-sm text-[var(--text-muted)] hover:text-white transition-colors">Cookies</a>
                    </div>
                </div>
            </div>

            <div className="flex items-center justify-between border-t border-[var(--border-subtle)] pt-6">
                <p className="text-xs text-[var(--text-label)]">© 2025 BFlow. Todos los derechos reservados.</p>
                <div className="flex items-center gap-5">
                    <a href="/privacy" className="text-xs text-[var(--text-label)] hover:text-[var(--text-muted)] transition-colors">Privacidad</a>
                    <a href="/terms" className="text-xs text-[var(--text-label)] hover:text-[var(--text-muted)] transition-colors">Términos</a>
                    <a href="#" className="text-xs text-[var(--text-label)] hover:text-[var(--text-muted)] transition-colors">Cookies</a>
                </div>
            </div>
        </footer>
    )
}