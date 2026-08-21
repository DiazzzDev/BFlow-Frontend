import { useState } from "react";
import { toast } from "sonner";

import { useDeleteExpense } from "../../../components/newTransaction/hooks/useMutateExpenses";
import { useDeleteIncome } from "../../../components/newTransaction/hooks/useMutateIncomes";
import { useDuplicateTransaction } from "../../wallets/hooks/useDuplicateTransaction";
import type { Transaction } from "../interfaces/Transaction";

export const useWalletTransactionActions = () => {
    const { duplicateTransaction, isPending: isDuplicating } = useDuplicateTransaction();
    const deleteExpense = useDeleteExpense();
    const deleteIncome = useDeleteIncome();

    const [isNewTransactionOpen, setIsNewTransactionOpen] = useState(false);
    const [isScheduleOpen, setIsScheduleOpen] = useState(false);
    const [editTransaction, setEditTransaction] = useState<Transaction | null>(null);
    const [deleteTransaction, setDeleteTransaction] = useState<Transaction | null>(null);

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

    return {
        isNewTransactionOpen,
        setIsNewTransactionOpen,
        isScheduleOpen,
        setIsScheduleOpen,
        editTransaction,
        setEditTransaction,
        deleteTransaction,
        setDeleteTransaction,
        duplicateTransaction,
        isDuplicating,
        isDeleting,
        handleConfirmDelete,
    };
};
