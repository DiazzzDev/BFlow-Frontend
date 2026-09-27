import { toast } from "sonner";
import { useTranslation } from "react-i18next";

import {
    buildDuplicateExpensePayload,
    buildDuplicateIncomePayload,
    buildDuplicateTransferPayload,
} from "../utils/duplicateTransaction";
import { usePostExpense } from "../../newTransaction/hooks/useMutateExpenses";
import { usePostIncome } from "../../newTransaction/hooks/useMutateIncomes";
import { useMutateTransfers } from "../../newTransaction/hooks/useMutateTransfers";

import type { Transaction } from "@/modules/app/interfaces/Transaction";
import { getApiErrorMessage, getApiMessage } from "@/utils/api/apiMessage";

export const useDuplicateTransaction = () => {
    const { t } = useTranslation();
    // Create mutations reused from newTransaction
    const createExpense = usePostExpense();
    const createIncome = usePostIncome();
    const { createTransfer } = useMutateTransfers();

    const isPending = createExpense.isPending || createIncome.isPending || createTransfer.isPending;

    // Pick the right create endpoint from the transaction type
    const duplicateTransaction = async (transaction: Transaction) => {
        let promise: Promise<unknown>;

        if (transaction.type === "EXPENSE") {
            promise = createExpense.mutateAsync(buildDuplicateExpensePayload(transaction));
        } else if (transaction.type === "INCOME") {
            promise = createIncome.mutateAsync(buildDuplicateIncomePayload(transaction));
        } else {
            const payload = buildDuplicateTransferPayload(transaction);
            if (!payload) {
                toast.error(t("wallets.missingCounterpart"));
                return;
            }
            promise = createTransfer.mutateAsync(payload);
        }

        toast.promise(promise, {
            loading: t("wallets.duplicateLoading"),
            success: (response) => getApiMessage(response, t("wallets.duplicateFallback")),
            error: (error) => getApiErrorMessage(error, t("common.operationError")),
        });

        await promise;
    };

    return {
        duplicateTransaction,
        isPending,
    };
};
