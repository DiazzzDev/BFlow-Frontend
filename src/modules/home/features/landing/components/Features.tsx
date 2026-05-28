const features = [
    {
        title: "Billeteras compartidas",
        desc: "Controla gastos en conjunto con tu pareja, familia o equipo. Cada miembro con su propio rol.",
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
        desc: "Define límites de gasto por categoría y recibe alertas antes de superarlos.",
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
        desc: "Mueve dinero entre tus billeteras con un registro completo de cada transferencia.",
        icon: (
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M7 16V4m0 0L3 8m4-4 4 4M17 8v12m0 0 4-4m-4 4-4-4"/>
            </svg>
        ),
    },
    {
        title: "Historial completo",
        desc: "Accede a todo tu historial financiero con filtros por fecha, categoría, monto y más.",
        icon: (
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M3 3h18v4H3zM3 10h18v4H3zM3 17h18v4H3z"/>
            </svg>
        ),
    },
];

export const Features = () => {
    return (
        <section id="features" className="px-6 md:px-20 py-24">
            <div className="mx-auto">
                <p className="text-xs tracking-widest uppercase text-[#ff8a14] mb-3">Funcionalidades</p>
                <h2 className="text-4xl font-bold tracking-tight mb-3">Todo lo que necesitas para<br />controlar tus finanzas</h2>
                <p className="text-base text-text-muted max-w-lg">
                    Desde gastos diarios hasta billeteras compartidas con tu familia — BFlow lo tiene todo.
                </p>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-12">
                    {features.map(({ title, desc, icon }) => (
                        <div
                            key={title}
                            className="group relative bg-card border border-border rounded-2xl p-7 transition-all duration-300 hover:border-[#ff8a14]/30 hover:-translate-y-0.5 overflow-hidden"
                        >
                            {/* Hover glow */}
                            <div className="pointer-events-none absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                                style={{ background: "radial-gradient(ellipse at 50% 120%, rgba(255,138,20,0.07) 0%, transparent 70%)" }} />

                            <div className="relative z-10">
                                <div className="w-11 h-11 rounded-xl flex items-center justify-center text-[#ff8a14] mb-4 transition-all duration-300 group-hover:scale-110"
                                    style={{ background: "rgba(255,138,20,0.1)" }}>
                                    {icon}
                                </div>
                                <h3 className="text-base font-semibold mb-2">{title}</h3>
                                <p className="text-sm text-text-muted leading-relaxed">{desc}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
} 
