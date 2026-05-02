// components/Features.tsx
const features = [
    {
        title: "Billeteras compartidas",
        desc: "Controlá gastos en conjunto con tu pareja, familia o equipo. Cada miembro con su propio rol.",
        icon: (
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="2" y="5" width="20" height="14" rx="2"/><path d="M16 12h2"/>
            </svg>
        ),
    },
    {
        title: "Control de ingresos y gastos",
        desc: "Registrá todos tus movimientos manualmente, por voz, recibo o importación automática.",
        icon: (
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/>
            </svg>
        ),
    },
    {
        title: "Presupuestos inteligentes",
        desc: "Definí límites de gasto por categoría y recibí alertas antes de superarlos.",
        icon: (
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="2" y="3" width="20" height="14" rx="2"/><path d="M8 21h8M12 17v4"/>
            </svg>
        ),
    },
    {
        title: "Categorización con IA",
        desc: "Cada movimiento se categoriza automáticamente con inteligencia artificial. Vos solo revisás.",
        icon: (
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="3"/><path d="M12 2v2M12 20v2M2 12h2M20 12h2"/>
            </svg>
        ),
    },
    {
        title: "Transferencias entre billeteras",
        desc: "Mové dinero entre tus billeteras con un registro completo de cada transferencia.",
        icon: (
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M7 16V4m0 0L3 8m4-4 4 4M17 8v12m0 0 4-4m-4 4-4-4"/>
            </svg>
        ),
    },
    {
        title: "Historial completo",
        desc: "Accedé a todo tu historial financiero con filtros por fecha, categoría, monto y más.",
        icon: (
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M3 3h18v4H3zM3 10h18v4H3zM3 17h18v4H3z"/>
            </svg>
        ),
    },
];

export const Features = () => {
    return (
        <section id="features" className="px-20 py-20">
            <p className="text-xs tracking-widest uppercase text-brand-accent mb-3">Funcionalidades</p>
            <h2 className="text-4xl font-bold tracking-tight mb-3">Todo lo que necesitás para<br/>controlar tus finanzas</h2>
            <p className="text-base text-text-muted max-w-lg">
                Desde gastos diarios hasta billeteras compartidas con tu familia — BFlow lo tiene todo.
            </p>

            <div className="grid grid-cols-3 gap-4 mt-12">
                {features.map(({ title, desc, icon }) => (
                    <div
                        key={title}
                        className="bg-bg-card border border-border rounded-2xl p-7 hover:border-brand-accent/30 transition-colors"
                    >
                        <div className="w-11 h-11 rounded-xl bg-brand-accent/10 flex items-center justify-center text-brand-accent mb-4">
                            {icon}
                        </div>
                        <h3 className="text-base font-semibold mb-2">{title}</h3>
                        <p className="text-sm text-text-muted leading-relaxed">{desc}</p>
                    </div>
                ))}
            </div>
        </section>
    )
}
