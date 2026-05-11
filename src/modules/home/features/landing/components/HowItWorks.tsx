// components/HowItWorks.tsx
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
        <section id="how" className="px-20 py-20 bg-surface">
            <div className="max-w-[1040px] mx-auto">
                <p className="text-xs tracking-widest uppercase text-warning mb-3">Cómo funciona</p>
                <h2 className="text-4xl font-bold tracking-tight mb-3">En 3 pasos simples</h2>
                <p className="text-base text-text-muted max-w-lg mb-12">
                    Sin configuraciones complicadas. Comienza a controlar tus finanzas en minutos.
                </p>

                <div className="grid grid-cols-3 gap-6">
                    {steps.map(({ number, title, desc }) => (
                        <div
                            key={number}
                            className="bg-card border border-border rounded-2xl p-7 relative"
                        >
                            <p className="absolute top-4 right-5 text-5xl font-extrabold text-[rgba(249,115,22,0.1)] leading-none select-none">
                                {number}
                            </p>
                            <h3 className="text-base font-semibold mb-2">{title}</h3>
                            <p className="text-sm text-text-muted leading-relaxed">{desc}</p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    )
}
