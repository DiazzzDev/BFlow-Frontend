// components/Hero.tsx
export const Hero = () => {
    return (
        <div className="flex flex-col items-center text-center px-20 pt-24 pb-20 max-w-4xl mx-auto">
            <div className="flex items-center gap-2 bg-brand-accent/10 border border-brand-accent/20 text-brand-accent text-xs px-4 py-1.5 rounded-full mb-6">
                <div className="w-1.5 h-1.5 rounded-full bg-brand-accent" />
                Categorización inteligente con IA
            </div>

            <h1 className="text-6xl font-bold leading-tight tracking-tight mb-5">
                El control financiero que{" "}
                <span className="text-brand-accent">siempre quisiste</span>
            </h1>

            <p className="text-lg text-text-muted max-w-xl mb-9">
                Gestiona tus ingresos, gastos y billeteras compartidas en un solo lugar. Simple, potente y diseñado para tu día a día.
            </p>

            <div className="flex items-center gap-3 mb-4">
                <a href="/auth/register">
                    <button className="bg-brand-accent text-white text-sm font-medium px-7 py-3 rounded-xl hover:opacity-90 transition-opacity">
                        Empezar gratis
                    </button>
                </a>
            </div>

            <p className="text-xs text-text-label">
                Sin tarjeta de crédito · Gratis para siempre en el plan básico
            </p>
        </div>
    )
}
