// components/Stats.tsx
export const Stats = () => {
    const stats = [
        { value: "100+", label: "Usuarios activos" },
        { value: "$2K+", label: "Gestionados por mes" },
        { value: "90%",  label: "Satisfacción" },
    ];

    return (
        <div className="px-20 pb-20 max-w-[1040px] mx-auto w-full">
            <div className="grid grid-cols-3 border border-light-10 rounded-2xl overflow-hidden">
                {stats.map(({ value, label }, i) => (
                    <div
                        key={label}
                        className={`bg-surface px-6 py-8 text-center ${i !== stats.length - 1 ? "border-r border-light-10" : ""}`}
                    >
                        <p className="text-4xl font-bold text-primary mb-2">{value}</p>
                        <p className="text-sm text-helper">{label}</p>
                    </div>
                ))}
            </div>
        </div>
    )
}
