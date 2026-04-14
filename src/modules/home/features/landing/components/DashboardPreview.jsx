// components/DashboardPreview.jsx
export const DashboardPreview = () => {
    return (
        <div id="dashboard-preview" className="px-20 pb-20 max-w-[1200px] mx-auto w-full">
            <div className="bg-bg-surface border border-border rounded-2xl overflow-hidden p-6">

                {/* Dots */}
                <div className="flex items-center gap-2 mb-5">
                    <div className="w-2.5 h-2.5 rounded-full bg-[#ef4444]" />
                    <div className="w-2.5 h-2.5 rounded-full bg-[#f59e0b]" />
                    <div className="w-2.5 h-2.5 rounded-full bg-[#22c55e]" />
                </div>

                {/* Summary cards */}
                <div className="grid grid-cols-3 gap-3 mb-4">
                    {[
                        { label: "Balance total", value: "$65,660.55", sub: "en todas las billeteras" },
                        { label: "Billeteras activas", value: "5", sub: "3 propias · 2 compartidas" },
                        { label: "Gastos este mes", value: "-$8,620.00", sub: "vs $6,100 mes anterior", neg: true },
                    ].map(({ label, value, sub, neg }) => (
                        <div key={label} className="bg-bg-card border border-border rounded-xl p-4">
                            <p className="text-[10px] uppercase tracking-widest text-text-label mb-1.5">{label}</p>
                            <p className={`text-xl font-semibold mb-1 ${neg ? "text-danger" : "text-white"}`}>{value}</p>
                            <p className="text-[11px] text-text-label">{sub}</p>
                        </div>
                    ))}
                </div>

                {/* Wallet cards */}
                <div className="grid grid-cols-3 gap-3 mb-4">
                    {[
                        { name: "Bóveda Física", balance: "$12,450.00", pct: 21, color: "#f97316" },
                        { name: "Sapphire Prime", balance: "$45,000.00", pct: 24, color: "#3b82f6" },
                        { name: "Corporate Ops", balance: "$8,210.55", pct: 70, color: "#ef4444" },
                    ].map(({ name, balance, pct, color }) => (
                        <div key={name} className="bg-bg-card border border-border rounded-xl p-4">
                            <p className="text-sm font-medium mb-3">{name}</p>
                            <p className="text-[11px] text-text-label mb-1">Balance actual</p>
                            <p className="text-base font-semibold mb-3">{balance}</p>
                            <div className="flex justify-between text-[10px] text-text-label mb-1">
                                <span>Gasto del mes</span>
                                <span>{pct}%</span>
                            </div>
                            <div className="h-1 rounded-full bg-white/10">
                                <div className="h-full rounded-full" style={{ width: `${pct}%`, backgroundColor: color }} />
                            </div>
                        </div>
                    ))}
                </div>

                {/* Table */}
                <div className="bg-bg-card border border-border rounded-xl overflow-hidden">
                    <div className="grid grid-cols-[2fr_1fr_1fr] px-4 py-3 border-b border-border">
                        {["Concepto", "Categoría", "Monto"].map(h => (
                            <p key={h} className="text-[10px] uppercase tracking-widest text-text-label">{h}</p>
                        ))}
                    </div>
                    {[
                        { name: "Artisan Supplies Co.", wallet: "Bóveda Física", cat: "Equipamiento", amount: "-$420.00", neg: true },
                        { name: "Nómina — Octubre", wallet: "Corporate Ops", cat: "Ingresos", amount: "+$5,800.00", neg: false },
                        { name: "AWS — Infraestructura", wallet: "Corporate Ops", cat: "Tecnología", amount: "-$890.50", neg: true },
                    ].map(({ name, wallet, cat, amount, neg }) => (
                        <div key={name} className="grid grid-cols-[2fr_1fr_1fr] px-4 py-3 border-b border-[rgba(255,255,255,0.03)] last:border-0 items-center">
                            <div>
                                <p className="text-xs text-white">{name}</p>
                                <p className="text-[10px] text-text-label">{wallet}</p>
                            </div>
                            <span className="text-[10px] bg-white/5 text-text-muted px-2 py-1 rounded-full inline-block">{cat}</span>
                            <p className={`text-xs font-semibold text-right ${neg ? "text-danger" : "text-success"}`}>{amount}</p>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}