// components/CTASection.tsx
export const CTASection = () => {
    return (
        <section className="px-20 pb-20">
            <div className="bg-card border border-[rgba(249,115,22,0.15)] rounded-2xl px-16 py-16 text-center">
                <h2 className="text-4xl font-bold tracking-tight mb-4">
                    Comienza a controlar tus<br />finanzas hoy
                </h2>
                <p className="text-base text-text-muted mb-8">
                    Más de 10,000 personas ya usan BFlow para tomar el control de su dinero.
                </p>
                <div className="flex items-center justify-center gap-3">
                    <a href="/auth/register">
                        <button className="bg-warning text-white text-sm font-medium px-7 py-3 rounded-xl hover:opacity-90 transition-opacity cursor-pointer">
                            Crear cuenta gratis
                        </button>
                    </a>
                </div>
            </div>
        </section>
    )
}
