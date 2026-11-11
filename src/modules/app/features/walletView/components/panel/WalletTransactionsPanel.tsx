import { Plus } from "lucide-react";
import { useTranslation } from "react-i18next";

import { useDuplicateTransaction } from "../../../wallets/hooks/useDuplicateTransaction";
import { TransactionsTable } from "../TransactionsTable";

import type { Transaction, TransactionType } from "@/modules/app/interfaces/Transaction";
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
    showRegisteredBy?: boolean;
    totalTransactions: number;
    numberOfElements: number;
    totalPages: number;
    onCreateTransaction: () => void;
    onEditTransaction: (transaction: Transaction) => void;
    onDeleteTransaction: (transaction: Transaction) => void;
}

export const WalletTransactionsPanel = ({
    query,
    transactions,
    isLoading,
    currency,
    showCategory = true,
    showRegisteredBy = true,
    totalTransactions,
    numberOfElements,
    totalPages,
    onCreateTransaction,
    onEditTransaction,
    onDeleteTransaction,
}: WalletTransactionsPanelProps) => {
    const { t } = useTranslation();
    // Duplicate action (shared with wallets history)
    const { duplicateTransaction, isPending: isDuplicating } = useDuplicateTransaction();
    const actionsDisabled = isDuplicating;

    return (
        <>
            <div className="mb-4 flex flex-col gap-3 px-4 sm:px-7 @xl:flex-row @xl:items-center justify-between">
                <SearchInput
                    id="txtSearchTransactions"
                    placeholder={t("transactions.search")}
                    className="w-full max-w-none min-w-0"
                    syncToParams
                />
                <Button
                    type="button"
                    text={t("dashboard.newTransaction")}
                    icon={<Plus className="h-4 w-4" />}
                    onClick={onCreateTransaction}
                    className="w-full shrink-0 @xl:w-auto"
                />
            </div>

            <div className="flex-1 overflow-x-hidden overflow-y-auto">
                <TransactionsTable
                    transactions={transactions}
                    isLoading={isLoading}
                    query={query}
                    currency={currency}
                    showCategory={showCategory}
                    showRegisteredBy={showRegisteredBy}
                    onEdit={onEditTransaction}
                    onDelete={onDeleteTransaction}
                    onDuplicate={(transaction) => {
                        void duplicateTransaction(transaction);
                    }}
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
