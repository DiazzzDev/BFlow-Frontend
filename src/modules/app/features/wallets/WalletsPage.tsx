import { useEffect, useState } from "react";
import { useSearchParams } from "react-router";
import { ChevronRight, Receipt, Users, Wallet, X } from "lucide-react";

import { NewTransactionModal } from "../transactions/components/NewTransactionModal";
import type { Transaction } from "../walletView/interfaces/Transaction";

import { WalletItem } from "./components/WalletItem";
import { WalletItemSkeleton } from "./components/WalletItemSkeleton";
import { HistoryItem } from "./components/HistoryItem";
import { HistoryItemSkeleton } from "./components/HistoryItemSkeleton";
import { WalletForm } from "./components/WalletForm";
import { useGetWallets } from "./hooks/useGetWallets";
import { useGetHistory } from "./hooks/useGetHistory";
import { useDuplicateTransaction } from "./hooks/useDuplicateTransaction";

import { useAuthStore } from "@/auth/authStore";
import { CustomModal } from "@/components/custom/CustomModal";
import { CustomEmptyState } from "@/components/custom/CustomEmptyState";
import { Pagination } from "@/components/Pagination";
import { PaginationSelect } from "@/components/PaginationSelect";
import { SearchInput } from "@/components/controls/SearchInput";
import { Button } from "@/components/controls/Button";
import { formatCurrency } from "@/utils/formatters/formatCurrency";
import { formatMonthYear } from "@/utils/formatters/formatMonthYear";
import { TabFilter } from "@/components/controls/TabFilter";
import { useDebounce } from "@/hooks/useDebounce";
import { usePaginationParams } from "@/hooks/usePaginationParams";


const getEmptyTitle = (search: string, walletType: "MINE" | "SHARED") => {
    if (search.trim()) {
        return "Sin resultados";
    }
    if (walletType === "MINE") {
        return "No tienes billeteras aún";
    }
    return "No tienes billeteras compartidas";
};

const getEmptyDescription = (
    search: string,
    walletType: "MINE" | "SHARED",
) => {
    if (search.trim()) {
        return "Prueba con otro término de búsqueda";
    }
    if (walletType === "MINE") {
        return "Crea tu primera billetera para empezar a gestionar tus finanzas";
    }
    return "Cuando alguien te invite a una billetera, aparecerá aquí";
};

export const WalletsPage = () => {
    const [params] = useSearchParams();
    const query = params.get("query") || "";
    const debouncedQuery = useDebounce(query, 500);
    const walletType = (params.get("walletType") as "MINE" | "SHARED") ?? "MINE";
    const { apiPage, limit } = usePaginationParams();

    const { isLoading: isLoadingWallets, data: walletData } = useGetWallets(
        walletType,
        debouncedQuery,
        apiPage,
        limit,
    );
    const { isLoading: isLoadingHistory, data: historyData } = useGetHistory();
    const { duplicateTransaction, isPending: isDuplicating } = useDuplicateTransaction();
    const user = useAuthStore((state) => state.user);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isHistoryOpen, setIsHistoryOpen] = useState(false);
    const [viewTransaction, setViewTransaction] = useState<Transaction | null>(null);

    const wallets = walletData?.data.content || [];
    const totalWallets = walletData?.data.totalElements ?? 0;
    const totalPages = walletData?.data.totalPages ?? 0;
    const numberOfElements = walletData?.data.numberOfElements ?? wallets.length;
    const history = historyData?.data.content || [];
    const ownerLabel = user?.email || "—";
    const showCreateButton = walletType === "MINE" && !query.trim();

    const handleViewDetails = (transaction: Transaction) => {
        setViewTransaction(transaction);
    };

    const handleDuplicate = (transaction: Transaction) => {
        void duplicateTransaction(transaction);
    };

    useEffect(() => {
        if (!isHistoryOpen) { return };

        const previousOverflow = document.body.style.overflow;
        document.body.style.overflow = "hidden";

        return () => {
            document.body.style.overflow = previousOverflow;
        };
    }, [isHistoryOpen]);

    return (
        <div className="flex h-full min-h-0 flex-col @3xl:flex-row">
            <section className="flex min-h-0 flex-1 flex-col px-4 py-5 sm:px-6">
                <div className="mb-5 flex flex-col @6xl:flex-row justify-between gap-3">
                    <SearchInput
                        id="txtSearch"
                        placeholder="Buscar billetera..."
                        syncToParams
                    />

                    <div className="flex flex-col gap-3 @md:flex-row @md:flex-wrap @md:items-center">
                        <TabFilter
                            options={[
                                { label: "Mis wallets", value: "MINE" },
                                { label: "Compartidas", value: "SHARED" },
                            ]}
                            selected={walletType}
                            keyFilter="walletType"
                            responsive="stretch"
                        />

                        <div className="grid w-full grid-cols-1 gap-2 @[22rem]:grid-cols-2 @3xl:flex @3xl:w-auto">
                            <button
                                type="button"
                                onClick={() => setIsHistoryOpen(true)}
                                className="w-full rounded-lg border border-light-10 px-4 py-2 text-sm font-medium text-light transition-colors hover:bg-light-5 cursor-pointer @3xl:hidden"
                            >
                                Ver historial
                            </button>

                            {walletType === "MINE" && (
                                <Button
                                    type="button"
                                    onClick={() => setIsModalOpen(true)}
                                    text="Crear billetera"
                                    className="w-full @3xl:w-auto"
                                />
                            )}
                        </div>
                    </div>
                </div>

                <div className="flex min-h-0 flex-1 flex-col overflow-y-auto">
                    {renderWalletList()}
                </div>

                {!isLoadingWallets && totalWallets > 0 && (
                    <div className="mt-4 flex flex-col items-center gap-3 border-t border-light-10 pt-4 sm:flex-row sm:items-center sm:justify-between">
                        <PaginationSelect
                            totalItems={totalWallets}
                            numberOfElements={numberOfElements}
                        />
                        <Pagination totalPages={totalPages} />
                    </div>
                )}
            </section>

            {/* History fijo cuando el contenedor del Outlet es ancho */}
            <aside className="hidden min-h-0 w-80 shrink-0 flex-col border-l border-light-10 @3xl:flex @5xl:w-96">
                {renderHistoryPanel()}
            </aside>

            {/* Drawer cuando el contenedor es angosto */}
            <button
                type="button"
                aria-label="Cerrar historial"
                onClick={() => setIsHistoryOpen(false)}
                className={`fixed inset-0 z-40 bg-surface-hard/70 transition-opacity @3xl:hidden ${
                    isHistoryOpen ? "opacity-100" : "pointer-events-none opacity-0"
                }`}
            />
            <aside
                className={`fixed inset-y-0 right-0 z-50 flex w-full max-w-sm flex-col border-l border-light-10 bg-surface transition-transform duration-300 ease-out @3xl:hidden ${
                    isHistoryOpen ? "translate-x-0" : "translate-x-full"
                }`}
            >
                <div className="flex items-center justify-between border-b border-light-10 px-4 py-4">
                    <h2 className="text-lg font-semibold text-light">History</h2>
                    <button
                        type="button"
                        onClick={() => setIsHistoryOpen(false)}
                        aria-label="Cerrar historial"
                        className="rounded-lg p-1.5 text-helper transition-colors hover:bg-light-5 hover:text-light cursor-pointer"
                    >
                        <X className="h-5 w-5" />
                    </button>
                </div>
                <div className="min-h-0 flex-1 overflow-y-auto px-4 py-4">
                    {renderHistory()}
                </div>
            </aside>

            <CustomModal
                isModalOpen={isModalOpen}
                setIsModalOpen={setIsModalOpen}
                title="Nueva billetera"
                maxWidth="max-w-md"
            >
                <WalletForm
                    key={isModalOpen ? "open" : "closed"}
                    onSuccess={() => setIsModalOpen(false)}
                />
            </CustomModal>

            <NewTransactionModal
                isModalOpen={Boolean(viewTransaction)}
                setIsModalOpen={(open) => {
                    if (!open) {
                        setViewTransaction(null);
                    }
                }}
                mode="view"
                transaction={viewTransaction}
            />
        </div>
    );

    function renderHistoryPanel() {
        return (
            <>
                <div className="mb-6 flex items-center justify-between px-5 pt-6">
                    <h2 className="text-2xl font-semibold tracking-tight text-light">
                        History
                    </h2>
                    <button
                        type="button"
                        className="cursor-pointer text-sm text-primary transition-colors hover:text-primary-dark"
                    >
                        View all
                    </button>
                </div>
                <div className="min-h-0 flex-1 overflow-y-auto px-5 pb-5">
                    {renderHistory()}
                </div>
            </>
        );
    }

    function renderHistory() {
        if (isLoadingHistory) {
            return (
                <ul className="flex flex-col">
                    {Array.from({ length: 6 }).map((_, index) => (
                        <HistoryItemSkeleton key={index} />
                    ))}
                </ul>
            );
        }

        if (history.length > 0) {
            return (
                <ul className="flex flex-col">
                    {history.map((transaction) => (
                        <HistoryItem
                            key={transaction.id}
                            transaction={transaction}
                            onViewDetails={handleViewDetails}
                            onDuplicate={handleDuplicate}
                            actionsDisabled={isDuplicating}
                        />
                    ))}
                </ul>
            );
        }

        return (
            <CustomEmptyState
                title="Sin historial"
                description="Cuando registres movimientos, aparecerán aquí."
                Icon={Receipt}
                className="m-0!"
            />
        );
    }

    function renderWalletList() {
        if (isLoadingWallets) {
            return (
                <section className="flex flex-col gap-3 overflow-x-hidden">
                    {Array.from({ length: 6 }).map((_, index) => (
                        <WalletItemSkeleton key={index} />
                    ))}
                </section>
            );
        }

        if (wallets.length > 0) {
            return (
                <section className="flex flex-col gap-3">
                    {wallets.map((wallet) => (
                        <WalletItem key={wallet.id} to={`/app/wallets/${wallet.id}`}>
                            <div className="flex items-start justify-between gap-3 sm:items-center sm:gap-4">
                                <div className="min-w-0 flex-1 sm:flex-[1.6]">
                                    <p className="truncate text-sm font-semibold text-light">
                                        {wallet.name}
                                    </p>
                                    <p className="mt-0.5 truncate text-xs text-helper">
                                        {wallet.description || ownerLabel}
                                    </p>
                                    <p className="mt-2 truncate text-xs text-label sm:hidden">
                                        {wallet.currency}
                                        {" · "}
                                        {formatMonthYear(wallet.createdAt)}
                                    </p>
                                </div>

                                <p className="hidden flex-1 truncate text-center text-sm text-helper sm:block">
                                    {wallet.currency}
                                </p>

                                <p className="hidden flex-1 truncate text-center text-sm text-helper sm:block">
                                    {formatMonthYear(wallet.createdAt)}
                                </p>

                                <div className="flex shrink-0 items-center gap-2 sm:gap-3">
                                    <p className="text-right text-sm font-semibold tabular-nums text-info">
                                        {formatCurrency(wallet.balance, wallet.currency)}
                                    </p>
                                    <ChevronRight className="h-5 w-5 text-helper sm:h-7 sm:w-7 sm:text-light" />
                                </div>
                            </div>
                        </WalletItem>
                    ))}
                </section>
            );
        }

        return (
            <CustomEmptyState
                title={getEmptyTitle(query, walletType)}
                description={getEmptyDescription(query, walletType)}
                Icon={walletType === "MINE" ? Wallet : Users}
                buttonText={showCreateButton ? "Crear billetera" : undefined}
                onButtonClick={showCreateButton ? () => setIsModalOpen(true) : undefined}
            />
        );
    }
};
