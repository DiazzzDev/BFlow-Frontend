import { useState } from "react"
import { Users, Wallet } from "lucide-react"

import { Tabs, TabsList, TabsTrigger } from "../../../../components/ui/tabs.jsx"
import { SummaryCard } from "../components/SummaryCards.jsx"
import { WalletCard } from "../components/WalletCards.jsx"
import { useGetWallets } from "../hooks/useWallets.jsx"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../../../../components/ui/table.jsx"
import { formatCurrency, formatDate } from "../../../../utils/formaters.js"
import { Badge } from "../../../../components/ui/badge.jsx"
import { CreateWalletDialog } from "../components/CreateWalletDialog.jsx"
import { EmptyState } from "../components/EmptyState.jsx"
import { ButtonEmpty } from "../components/ButtonEmpty.jsx"
import { WalletLoader } from "../components/WalletLoader.jsx"

const dataTable = [
    {
        id: 1,
        movement: "Compra en Amazon",
        category: "Compras",
        date: "2024-06-01",
        amount: -50.00,
        wallet: "Legislative Office"
    },
    {
        id: 2,
        movement: "Sueldo",
        category: "Ingresos",
        date: "2024-06-01",
        amount: 2000.00,
        wallet: "Legislative Office"
    },
    {
        id: 3,
        movement: "Cena en restaurante",
        category: "Comida",
        date: "2024-06-02",
        amount: -30.00,
        wallet: "Legislative Office"
    },
    {
        id: 4,
        movement: "Pago de servicios",
        category: "Servicios",
        date: "2024-06-03",
        amount: -100.00,
        wallet: "Legislative Office"
    },
    {
        id: 5,
        movement: "Venta de bicicleta",
        category: "Ingresos",
        date: "2024-06-04",
        amount: 150.00,
        wallet: "Legislative Office"
    },
];

export const WalletsPage = () => {
    const { wallets, sharedWallets, isloading } = useGetWallets();
    const [activeTab, setActiveTab] = useState("wallets");
    const [openDialog, setOpenDialog] = useState(false);
    const data = activeTab === "wallets" ? wallets : sharedWallets;
    return (
        <>
            <div className="flex flex-col md:flex-row gap-4 mb-6">
                <SummaryCard title="Balance total" quantity="$12,345.67" subtitle="En todas las carteras" />
                <SummaryCard title="Carteras activas" quantity="3" subtitle="2 compartidas" />
                <SummaryCard title="Gastos de este mes" quantity="$12,345.67" subtitle="vs $6,100 mes anterior" />
            </div>
            <div className="flex items-center justify-between mb-4">
                <div className="flex items-center g-3">
                    <Tabs defaultValue="wallets" className="bg-transparent border-b">
                        <TabsList>
                            <TabsTrigger value="wallets" onClick={() => setActiveTab("wallets")} className="text-base">Mis billeteras</TabsTrigger>
                            <TabsTrigger value="sharedWallets" onClick={() => setActiveTab("sharedWallets")} className="text-base">Compartidas</TabsTrigger>
                        </TabsList>
                    </Tabs>
                </div>
                <CreateWalletDialog isShowBtn={activeTab === "wallets"} open={openDialog} onOpenChange={setOpenDialog} />
            </div>
            <div className="grid grid-cols-[repeat(auto-fill,minmax(300px,1fr))] grid-rows-[repeat(auto-fill,minmax(175px,1fr))] gap-4">
                {isloading && <WalletLoader />}
                {!isloading && data.length === 0 && (
                    <EmptyState
                        Button={activeTab === "wallets" ? <ButtonEmpty onCreateClick={() => setOpenDialog(true)} /> : null}
                        titleText={activeTab === "wallets" ? "No tienes billeteras aún" : "No tienes billeteras compartidas"}
                        descriptionText={activeTab === "wallets" ? "Crea tu primera billetera para empezar a gestionar tus finanzas" : "Cuando alguien te invite a una billetera, aparecerá aquí"}
                        Icon={activeTab === "wallets" ? <Wallet /> : <Users />}
                    />
                )}
                {!isloading && data.length > 0 && data.map(wallet => <WalletCard wallet={wallet} key={wallet.id} />)}
            </div>
            <div className="flex items-center justify-between mt-5 mb-3">
                <h2 className="text-[var(--text-primary)] font-medium text-lg">Actividad reciente</h2>
                <h3 className="text-[var(--text-label)]">Todas mis billeteras</h3>
            </div>
            <div className="border border-[var(--border)] rounded-xl flex-1 bg-[var(--bg-card)]">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Movimiento</TableHead>
                            <TableHead>Categoria</TableHead>
                            <TableHead>Fecha</TableHead>
                            <TableHead>Monto</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {dataTable.map(({ id, movement, category, date, amount, wallet }) => (
                            <TableRow key={id} className="cursor-pointer hover:bg-[var(--bg-card-hover)] transition-colors">
                                <TableCell className="text-[var(--text-primary)] flex flex-col gap-1">
                                    <span className="text-base">{movement}</span>
                                    <span className="text-xs text-muted-foreground">{wallet}</span>
                                </TableCell>
                                <TableCell className="text-[var(--text-primary)]"><Badge variant="outline">{category}</Badge></TableCell>
                                <TableCell className="text-[var(--text-primary)]">{formatDate(date)}</TableCell>
                                <TableCell className={amount < 0 ? "text-red-500 font-bold text-base" : "text-green-500 font-bold text-base"}>{amount < 0 ? `${formatCurrency(amount)}` : `${formatCurrency(amount)}`}</TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>
        </>
    )
}