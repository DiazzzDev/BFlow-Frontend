import { useParams } from "react-router";
import { useMemo, useState } from "react";
import { ArrowLeftRight, Plus, Receipt } from "lucide-react";

import { WalletItem } from "../wallets/components/WalletItem";
import { WalletItemSkeleton } from "../wallets/components/WalletItemSkeleton";

import { useGetWallet } from "./hooks/useGetWallet";
import { WalletViewSidebar } from "./components/WalletViewSidebar";

import { CustomEmptyState } from "@/components/custom/CustomEmptyState";
import { SearchInput } from "@/components/controls/SearchInput";
import { Button } from "@/components/controls/Button";
import { formatCurrency } from "@/utils/formatters/formatCurrency";

type DetailTab = "overview" | "incomes" | "expenses" | "transfers" | "settings";

const TABS: Array<{ id: DetailTab; label: string }> = [
    { id: "overview", label: "Overview" },
    { id: "incomes", label: "Incomes" },
    { id: "expenses", label: "Expenses" },
    { id: "transfers", label: "Transfers" },
    { id: "settings", label: "Settings" },
];

const MOCK_TRANSACTIONS = [
    {
        id: "1",
        title: "Netflix subscription",
        subtitle: "Edwin Diaz",
        category: "Entertainment",
        dateLabel: "Oct 23, 2025",
        amount: -8.99,
    },
    {
        id: "2",
        title: "Spotify Premium",
        subtitle: "Edwin Diaz",
        category: "Entertainment",
        dateLabel: "Oct 23, 2025",
        amount: 8.99,
    },
    {
        id: "3",
        title: "Amazon Prime",
        subtitle: "Edwin Diaz",
        category: "Shopping",
        dateLabel: "Oct 22, 2025",
        amount: -14.99,
    },
    {
        id: "4",
        title: "Salary deposit",
        subtitle: "Edwin Diaz",
        category: "Income",
        dateLabel: "Oct 20, 2025",
        amount: 2500,
    },
    {
        id: "5",
        title: "Gym membership",
        subtitle: "Edwin Diaz",
        category: "Health",
        dateLabel: "Oct 18, 2025",
        amount: -29.99,
    },
];

const MOCK_UPCOMING = [
    { label: "Netflix", when: "Tomorrow" },
    { label: "Gym subscription", when: "Oct 30" },
];

export const WalletViewPage = () => {
    const { id } = useParams<{ id: string }>();
    const { wallet, isLoading, isNotFound } = useGetWallet(id);
    const [activeTab, setActiveTab] = useState<DetailTab>("overview");
    const [search, setSearch] = useState("");

    const filteredTransactions = useMemo(() => {
        const query = search.trim().toLowerCase();
        if (!query) {
            return MOCK_TRANSACTIONS;
        }

        return MOCK_TRANSACTIONS.filter((tx) => {
            return (
                tx.title.toLowerCase().includes(query)
                || tx.subtitle.toLowerCase().includes(query)
                || tx.category.toLowerCase().includes(query)
            );
        });
    }, [search]);

    if (isNotFound) {
        return (
            <CustomEmptyState
                title="Billetera no encontrada"
                description="La billetera que buscas no existe o ya no tienes acceso."
                Icon={Receipt}
            />
        );
    }

    return (
        <div className="flex gap-0 h-full min-h-0">
            <section className="flex-1 min-w-0 flex flex-col py-5">
                <div className="flex items-center justify-between gap-4 mb-6 px-7">
                    <div className="min-w-0">
                        {isLoading ? (
                            <div className="space-y-2 animate-pulse">
                                <div className="h-8 w-48 rounded bg-secondary" />
                                <div className="h-4 w-64 rounded bg-secondary/70" />
                            </div>
                        ) : (
                            <>
                                <h1 className="text-3xl font-semibold text-light tracking-tight truncate">
                                    {wallet?.name ?? "Wallet"}
                                </h1>
                                <p className="text-sm text-helper mt-1">
                                    {formatCurrency(wallet?.balance ?? 0, wallet?.currency)}{" "}
                                    current balance
                                    {" • "}
                                    1 participant
                                </p>
                            </>
                        )}
                    </div>

                    <Button
                        type="button"
                        text="New transaction"
                        icon={<Plus className="h-4 w-4" />}
                        onClick={() => undefined}
                        className="shrink-0"
                    />
                </div>

                <div className="flex items-center gap-1 border-b border-light-10 mb-5 px-7">
                    {TABS.map((tab) => (
                        <button
                            key={tab.id}
                            type="button"
                            onClick={() => setActiveTab(tab.id)}
                            className={`px-3 py-2.5 text-sm border-b-2 -mb-px cursor-pointer whitespace-nowrap transition-colors ${
                                activeTab === tab.id
                                    ? "border-primary text-light font-medium"
                                    : "border-transparent text-helper hover:text-light"
                            }`}
                        >
                            {tab.label}
                        </button>
                    ))}
                </div>

                {activeTab === "overview" ? (
                    <>
                        <div className="mb-4 px-7">
                            <SearchInput
                                id="txtSearchTransactions"
                                placeholder="Search transactions..."
                                className="w-full max-w-none min-w-0"
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                            />
                        </div>

                        <div className="flex justify-between items-center gap-4 p-5 text-sm text-helper border-y">
                            <span className="w-[19%]">Transaction details</span>
                            <span className="text-center">Category</span>
                            <span className="text-center">Date</span>
                            <span className="text-right min-w-20">Amount</span>
                        </div>

                        <div className="flex-1">{renderTransactions()}</div>
                    </>
                ) : (
                    <CustomEmptyState
                        title={`${TABS.find((tab) => tab.id === activeTab)?.label ?? "Section"} coming soon`}
                        description="Esta sección estará disponible en una próxima iteración."
                        Icon={ArrowLeftRight}
                    />
                )}
            </section>

            <WalletViewSidebar
                lastActivity="2 hours ago"
                highestExpense="Netflix"
                transactionsCount={MOCK_TRANSACTIONS.length}
                initialValue={wallet?.initialValue ?? 0}
                currency={wallet?.currency ?? "USD"}
                upcoming={MOCK_UPCOMING}
            />
        </div>
    );

    function renderTransactions() {
        if (isLoading) {
            return (
                <section className="flex flex-col">
                    {Array.from({ length: 6 }).map((_, index) => (
                        <WalletItemSkeleton key={index} className="px-7" />
                    ))}
                </section>
            );
        }

        if (filteredTransactions.length > 0) {
            return (
                <section className="flex flex-col">
                    {filteredTransactions.map((tx) => (
                        <WalletItem
                            key={tx.id}
                            title={tx.title}
                            subtitle={tx.subtitle}
                            meta={tx.category}
                            dateLabel={tx.dateLabel}
                            amount={tx.amount}
                            currency={wallet?.currency}
                            showChevron={false}
                            positiveAmountClassName="text-success"
                            className="px-7"
                        />
                    ))}
                </section>
            );
        }

        return (
            <CustomEmptyState
                title={search.trim() ? "Sin resultados" : "Sin transacciones"}
                description={
                    search.trim()
                        ? "Prueba con otro término de búsqueda"
                        : "Aún no hay movimientos en esta billetera."
                }
                Icon={Receipt}
                className="m-7"
            />
        );
    }
};
