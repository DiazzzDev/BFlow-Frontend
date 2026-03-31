import { SummaryCard } from "../components/SummaryCards"

export const WalletPage = () => {
    return (
        <>
            <div className="flex flex-col md:flex-row gap-4 mb-6">
                <SummaryCard title="Balance total" quantity="$12,345.67" subtitle="En todas las carteras" />
                <SummaryCard title="Carteras activas" quantity="3" subtitle="2 compartidas" />
                <SummaryCard title="Gastos de este mes" quantity="$12,345.67" subtitle="vs $6,100 mes anterior" />
            </div>
            <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold text-[var(--text-primary)]">Mis billeteras</h2>
                <button className="bg-[var(--btn-primary-bg)] font-semibold text-[var(--btn-primary-text)] px-4 py-2 rounded-lg transition-colors cursor-pointer border border-transparent hover:opacity-90">Crear billetera</button>
            </div>
            <div className="grid flex-1"></div>
        </>
    )
}