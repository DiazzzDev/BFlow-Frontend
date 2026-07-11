const steps = [
    {
        number: "01",
        title: "Crea tu cuenta",
        desc: "Regístrate con tu email o Google en menos de 30 segundos. Sin tarjeta de crédito requerida.",
    },
    {
        number: "02",
        title: "Agrega tus billeteras",
        desc: "Crea billeteras para cada cuenta bancaria, efectivo o tarjeta. Invita miembros si deseas compartirlas.",
    },
    {
        number: "03",
        title: "Controla tus finanzas",
        desc: "Registra movimientos, define presupuestos y visualiza tu situación financiera en tiempo real.",
    },
];

export const HowItWorks = () => {
    return (
        <section id="how" className="px-6 md:px-20 py-24 bg-surface relative overflow-hidden">
            <div className="pointer-events-none absolute top-0 left-1/2 -translate-x-1/2 h-px w-3/4 bg-linear-to-r from-transparent via-primary-50 to-transparent" />

            <div className="mx-auto">
                <p className="text-xs tracking-widest uppercase text-primary mb-3">Cómo funciona</p>
                <h2 className="text-4xl font-bold tracking-tight mb-3">En 3 pasos simples</h2>

                <p className="text-base text-muted-foreground max-w-lg mb-16">
                    Sin configuraciones complicadas. Comienza a controlar tus finanzas en minutos.
                </p>

                <div className="relative grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="pointer-events-none absolute hidden md:block top-7 left-[calc(33%+1.5rem)] right-[calc(33%+1.5rem)] h-px border-t border-dashed border-primary-25" />

                    {steps.map(({ number, title, desc }, i) => (
                        <div
                            key={number}
                            className="relative bg-card border border-border rounded-2xl p-7 hover:border-primary-25 transition-colors duration-300"
                        >
                            <div
                                className={`w-14 h-14 rounded-xl flex items-center justify-center mb-5 font-bold text-sm border ${
                                    i === 0
                                        ? "bg-primary-15 border-primary-25 text-primary"
                                        : "bg-dark-10 border-border text-muted-foreground"
                                }`}
                            >
                                {number}
                            </div>

                            <h3 className="text-base font-semibold mb-2">{title}</h3>
                            <p className="text-sm text-muted-foreground leading-relaxed">{desc}</p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};
