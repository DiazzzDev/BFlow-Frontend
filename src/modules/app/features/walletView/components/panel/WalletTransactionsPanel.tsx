import { useState } from "react";
import { Plus } from "lucide-react";
import { useTranslation } from "react-i18next";

import { NewTransactionModal } from "../../../newTransaction/NewTransactionModal";
import { useDuplicateTransaction } from "../../../wallets/hooks/useDuplicateTransaction";
import { TransactionsTable } from "../TransactionsTable";
import { DeleteTransactionModal } from "../modal/DeleteTransactionModal";
import { getTransactionColumnsClassName } from "../../utils/transactionDisplay";

import type { Transaction, TransactionType } from "@/modules/app/interfaces/Transaction";
import { Pagination } from "@/components/Pagination";
import { PaginationSelect } from "@/components/PaginationSelect";
import { SearchInput } from "@/components/controls/SearchInput";
import { Button } from "@/components/controls/Button";

interface WalletTransactionsPanelProps {
    walletId: string;
    query: string;
    transactions: Transaction[];
    isLoading: boolean;
    currency?: string;
    showCategory?: boolean;
    initialType?: TransactionType | null;
    totalTransactions: number;
    numberOfElements: number;
    totalPages: number;
}

export const WalletTransactionsPanel = ({
    walletId,
    query,
    transactions,
    isLoading,
    currency,
    showCategory = true,
    initialType = null,
    totalTransactions,
    numberOfElements,
    totalPages,
}: WalletTransactionsPanelProps) => {
    const { t } = useTranslation();
    // Duplicate action (shared with wallets history)
    const { duplicateTransaction, isPending: isDuplicating } = useDuplicateTransaction();
    const actionsDisabled = isDuplicating;

    // Create / edit / delete transaction modals
    const [isNewTransactionOpen, setIsNewTransactionOpen] = useState(false);
    const [editTransaction, setEditTransaction] = useState<Transaction | null>(null);
    const [deleteTransaction, setDeleteTransaction] = useState<Transaction | null>(null);

    // Table header grid columns (category column is optional)
    const columnsClassName = getTransactionColumnsClassName(showCategory);

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
                    onClick={() => setIsNewTransactionOpen(true)}
                    className="w-full shrink-0 @xl:w-auto"
                />
            </div>

            <div
                className={`hidden border-y border-light-10 px-7 py-4 text-sm text-light @5xl:grid ${columnsClassName}`}
            >
                <span>{t("walletView.transaction")}</span>
                <span>{t("walletView.registeredBy")}</span>
                {showCategory ? <span>{t("walletView.category")}</span> : null}
                <span>{t("walletView.date")}</span>
                <span className="text-right">{t("walletView.amount")}</span>
                <span className="sr-only">Acciones</span>
            </div>

            <div className="flex-1 overflow-x-hidden overflow-y-auto">
                <TransactionsTable
                    transactions={transactions}
                    isLoading={isLoading}
                    query={query}
                    currency={currency}
                    showCategory={showCategory}
                    onEdit={setEditTransaction}
                    onDelete={setDeleteTransaction}
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

            <NewTransactionModal
                isModalOpen={isNewTransactionOpen}
                setIsModalOpen={setIsNewTransactionOpen}
                walletId={walletId}
                initialType={initialType}
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

            <DeleteTransactionModal
                transaction={deleteTransaction}
                onClose={() => setDeleteTransaction(null)}
            />
        </>
    );
};
