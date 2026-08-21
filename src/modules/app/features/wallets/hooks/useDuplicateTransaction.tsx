import { toast } from "sonner";

import { usePostExpense } from "../../../components/newTransaction/hooks/useMutateExpenses";
import { usePostIncome } from "../../../components/newTransaction/hooks/useMutateIncomes";
import { useMutateTransfers } from "../../../components/newTransaction/hooks/useMutateTransfers";
import type { Transaction } from "../../walletView/interfaces/Transaction";
import {
    buildDuplicateExpensePayload,
    buildDuplicateIncomePayload,
    buildDuplicateTransferPayload,
} from "../utils/transaction.service";

export const useDuplicateTransaction = () => {
    const createExpense = usePostExpense();
    const createIncome = usePostIncome();
    const { createTransfer } = useMutateTransfers();

    const isPending = createExpense.isPending || createIncome.isPending || createTransfer.isPending;

    const duplicateTransaction = async (transaction: Transaction) => {
        let promise: Promise<unknown>;

        if (transaction.type === "EXPENSE") {
            promise = createExpense.mutateAsync(buildDuplicateExpensePayload(transaction));
        } else if (transaction.type === "INCOME") {
            promise = createIncome.mutateAsync(buildDuplicateIncomePayload(transaction));
        } else {
            const payload = buildDuplicateTransferPayload(transaction);
            if (!payload) {
                toast.error("No se puede duplicar: falta la billetera contraparte");
                return;
            }
            promise = createTransfer.mutateAsync(payload);
        }

        toast.promise(promise, {
            loading: "Duplicando transacción...",
            success: "Transacción duplicada",
            error: (err) =>
                err instanceof Error ? err.message : "Error al duplicar la transacción",
        });

        await promise;
    };

    return {
        duplicateTransaction,
        isPending,
    };
};
