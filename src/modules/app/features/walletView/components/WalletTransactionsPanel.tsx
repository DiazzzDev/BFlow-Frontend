import { Plus } from "lucide-react";

import type { Transaction } from "../interfaces/Transaction";

import {
    TransactionsTable,
    getTransactionColumnsClassName,
} from "./TransactionsTable";

import { Pagination } from "@/components/Pagination";
import { PaginationSelect } from "@/components/PaginationSelect";
import { SearchInput } from "@/components/controls/SearchInput";
import { Button } from "@/components/controls/Button";

interface WalletTransactionsPanelProps {
    query: string;
    transactions: Transaction[];
    isLoading: boolean;
    currency?: string;
    showCategory?: boolean;
    totalTransactions: number;
    numberOfElements: number;
    totalPages: number;
    actionsDisabled: boolean;
    onNewTransaction: () => void;
    onEdit: (transaction: Transaction) => void;
    onDelete: (transaction: Transaction) => void;
    onDuplicate: (transaction: Transaction) => void;
}

export const WalletTransactionsPanel = ({
    query,
    transactions,
    isLoading,
    currency,
    showCategory = true,
    totalTransactions,
    numberOfElements,
    totalPages,
    actionsDisabled,
    onNewTransaction,
    onEdit,
    onDelete,
    onDuplicate,
}: WalletTransactionsPanelProps) => {
    const columnsClassName = getTransactionColumnsClassName(showCategory);

    return (
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
                    onClick={onNewTransaction}
                    className="w-full shrink-0 @xl:w-auto"
                />
            </div>

            <div
                className={`hidden border-y border-light-10 px-7 py-4 text-sm text-light @2xl:grid ${columnsClassName}`}
            >
                <span>Transaction</span>
                {showCategory ? <span>Category</span> : null}
                <span>Date</span>
                <span className="text-right">Amount</span>
                <span className="sr-only">Actions</span>
            </div>

            <div className="flex-1 overflow-x-hidden overflow-y-auto">
                <TransactionsTable
                    transactions={transactions}
                    isLoading={isLoading}
                    query={query}
                    currency={currency}
                    showCategory={showCategory}
                    onEdit={onEdit}
                    onDelete={onDelete}
                    onDuplicate={onDuplicate}
                    actionsDisabled={actionsDisabled}
                />
            </div>

            {!isLoading && totalTransactions > 0 && (
                <div className="flex flex-col items-center gap-3 border-t border-light-10 px-4 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-7">
                    <PaginationSelect
                        totalItems={totalTransactions}
                        numberOfElements={numberOfElements}
                    />
                    <Pagination totalPages={totalPages} />
                </div>
            )}
        </>
    );
};
