import { useParams } from "react-router";
import { ArrowLeftRight, Plus, Receipt } from "lucide-react";

import { useGetOverview } from "./hooks/useGetOverview";
import { useGetTransactions } from "./hooks/useGetTransactions";
import { useGetWallet } from "./hooks/useGetWallet";
import { WalletViewSidebar } from "./components/WalletViewSidebar";
import { TransactionsTable } from "./components/TransactionsTable";
import type { TransactionType } from "./interfaces/Transaction";
import { useGetWalletDetails } from "./hooks/useGetWalletDetails";

import { CustomEmptyState } from "@/components/custom/CustomEmptyState";
import { SearchInput } from "@/components/controls/SearchInput";
import { Button } from "@/components/controls/Button";
import { SkeletonText } from "@/components/loaders/SkeletonText";
import { formatCurrency } from "@/utils/formatters/formatCurrency";
import { useDebounce } from "@/hooks/useDebounce";
import { useUpdateSearchParams } from "@/hooks/useUpdateSearchParams";

type DetailTab = "overview" | "incomes" | "expenses" | "transfers" | "settings";

const tabs: Array<{ id: DetailTab; label: string }> = [
    { id: "overview", label: "All transactions" },
    { id: "incomes", label: "Incomes" },
    { id: "expenses", label: "Expenses" },
    { id: "transfers", label: "Transfers" },
    { id: "settings", label: "Settings" },
];

const tabToType: Record<Exclude<DetailTab, "overview" | "settings">, TransactionType> = {
    incomes: "INCOME",
    expenses: "EXPENSE",
    transfers: "TRANSFER",
};

const isDetailTab = (value: string | null): value is DetailTab =>
    !!value && tabs.some((tab) => tab.id === value);

export const WalletViewPage = () => {
    const { id = "" } = useParams<{ id: string }>();
    const { params, updateSearchParams } = useUpdateSearchParams();

    const query = params.get("query") || "";
    const debouncedQuery = useDebounce(query, 500);
    const tabParam = params.get("tab");
    const activeTab: DetailTab = isDetailTab(tabParam) ? tabParam : "overview";

    const transactionType = activeTab === "overview" || activeTab === "settings" ? null : tabToType[activeTab];

    const { data: walletDetailsResponse, isLoading: isWalletDetailsLoading } = useGetWalletDetails(id);

    const { data: walletResponse, isLoading: isWalletLoading } = useGetWallet(id);
    const overviewQuery = useGetOverview(id, debouncedQuery, activeTab === "overview");
    const transactionsQuery = useGetTransactions(id, transactionType, debouncedQuery);

    const activeList = activeTab === "overview" ? overviewQuery : activeTab === "settings" ? null : transactionsQuery;

    const wallet = walletResponse?.data;
    const walletDetails = walletDetailsResponse?.data;

    const transactions = activeList?.data?.data.content ?? [];
    const isLoadingList = activeList?.isLoading ?? false;
    const isNotFound = !isWalletLoading && !!id && !wallet;


    const setTab = (tab: DetailTab) => {
        updateSearchParams({
            tab: tab === "overview" ? null : tab,
        });
    };

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
            <section className="flex-1 min-w-0 flex flex-col pt-5">
                <div className="flex items-center justify-between gap-4 mb-6 px-7">
                    <div className="min-w-0">
                        {isWalletLoading ? (
                            <div className="space-y-2">
                                <SkeletonText className="h-8 w-48" />
                                <SkeletonText className="h-4 w-56" />
                            </div>
                        ) : (
                            <>
                                <h1 className="text-3xl font-semibold text-light tracking-tight truncate">
                                    {wallet?.name ?? "Wallet"}
                                </h1>
                                <p className="text-sm text-helper mt-1">
                                    {formatCurrency(wallet?.balance ?? 0, wallet?.currency)}{" "}
                                    current balance
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
                    {tabs.map((tab) => (
                        <button
                            key={tab.id}
                            type="button"
                            onClick={() => setTab(tab.id)}
                            className={`px-3 py-2.5 text-sm border-b-2 -mb-px cursor-pointer whitespace-nowrap transition-colors ${activeTab === tab.id
                                ? "border-primary text-light font-medium"
                                : "border-transparent text-helper hover:text-light"
                                }`}
                        >
                            {tab.label}
                        </button>
                    ))}
                </div>

                {activeTab === "settings" ? (
                    <CustomEmptyState
                        title="Settings coming soon"
                        description="Esta sección estará disponible en una próxima iteración."
                        Icon={ArrowLeftRight}
                    />
                ) : (
                    <>
                        <div className="mb-4 px-7">
                            <SearchInput
                                id="txtSearchTransactions"
                                placeholder="Search transactions..."
                                className="w-full max-w-none min-w-0"
                                syncToParams
                            />
                        </div>

                        <div className="grid grid-cols-[1.4fr_1fr_1fr_0.8fr] gap-4 px-7 py-4 text-sm text-light border-y border-light-10">
                            <span>Transaction</span>
                            <span>Category</span>
                            <span>Date</span>
                            <span className="text-right">Amount</span>
                        </div>

                        <div className="flex-1 overflow-y-auto overflow-x-hidden">
                            <TransactionsTable
                                transactions={transactions}
                                isLoading={isLoadingList}
                                query={query}
                                currency={wallet?.currency}
                            />
                        </div>
                    </>
                )}
            </section>
            <WalletViewSidebar
                lastActivity={walletDetails?.lastActivity ?? "—"}
                highestExpense={walletDetails?.highestExpense ?? "—"}
                transactionsCount={walletDetails?.transactions ?? 0}
                initialValue={walletDetails?.initialValue ?? 0}
                currency={wallet?.currency ?? "USD"}
                upcoming={walletDetails?.upcoming ?? []}
                isLoading={isWalletDetailsLoading}
            />
        </div>
    );
};
