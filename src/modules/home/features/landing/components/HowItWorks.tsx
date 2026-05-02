// components/HowItWorks.tsx
const steps = [
    {
        number: "01",
        title: "Creá tu cuenta",
        desc: "Registrate con tu email o Google en menos de 30 segundos. Sin tarjeta de crédito requerida.",
    },
    {
        number: "02",
        title: "Agregá tus billeteras",
        desc: "Creá billeteras para cada cuenta bancaria, efectivo o tarjeta. Invitá miembros si querés compartirlas.",
    },
    {
        number: "03",
        title: "Controlá tus finanzas",
        desc: "Registrá movimientos, definí presupuestos y visualizá tu situación financiera en tiempo real.",
    },
];

export const HowItWorks = () => {
    return (
        <section id="how" className="px-20 py-20 bg-[var(--bg-sidebar)]">
            <div className="max-w-[1040px] mx-auto">
                <p className="text-xs tracking-widest uppercase text-[var(--warning-color)] mb-3">Cómo funciona</p>
                <h2 className="text-4xl font-bold tracking-tight mb-3">En 3 pasos simples</h2>
                <p className="text-base text-[var(--text-muted)] max-w-lg mb-12">
                    Sin configuraciones complicadas. Empezás a controlar tus finanzas en minutos.
                </p>

                <div className="grid grid-cols-3 gap-6">
                    {steps.map(({ number, title, desc }) => (
                        <div
                            key={number}
                            className="bg-[var(--bg-card)] border border-[var(--border-subtle)] rounded-2xl p-7 relative"
                        >
                            <p className="absolute top-4 right-5 text-5xl font-extrabold text-[rgba(249,115,22,0.1)] leading-none select-none">
                                {number}
                            </p>
                            <h3 className="text-base font-semibold mb-2">{title}</h3>
                            <p className="text-sm text-[var(--text-muted)] leading-relaxed">{desc}</p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    )
}
