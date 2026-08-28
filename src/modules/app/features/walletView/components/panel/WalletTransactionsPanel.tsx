import { useState } from "react";
import { Plus } from "lucide-react";

import { NewTransactionModal } from "../../../../components/newTransaction/NewTransactionModal";
import { useDuplicateTransaction } from "../../../wallets/hooks/useDuplicateTransaction";
import type { Transaction } from "../../interfaces/Transaction";
import type { TransactionType } from "../../interfaces/Transaction";
import {
    TransactionsTable,
    getTransactionColumnsClassName,
} from "../TransactionsTable";
import { DeleteTransactionModal } from "../modal/DeleteTransactionModal";

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
    const { duplicateTransaction, isPending: isDuplicating } = useDuplicateTransaction();
    const [isNewTransactionOpen, setIsNewTransactionOpen] = useState(false);
    const [editTransaction, setEditTransaction] = useState<Transaction | null>(null);
    const [deleteTransaction, setDeleteTransaction] = useState<Transaction | null>(null);

    const columnsClassName = getTransactionColumnsClassName(showCategory);
    const actionsDisabled = isDuplicating;

    return (
        <>
            <div className="mb-4 flex flex-col gap-3 px-4 sm:px-7 @xl:flex-row @xl:items-center justify-between">
                <SearchInput
                    id="txtSearchTransactions"
                    placeholder="Buscar transacciones..."
                    className="w-full max-w-none min-w-0"
                    syncToParams
                />
                <Button
                    type="button"
                    text="Nueva transacción"
                    icon={<Plus className="h-4 w-4" />}
                    onClick={() => setIsNewTransactionOpen(true)}
                    className="w-full shrink-0 @xl:w-auto"
                />
            </div>

            <div
                className={`hidden border-y border-light-10 px-7 py-4 text-sm text-light @2xl:grid ${columnsClassName}`}
            >
                <span>Transacción</span>
                {showCategory ? <span>Categoría</span> : null}
                <span>Fecha</span>
                <span className="text-right">Monto</span>
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
