// components/Stats.jsx
export const Stats = () => {
    const stats = [
        { value: "10K+", label: "Usuarios activos" },
        { value: "$2M+", label: "Gestionados por mes" },
        { value: "98%",  label: "Satisfacción" },
        { value: "4.9★", label: "Valoración promedio" },
    ];

    return (
        <div className="px-20 pb-20 max-w-[1040px] mx-auto w-full">
            <div className="grid grid-cols-4 border border-border rounded-2xl overflow-hidden">
                {stats.map(({ value, label }, i) => (
                    <div
                        key={label}
                        className={`bg-bg-card px-6 py-8 text-center ${i !== stats.length - 1 ? "border-r border-border" : ""}`}
                    >
                        <p className="text-4xl font-bold text-brand-accent mb-2">{value}</p>
                        <p className="text-sm text-text-muted">{label}</p>
                    </div>
                ))}
            </div>
        </div>
    )
}