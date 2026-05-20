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

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table.tsx"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs.tsx"
import { Badge } from "@/components/ui/badge.tsx"
import { Button } from "@/components/ui/button.tsx"
import { Separator } from "@/components/ui/separator.tsx"



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
                <div className="flex items-center g-3">
                    <Tabs defaultValue="wallets">
                        <TabsList variant="line">
                            <TabsTrigger value="wallets" onClick={() => setActiveTab("wallets")} className="text-base">Mis billeteras</TabsTrigger>
                            <TabsTrigger value="sharedWallets" onClick={() => setActiveTab("sharedWallets")} className="text-base">Compartidas</TabsTrigger>
                        </TabsList>
                    </Tabs>
                </div>
                <CreateWalletDialog
                    isShowBtn={activeTab === "wallets"}
                    open={isOpenModal}
                    onOpenChange={(open) => open ? setIsOpenModal(true): setIsOpenModal(false) }
                    onCreateWallet={createWallet}
                    isCreating={isCreating}
                />
            </div>
            <Separator className="mb-4"/>
            <div className="grid grid-cols-[repeat(auto-fill,minmax(300px,1fr))] grid-rows-[repeat(auto-fill,minmax(175px,1fr))] gap-4">
                {isLoading && <WalletLoader />}
                {!isLoading && walletsToShow?.length === 0 && (
                    <EmptyState
                        Button={activeTab === "wallets" ? <Button variant="secondary" onClick={() => setIsOpenModal(true)}><Plus className="h-4 w-4" />Crear billetera</Button> : null}
                        titleText={activeTab === "wallets" ? "No tienes billeteras aún" : "No tienes billeteras compartidas"}
                        descriptionText={activeTab === "wallets" ? "Crea tu primera billetera para empezar a gestionar tus finanzas" : "Cuando alguien te invite a una billetera, aparecerá aquí"}
                        Icon={activeTab === "wallets" ? <Wallet /> : <Users />}
                    />
                )}
                {!isLoading && (walletsToShow || []).length > 0 && (walletsToShow || []).map(wallet => <WalletCard wallet={wallet} key={wallet.id} />)}
            </div>
            <div className="flex items-center justify-between mt-5 mb-3">
                <h2 className="text-foreground font-medium text-lg">Actividad reciente</h2>
                <h3 className="text-text-label">Todas mis billeteras</h3>
            </div>
            <div className="border border-border rounded-xl flex-1 bg-card">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead className="text-foreground">Movimiento</TableHead>
                            <TableHead className="text-foreground">Categoría</TableHead>
                            <TableHead className="text-foreground">Fecha</TableHead>
                            <TableHead className="text-foreground">Monto</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {dataTable.map(({ id, movement, category, date, amount, wallet }) => (
                            <TableRow key={id} className="cursor-pointer hover:bg-[var(--secondary)] transition-colors">
                                <TableCell className="text-foreground flex flex-col gap-1">
                                    <span className="text-base">{movement}</span>
                                    <span className="text-xs text-text-label">{wallet}</span>
                                </TableCell>
                                <TableCell className="text-foreground"><Badge variant="outline">{category}</Badge></TableCell>
                                <TableCell className="text-foreground">{formatDate(date)}</TableCell>
                                <TableCell className={amount < 0 ? "text-red-500 font-bold text-base" : "text-green-500 font-bold text-base"}>{amount < 0 ? `${formatCurrency(amount)}` : `${formatCurrency(amount)}`}</TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>
        </>
    )
}

