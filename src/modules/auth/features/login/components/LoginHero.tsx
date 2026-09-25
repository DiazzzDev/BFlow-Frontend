import { TrendingUp, TrendingDown, Wallet, ArrowUpRight } from "lucide-react";

const stats = [
    { label: "Balance total", value: "$12,450.00", change: "+8.2%", up: true },
    { label: "Gastos del mes", value: "$1,830.40", change: "-3.1%", up: false },
    { label: "Ingresos del mes", value: "$4,200.00", change: "+12%", up: true },
];

const recentMovements = [
    { name: "Salario", category: "Ingreso", amount: "+$3,200", up: true },
    { name: "Netflix", category: "Entretenimiento", amount: "-$18", up: false },
    { name: "Supermercado", category: "Alimentación", amount: "-$145", up: false },
];

export const LoginHero = () => {
    return (
        <div className="max-w-xl space-y-3 mt-4">
            {/* Stats row */}
            <div className="grid grid-cols-3 gap-2">
                {stats.map((stat) => (
                    <div
                        key={stat.label}
                        className="rounded-2xl border border-light-10 bg-light-5 p-3.5 backdrop-blur-xl"
                    >
                        <p className="text-[10px] text-helper mb-1.5 truncate">{stat.label}</p>
                        <p className="text-sm font-semibold leading-tight">{stat.value}</p>
                        <span
                            className={`mt-1.5 inline-flex items-center gap-0.5 text-[10px] font-medium ${
                                stat.up ? "text-success" : "text-danger"
                            }`}
                        >
                            {stat.up ? (
                                <TrendingUp size={10} />
                            ) : (
                                <TrendingDown size={10} />
                            )}
                            {stat.change}
                        </span>
                    </div>
                ))}
            </div>

            {/* Recent movements card */}
            <div className="rounded-2xl border border-light-10 bg-light-5 p-4 backdrop-blur-xl">
                <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                        <div className="flex h-6 w-6 items-center justify-center rounded-md bg-primary/20">
                            <Wallet size={12} className="text-primary" />
                        </div>
                        <p className="text-xs font-medium">Actividad reciente</p>
                    </div>
                    <ArrowUpRight size={13} className="text-helper" />
                </div>

                <div className="flex flex-col gap-2.5">
                    {recentMovements.map((m) => (
                        <div key={m.name} className="flex items-center justify-between">
                            <div className="flex items-center gap-2.5">
                                <div className={`h-7 w-7 rounded-lg flex items-center justify-center text-[10px] font-bold ${
                                    m.up ? "bg-success/15 text-success" : "bg-light-10 text-helper"
                                }`}>
                                    {m.name[0]}
                                </div>
                                <div>
                                    <p className="text-xs font-medium leading-none">{m.name}</p>
                                    <p className="text-[10px] text-helper mt-0.5">{m.category}</p>
                                </div>
                            </div>
                            <span className={`text-xs font-semibold ${m.up ? "text-success" : "text-light"}`}>
                                {m.amount}
                            </span>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};