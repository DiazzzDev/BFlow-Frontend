import { useEffect, useState } from "react";
import { useParams } from "react-router";
import { AnimatePresence, motion } from "framer-motion";
import { toast } from "sonner";
import { ArrowLeftRight, PanelRightClose, PanelRightOpen, Plus, Receipt, X } from "lucide-react";

import { useDeleteExpense } from "../../components/newTransaction/hooks/useMutateExpenses";
import { useDeleteIncome } from "../../components/newTransaction/hooks/useMutateIncomes";
import { useDuplicateTransaction } from "../wallets/hooks/useDuplicateTransaction";
import { NewTransactionModal } from "../../components/newTransaction/NewTransactionModal";

import { useGetOverview } from "./hooks/useGetOverview";
import { useGetTransactions } from "./hooks/useGetTransactions";
import { useGetWallet } from "./hooks/useGetWallet";
import { WalletViewSidebar } from "./components/WalletViewSidebar";
import { ScheduleTransactionModal } from "./components/ScheduleTransactionModal";
import {
    TransactionsTable,
    transactionColumnsClassName,
} from "./components/TransactionsTable";
import type { Transaction, TransactionType } from "./interfaces/Transaction";
import { useGetWalletDetails } from "./hooks/useGetWalletDetails";

import { CustomEmptyState } from "@/components/custom/CustomEmptyState";
import { CustomModal } from "@/components/custom/CustomModal";
import { Pagination } from "@/components/Pagination";
import { PaginationSelect } from "@/components/PaginationSelect";
import { SearchInput } from "@/components/controls/SearchInput";
import { Button } from "@/components/controls/Button";
import { SkeletonText } from "@/components/loaders/SkeletonText";
import { formatCurrency } from "@/utils/formatters/formatCurrency";
import { useDebounce } from "@/hooks/useDebounce";
import { usePaginationParams } from "@/hooks/usePaginationParams";
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
    const { duplicateTransaction, isPending: isDuplicating } = useDuplicateTransaction();
    const deleteExpense = useDeleteExpense();
    const deleteIncome = useDeleteIncome();
    const [isNewTransactionOpen, setIsNewTransactionOpen] = useState(false);
    const [isScheduleOpen, setIsScheduleOpen] = useState(false);
    const [editTransaction, setEditTransaction] = useState<Transaction | null>(null);
    const [deleteTransaction, setDeleteTransaction] = useState<Transaction | null>(null);
    const [isInfoDrawerOpen, setIsInfoDrawerOpen] = useState(false);
    const [isInfoPanelOpen, setIsInfoPanelOpen] = useState(true);

    const query = params.get("query") || "";
    const debouncedQuery = useDebounce(query, 500);
    const tabParam = params.get("tab");
    const activeTab: DetailTab = isDetailTab(tabParam) ? tabParam : "overview";
    const { apiPage, limit } = usePaginationParams();

    const transactionType = activeTab === "overview" || activeTab === "settings" ? null : tabToType[activeTab];

    const { data: walletDetailsResponse, isLoading: isWalletDetailsLoading } = useGetWalletDetails(id);
    const { data: walletResponse, isLoading: isWalletLoading } = useGetWallet(id);
    const overviewQuery = useGetOverview(
        id,
        debouncedQuery,
        activeTab === "overview",
        apiPage,
        limit,
    );
    const transactionsQuery = useGetTransactions(
        id,
        transactionType,
        debouncedQuery,
        apiPage,
        limit,
    );

    const activeList = activeTab === "overview" ? overviewQuery : activeTab === "settings" ? null : transactionsQuery;

    const wallet = walletResponse?.data;
    const walletDetails = walletDetailsResponse?.data;

    const transactions = activeList?.data?.data.content ?? [];
    const totalTransactions = activeList?.data?.data.totalElements ?? 0;
    const totalPages = activeList?.data?.data.totalPages ?? 0;
    const numberOfElements =
        activeList?.data?.data.numberOfElements ?? transactions.length;
    const isLoadingList = activeList?.isLoading ?? false;
    const isNotFound = !isWalletLoading && !!id && !wallet;

    const setTab = (tab: DetailTab) => {
        updateSearchParams(
            {
                tab: tab === "overview" ? null : tab,
            },
            { resetPage: true },
        );
    };

    useEffect(() => {
        if (!isInfoDrawerOpen) { return };

        const previousOverflow = document.body.style.overflow;
        document.body.style.overflow = "hidden";

        return () => {
            document.body.style.overflow = previousOverflow;
        };
    }, [isInfoDrawerOpen]);

    if (isNotFound) {
        return (
            <CustomEmptyState
                title="Billetera no encontrada"
                description="La billetera que buscas no existe o ya no tienes acceso."
                Icon={Receipt}
            />
        );
    }

    const sidebarProps = {
        lastActivity: walletDetails?.lastActivity ?? "—",
        highestExpense: walletDetails?.highestExpense ?? "—",
        transactionsCount: walletDetails?.transactions ?? 0,
        initialValue: walletDetails?.initialValue ?? 0,
        currency: wallet?.currency ?? "USD",
        upcoming: walletDetails?.upcoming ?? [],
        isLoading: isWalletDetailsLoading,
        onSchedule: () => {
            setIsInfoDrawerOpen(false);
            setIsScheduleOpen(true);
        },
    };

    const isDeleting = deleteExpense.isPending || deleteIncome.isPending;

    const handleConfirmDelete = async () => {
        if (!deleteTransaction) {
            return;
        }

        const promise =
            deleteTransaction.type === "EXPENSE"
                ? deleteExpense.mutateAsync({
                    id: deleteTransaction.id,
                    walletId: deleteTransaction.walletId,
                })
                : deleteIncome.mutateAsync({
                    id: deleteTransaction.id,
                    walletId: deleteTransaction.walletId,
                });

        toast.promise(promise, {
            loading: "Eliminando transacción...",
            success: "Transacción eliminada",
            error: (err) =>
                err instanceof Error ? err.message : "Error al eliminar la transacción",
        });

        await promise;
        setDeleteTransaction(null);
    };

    return (
        <div className="flex h-full min-h-0 flex-col @3xl:flex-row">
            <section className="flex min-h-0 min-w-0 flex-1 flex-col pt-5">
                <div className="mb-6 flex flex-col gap-3 px-4 sm:px-7 @md:flex-row @md:items-center @md:justify-between">
                    <div className="min-w-0">
                        {isWalletLoading ? (
                            <div className="space-y-2">
                                <SkeletonText className="h-8 w-48" />
                                <SkeletonText className="h-4 w-56" />
                            </div>
                        ) : (
                            <>
                                <h1 className="truncate text-2xl font-semibold tracking-tight text-light sm:text-3xl">
                                    {wallet?.name ?? "Wallet"}
                                </h1>
                                <p className="mt-1 text-sm text-helper">
                                    {formatCurrency(wallet?.balance ?? 0, wallet?.currency)}{" "}
                                    current balance
                                </p>
                            </>
                        )}
                    </div>

                    <button
                        type="button"
                        onClick={() => setIsInfoDrawerOpen(true)}
                        className="inline-flex items-center justify-center gap-2 rounded-lg border border-light-10 bg-surface px-4 py-2 text-sm font-medium text-light transition-colors hover:bg-light-5 cursor-pointer @3xl:hidden"
                    >
                        <PanelRightOpen className="h-4 w-4" />
                        Ver info
                    </button>

                    <button
                        type="button"
                        onClick={() => setIsInfoPanelOpen((open) => !open)}
                        className="hidden items-center justify-center gap-2 rounded-lg border border-light-10 bg-surface px-4 py-2 text-sm font-medium text-light transition-colors hover:bg-light-5 cursor-pointer @3xl:inline-flex"
                    >
                        <motion.span
                            key={isInfoPanelOpen ? "close" : "open"}
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ duration: 0.15 }}
                            className="flex items-center gap-2"
                        >
                            {isInfoPanelOpen ? (
                                <>
                                    <PanelRightClose className="h-4 w-4" />
                                    Ocultar info
                                </>
                            ) : (
                                <>
                                    <PanelRightOpen className="h-4 w-4" />
                                    Ver info
                                </>
                            )}
                        </motion.span>
                    </button>
                </div>

                <div className="relative mb-5">
                    <div className="overflow-x-auto border-b border-light-10 px-4 sm:px-7 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
                        <div className="flex min-w-max items-center gap-1">
                            {tabs.map((tab) => (
                                <button
                                    key={tab.id}
                                    type="button"
                                    onClick={() => setTab(tab.id)}
                                    className={`-mb-px cursor-pointer whitespace-nowrap border-b-2 px-3 py-2.5 text-sm transition-colors ${activeTab === tab.id
                                        ? "border-primary font-medium text-light"
                                        : "border-transparent text-helper hover:text-light"
                                        }`}
                                >
                                    {tab.label}
                                </button>
                            ))}
                        </div>
                    </div>
                    <div className="pointer-events-none absolute inset-y-0 left-0 w-8 bg-linear-to-r from-surface-hard to-transparent @2xl:hidden" />
                    <div className="pointer-events-none absolute inset-y-0 right-0 w-8 bg-linear-to-l from-surface-hard to-transparent @2xl:hidden" />
                </div>

                {activeTab === "settings" ? (
                    <CustomEmptyState
                        title="Settings coming soon"
                        description="Esta sección estará disponible en una próxima iteración."
                        Icon={ArrowLeftRight}
                    />
                ) : (
                    <>
                        <div className="mb-4 flex flex-col gap-3 px-4 sm:px-7 @xl:flex-row @xl:items-center justify-between">
                            <SearchInput
                                id="txtSearchTransactions"
                                placeholder="Search transactions..."
                                className="w-full max-w-none min-w-0"
                                syncToParams
                            />
                            <Button
                                type="button"
                                text="New transaction"
                                icon={<Plus className="h-4 w-4" />}
                                onClick={() => setIsNewTransactionOpen(true)}
                                className="w-full shrink-0 @xl:w-auto"
                            />
                        </div>

                        <div
                            className={`hidden border-y border-light-10 px-7 py-4 text-sm text-light @2xl:grid ${transactionColumnsClassName}`}
                        >
                            <span>Transaction</span>
                            <span>Category</span>
                            <span>Date</span>
                            <span className="text-right">Amount</span>
                            <span className="sr-only">Actions</span>
                        </div>

                        <div className="flex-1 overflow-x-hidden overflow-y-auto">
                            <TransactionsTable
                                transactions={transactions}
                                isLoading={isLoadingList}
                                query={query}
                                currency={wallet?.currency}
                                onEdit={setEditTransaction}
                                onDelete={setDeleteTransaction}
                                onDuplicate={(transaction) => {
                                    void duplicateTransaction(transaction);
                                }}
                                actionsDisabled={isDuplicating || isDeleting}
                            />
                        </div>

                        {!isLoadingList && totalTransactions > 0 && (
                            <div className="flex flex-col items-center gap-3 border-t border-light-10 px-4 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-7">
                                <PaginationSelect
                                    totalItems={totalTransactions}
                                    numberOfElements={numberOfElements}
                                />
                                <Pagination totalPages={totalPages} />
                            </div>
                        )}
                    </>
                )}
            </section>

            <AnimatePresence initial={false}>
                {isInfoPanelOpen && (
                    <motion.div
                        key="wallet-info-panel"
                        initial={{ width: 0, opacity: 0, x: 16 }}
                        animate={{ width: 320, opacity: 1, x: 0 }}
                        exit={{ width: 0, opacity: 0, x: 16 }}
                        transition={{ type: "spring", stiffness: 320, damping: 32 }}
                        className="hidden min-h-0 shrink-0 overflow-hidden border-l border-light-10 @3xl:block"
                    >
                        <WalletViewSidebar
                            {...sidebarProps}
                            className="h-full w-80"
                        />
                    </motion.div>
                )}
            </AnimatePresence>

            <button
                type="button"
                aria-label="Cerrar información"
                onClick={() => setIsInfoDrawerOpen(false)}
                className={`fixed inset-0 z-40 bg-surface-hard/70 transition-opacity @3xl:hidden ${isInfoDrawerOpen ? "opacity-100" : "pointer-events-none opacity-0"
                    }`}
            />
            <div
                className={`fixed inset-y-0 right-0 z-50 flex w-full max-w-sm flex-col border-l border-light-10 bg-surface transition-transform duration-300 ease-out @3xl:hidden ${isInfoDrawerOpen ? "translate-x-0" : "translate-x-full"
                    }`}
            >
                <div className="flex justify-end border-b border-light-10 px-4 py-3">
                    <button
                        type="button"
                        onClick={() => setIsInfoDrawerOpen(false)}
                        aria-label="Cerrar información"
                        className="cursor-pointer rounded-lg p-1.5 text-helper transition-colors hover:bg-light-5 hover:text-light"
                    >
                        <X className="h-5 w-5" />
                    </button>
                </div>
                <div className="min-h-0 flex-1 overflow-y-auto">
                    <WalletViewSidebar {...sidebarProps} className="min-h-full" />
                </div>
            </div>

            <NewTransactionModal
                isModalOpen={isNewTransactionOpen}
                setIsModalOpen={setIsNewTransactionOpen}
                walletId={id}
                initialType={transactionType}
            />

            <ScheduleTransactionModal
                isModalOpen={isScheduleOpen}
                setIsModalOpen={setIsScheduleOpen}
                walletId={id}
            />

            <NewTransactionModal
                isModalOpen={Boolean(editTransaction)}
                setIsModalOpen={(open) => {
                    if (!open) {
                        setEditTransaction(null);
                    }
                }}
                mode="edit"
                transaction={editTransaction}
            />

            <CustomModal
                isModalOpen={Boolean(deleteTransaction)}
                setIsModalOpen={(open) => {
                    if (!open) {
                        setDeleteTransaction(null);
                    }
                }}
                title="Eliminar transacción"
                maxWidth="max-w-md"
            >
                <div className="flex flex-col gap-6">
                    <p className="text-sm text-helper">
                        ¿Seguro que quieres eliminar{" "}
                        <span className="font-medium text-light">
                            {deleteTransaction?.title || "esta transacción"}
                        </span>
                        ? Esta acción no se puede deshacer.
                    </p>
                    <div className="flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
                        <button
                            type="button"
                            disabled={isDeleting}
                            onClick={() => setDeleteTransaction(null)}
                            className="cursor-pointer rounded-lg border border-light-10 px-4 py-2 text-sm font-medium text-light transition-colors hover:bg-light-5 disabled:cursor-not-allowed disabled:opacity-50"
                        >
                            Cancelar
                        </button>
                        <button
                            type="button"
                            disabled={isDeleting}
                            onClick={() => {
                                void handleConfirmDelete();
                            }}
                            className="cursor-pointer rounded-lg bg-danger px-4 py-2 text-sm font-medium text-light transition-colors hover:bg-danger-dark disabled:cursor-not-allowed disabled:opacity-50"
                        >
                            {isDeleting ? "Eliminando..." : "Eliminar"}
                        </button>
                    </div>
                </div>
            </CustomModal>
        </div>
    );
};
