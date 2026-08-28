import { useState } from "react";
import { useSearchParams } from "react-router";

import { NewTransactionModal } from "../../components/newTransaction/NewTransactionModal";
import type { Transaction, TransactionType } from "../walletView/interfaces/Transaction";
import { useDuplicateTransaction } from "../wallets/hooks/useDuplicateTransaction";
import { HistoryFilters } from "./components/HistoryFilters";
import { HistoryTimeline } from "./components/HistoryTimeline";
import { useGetHistory } from "./hooks/useGetHistory";

import { Pagination } from "@/components/Pagination";
import { PaginationSelect } from "@/components/PaginationSelect";
import { useDebounce } from "@/hooks/useDebounce";
import { usePaginationParams } from "@/hooks/usePaginationParams";

const isTransactionType = (value: string | null): value is TransactionType =>
    value === "INCOME" || value === "EXPENSE" || value === "TRANSFER";

export const HistoryPage = () => {
    const [params] = useSearchParams();
    const query = params.get("query") || "";
    const debouncedQuery = useDebounce(query, 500);
    const typeParam = params.get("type");
    const selectedType = typeParam && typeParam !== "ALL" ? typeParam : "ALL";
    const transactionType = isTransactionType(typeParam) ? typeParam : null;
    const { apiPage, limit } = usePaginationParams();

    const { data: historyResponse, isLoading } = useGetHistory({
        query: debouncedQuery,
        type: transactionType,
        page: apiPage,
        size: limit,
    });
    const { duplicateTransaction, isPending: isDuplicating } = useDuplicateTransaction();
    const [viewTransaction, setViewTransaction] = useState<Transaction | null>(null);

    const transactions = historyResponse?.data.content ?? [];
    const totalTransactions = historyResponse?.data.totalElements ?? 0;
    const totalPages = historyResponse?.data.totalPages ?? 0;
    const numberOfElements = historyResponse?.data.numberOfElements ?? transactions.length;

    const handleViewDetails = (transaction: Transaction) => {
        setViewTransaction(transaction);
    };

    const handleDuplicate = (transaction: Transaction) => {
        void duplicateTransaction(transaction);
    };

    return (
        <div className="flex h-full min-h-0 flex-col px-4 py-5 sm:px-6">
            <div className="mb-6">
                <h1 className="text-2xl font-semibold tracking-tight text-light">
                    Historial
                </h1>
                <p className="mt-1 text-sm text-helper">
                    Revisa tus movimientos agrupados por día.
                </p>
            </div>

            <HistoryFilters selectedType={selectedType} />

            <div className="mt-6 min-h-0 flex-1 overflow-y-auto">
                <HistoryTimeline
                    transactions={transactions}
                    isLoading={isLoading}
                    onViewDetails={handleViewDetails}
                    onDuplicate={handleDuplicate}
                    actionsDisabled={isDuplicating}
                />
            </div>

            {!isLoading && totalTransactions > 0 ? (
                <div className="mt-4 flex flex-col items-center gap-3 border-t border-light-10 pt-4 sm:flex-row sm:items-center sm:justify-between">
                    <PaginationSelect
                        totalItems={totalTransactions}
                        numberOfElements={numberOfElements}
                    />
                    <Pagination totalPages={totalPages} />
                </div>
            ) : null}

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
};
