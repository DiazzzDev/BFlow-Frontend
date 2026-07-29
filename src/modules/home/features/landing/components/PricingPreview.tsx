const plans = [
    {
        name: "Free",
        price: "$0",
        desc: "Para empezar a ordenar tus finanzas personales.",
        featured: false,
        btnText: "Empezar gratis",
        btnStyle: "outline" as const,
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
        btnStyle: "filled" as const,
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
        btnStyle: "outline" as const,
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
            <p className="text-xs tracking-widest uppercase text-primary mb-3">Precios</p>
            <h2 className="text-4xl font-bold tracking-tight mb-3">Simple y transparente</h2>
            <p className="text-base text-helper max-w-lg mb-12">
                Sin costos ocultos. Cambiá de plan cuando quieras.
            </p>

            <div className="grid grid-cols-3 gap-4">
                {plans.map(({ name, price, desc, featured, btnText, btnStyle, features }) => (
                    <div
                        key={name}
                        className={`bg-surface rounded-2xl p-7 relative ${
                            featured
                                ? "border border-primary"
                                : "border border-light-10"
                        }`}
                    >
                        {featured && (
                            <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-primary text-light text-xs font-semibold px-4 py-1 rounded-full whitespace-nowrap">
                                Más popular
                            </div>
                        )}

                        <p className="text-sm text-helper mb-2">{name}</p>
                        <p className="text-4xl font-bold mb-1">
                            {price}<span className="text-base font-normal text-helper">/mes</span>
                        </p>
                        <p className="text-sm text-helper mb-6">{desc}</p>

                        <hr className="border-light-10 mb-5" />

                        <div className="flex flex-col gap-3 mb-6">
                            {features.map(({ text, active }) => (
                                <div
                                    key={text}
                                    className={`flex items-center gap-2.5 text-sm ${
                                        active ? "text-helper" : "text-label"
                                    }`}
                                >
                                    <span className={active ? "text-primary" : "text-label"}>
                                        {active ? <CheckIcon /> : <XIcon />}
                                    </span>
                                    {text}
                                </div>
                            ))}
                        </div>

                        <button
                            className={`w-full py-2.5 rounded-lg text-sm font-medium transition-all cursor-pointer ${
                                btnStyle === "filled"
                                    ? "bg-primary text-light hover:bg-primary-dark"
                                    : "bg-transparent border border-light-10 text-helper hover:border-light-25 hover:text-light"
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
