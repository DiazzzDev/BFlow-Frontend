export const CTASection = () => {
    return (
        <section className="px-20 pb-20">
            <div className="bg-surface border border-primary-15 rounded-2xl px-16 py-16 text-center">
                <h2 className="text-4xl font-bold tracking-tight mb-4">
                    Comienza a controlar tus<br />finanzas hoy
                </h2>
                <p className="text-base text-helper mb-8">
                    Más de 10,000 personas ya usan BFlow para tomar el control de su dinero.
                </p>
                <div className="flex items-center justify-center gap-3">
                    <a href="/auth/register">
                        <button className="bg-primary text-light text-sm font-medium px-7 py-3 rounded-xl hover:bg-primary-dark transition-colors cursor-pointer">
                            Crear cuenta gratis
                        </button>
                    </a>
                </div>
            </div>
        </section>
    )
}
