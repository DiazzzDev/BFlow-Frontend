import { useState } from "react"
import { Plus, Users, Wallet } from "lucide-react"

import { SummaryCard } from "../components/SummaryCards.tsx"
import { WalletCard } from "../components/WalletCards.tsx"
import { CreateWalletDialog } from "../components/CreateWalletDialog.tsx"
import { EmptyState } from "../components/EmptyState.tsx"
import { WalletLoader } from "../components/WalletLoader.tsx"
import { formatCurrency, formatDate } from "../../../../../utils/formaters.ts"
import { useGetWallets } from "../hooks/useGetWallets.ts"
import { usePostWallet } from "../hooks/usePostWallet.ts"

const dataTable = [
    {
        id: 1,
        movement: "Compra en Amazon",
        category: "Compras",
        date: "2026-06-01",
        amount: -50.00,
        wallet: "Legislative Office"
    },
    {
        id: 2,
        movement: "Sueldo",
        category: "Ingresos",
        date: "2026-06-01",
        amount: 2000.00,
        wallet: "Legislative Office"
    },
    {
        id: 3,
        movement: "Cena en restaurante",
        category: "Comida",
        date: "2026-06-02",
        amount: -30.00,
        wallet: "Legislative Office"
    },
    {
        id: 4,
        movement: "Pago de servicios",
        category: "Servicios",
        date: "2026-06-03",
        amount: -100.00,
        wallet: "Legislative Office"
    },
    {
        id: 5,
        movement: "Venta de bicicleta",
        category: "Ingresos",
        date: "2026-06-04",
        amount: 150.00,
        wallet: "Legislative Office"
    },
];

export const WalletsPage = () => {
    const { isLoading, data } = useGetWallets();
    const { mutate: createWallet, isPending: isCreating } = usePostWallet();
    const [isOpenModal, setIsOpenModal] = useState(false);

    const [activeTab, setActiveTab] = useState("wallets");
    const walletsToShow = activeTab === "wallets" ? data?.myWallets : data?.sharedWallets;
    return (
        <>
            <div className="flex flex-col md:flex-row gap-4 mb-6">
                <SummaryCard title="Balance total" quantity="$12,345.67" subtitle="En todas las carteras" />
                <SummaryCard title="Carteras activas" quantity="3" subtitle="2 compartidas" />
                <SummaryCard title="Gastos de este mes" quantity="$12,345.67" subtitle="vs $6,100 mes anterior" />
            </div>
            <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-1 border-b border-border">
                    <button
                        type="button"
                        onClick={() => setActiveTab("wallets")}
                        className={`px-3 py-2 text-base border-b-2 -mb-px cursor-pointer ${
                            activeTab === "wallets"
                                ? "border-primary text-primary"
                                : "border-transparent text-muted-foreground hover:text-foreground"
                        }`}
                    >
                        Mis billeteras
                    </button>
                    <button
                        type="button"
                        onClick={() => setActiveTab("sharedWallets")}
                        className={`px-3 py-2 text-base border-b-2 -mb-px cursor-pointer ${
                            activeTab === "sharedWallets"
                                ? "border-primary text-primary"
                                : "border-transparent text-muted-foreground hover:text-foreground"
                        }`}
                    >
                        Compartidas
                    </button>
                </div>
                <CreateWalletDialog
                    isShowBtn={activeTab === "wallets"}
                    open={isOpenModal}
                    onOpenChange={(open) => open ? setIsOpenModal(true): setIsOpenModal(false) }
                    onCreateWallet={createWallet}
                    isCreating={isCreating}
                />
            </div>
            <div className="h-px w-full bg-border mb-4" />
            <div className="grid grid-cols-[repeat(auto-fill,minmax(300px,1fr))] grid-rows-[repeat(auto-fill,minmax(175px,1fr))] gap-4">
                {isLoading && <WalletLoader />}
                {!isLoading && walletsToShow?.length === 0 && (
                    <EmptyState
                        Button={activeTab === "wallets" ? (
                            <button
                                type="button"
                                onClick={() => setIsOpenModal(true)}
                                className="inline-flex items-center gap-2 h-10 px-4 rounded-lg border border-border text-primary hover:bg-secondary cursor-pointer"
                            >
                                <Plus className="h-4 w-4" />
                                Crear billetera
                            </button>
                        ) : null}
                        titleText={activeTab === "wallets" ? "No tienes billeteras aún" : "No tienes billeteras compartidas"}
                        descriptionText={activeTab === "wallets" ? "Crea tu primera billetera para empezar a gestionar tus finanzas" : "Cuando alguien te invite a una billetera, aparecerá aquí"}
                        Icon={activeTab === "wallets" ? <Wallet /> : <Users />}
                    />
                )}
                {!isLoading && (walletsToShow || []).length > 0 && (walletsToShow || []).map(wallet => <WalletCard wallet={wallet} key={wallet.id} />)}
            </div>
            <div className="flex items-center justify-between mt-5 mb-3">
                <h2 className="text-foreground font-medium text-lg">Actividad reciente</h2>
                <h3 className="text-label">Todas mis billeteras</h3>
            </div>
            <div className="border border-border rounded-xl flex-1 bg-card overflow-hidden">
                <table className="w-full text-sm">
                    <thead>
                        <tr className="border-b border-border">
                            <th className="h-10 px-2 text-left font-medium text-foreground">Movimiento</th>
                            <th className="h-10 px-2 text-left font-medium text-foreground">Categoría</th>
                            <th className="h-10 px-2 text-left font-medium text-foreground">Fecha</th>
                            <th className="h-10 px-2 text-left font-medium text-foreground">Monto</th>
                        </tr>
                    </thead>
                    <tbody>
                        {dataTable.map(({ id, movement, category, date, amount, wallet }) => (
                            <tr key={id} className="border-b border-border last:border-0 cursor-pointer hover:bg-secondary transition-colors">
                                <td className="px-2 py-3 text-foreground">
                                    <div className="flex flex-col gap-1">
                                        <span className="text-base">{movement}</span>
                                        <span className="text-xs text-label">{wallet}</span>
                                    </div>
                                </td>
                                <td className="px-2 py-3 text-foreground">
                                    <span className="inline-flex rounded-md border border-border px-2 py-0.5 text-xs">
                                        {category}
                                    </span>
                                </td>
                                <td className="px-2 py-3 text-foreground">{formatDate(date)}</td>
                                <td className={`px-2 py-3 font-bold text-base ${amount < 0 ? "text-danger" : "text-success"}`}>
                                    {formatCurrency(amount)}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </>
    )
}
