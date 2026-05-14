// components/PricingPreview.tsx
const plans = [
    {
        name: "Free",
        price: "$0",
        desc: "Para empezar a ordenar tus finanzas personales.",
        featured: false,
        btnText: "Empezar gratis",
        btnStyle: "outline",
        features: [
            { text: "Hasta 2 billeteras", active: true },
            { text: "Gastos e ingresos ilimitados", active: true },
            { text: "1 usuario por billetera", active: true },
            { text: "Billeteras compartidas", active: false },
            { text: "Presupuestos", active: false },
            { text: "Categorización con IA", active: false },
        ],
    },
    {
        name: "Pro",
        price: "$9",
        desc: "Para quienes quieren control total de sus finanzas.",
        featured: true,
        btnText: "Empezar con Pro",
        btnStyle: "filled",
        features: [
            { text: "Billeteras ilimitadas", active: true },
            { text: "Gastos e ingresos ilimitados", active: true },
            { text: "Hasta 3 miembros por billetera", active: true },
            { text: "Billeteras compartidas", active: true },
            { text: "Presupuestos con alertas", active: true },
            { text: "Categorización con IA", active: false },
        ],
    },
    {
        name: "Family",
        price: "$19",
        desc: "Para familias y equipos que quieren el máximo control.",
        featured: false,
        btnText: "Contactar ventas",
        btnStyle: "outline",
        features: [
            { text: "Todo de Pro incluido", active: true },
            { text: "Miembros ilimitados", active: true },
            { text: "Categorización con IA", active: true },
            { text: "Exportación de reportes", active: true },
            { text: "Soporte prioritario", active: true },
            { text: "API access", active: true },
        ],
    },
];

const CheckIcon = () => (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M20 6 9 17l-5-5"/>
    </svg>
);

const XIcon = () => (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M18 6 6 18M6 6l12 12"/>
    </svg>
);

export const PricingPreview = () => {
    return (
        <section id="pricing" className="px-20 py-20">
            <p className="text-xs tracking-widest uppercase text-warning mb-3">Precios</p>
            <h2 className="text-4xl font-bold tracking-tight mb-3">Simple y transparente</h2>
            <p className="text-base text-text-muted max-w-lg mb-12">
                Sin costos ocultos. Cambiá de plan cuando quieras.
            </p>

            <div className="grid grid-cols-3 gap-4">
                {plans.map(({ name, price, desc, featured, btnText, btnStyle, features }) => (
                    <div
                        key={name}
                        className={`bg-[var(--bg-card)] rounded-2xl p-7 relative bg-card ${
                            featured
                                ? "border border-warning"
                                : "border border-border-subtle"
                        }`}
                    >
                        {featured && (
                            <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-warning text-white text-xs font-semibold px-4 py-1 rounded-full whitespace-nowrap">
                                Más popular
                            </div>
                        )}

                        <p className="text-sm text-text-muted mb-2">{name}</p>
                        <p className="text-4xl font-bold mb-1">
                            {price}<span className="text-base font-normal text-text-muted">/mes</span>
                        </p>
                        <p className="text-sm text-text-muted mb-6">{desc}</p>

                        <hr className="border-border-subtle mb-5" />

                        <div className="flex flex-col gap-3 mb-6">
                            {features.map(({ text, active }) => (
                                <div
                                    key={text}
                                    className={`flex items-center gap-2.5 text-sm ${
                                        active ? "text-text-muted" : "text-text-label"
                                    }`}
                                >
                                    <span className={active ? "text-warning" : "text-label"}>
                                        {active ? <CheckIcon /> : <XIcon />}
                                    </span>
                                    {text}
                                </div>
                            ))}
                        </div>

                        <button
                            className={`w-full py-2.5 rounded-lg text-sm font-medium transition-all cursor-pointer ${
                                btnStyle === "filled"
                                    ? "bg-warning text-white hover:opacity-90"
                                    : "bg-transparent border border-border-subtle text-text-muted hover:border-white/20 hover:text-white"
                            }`}
                        >
                            {btnText}
                        </button>
                    </div>
                ))}
            </div>
        </section>
    )
}
