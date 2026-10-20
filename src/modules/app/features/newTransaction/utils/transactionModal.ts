import type { TransactionModalMode } from "./transactionModalTitles";

import type {
    Transaction,
    TransactionType,
} from "@/modules/app/interfaces/Transaction";
import { TRANSACTION_TYPE_VALUES } from "@/modules/app/interfaces/Transaction";

export const resolveInitialTransactionType = (
    mode: TransactionModalMode,
    transaction?: Transaction | null,
    initialType?: TransactionType | null,
    allowedTypes: readonly TransactionType[] = TRANSACTION_TYPE_VALUES,
): TransactionType => {
    if ((mode === "view" || mode === "edit") && transaction) {
        return transaction.type;
    }

    const preferred = initialType ?? "INCOME";
    if (allowedTypes.includes(preferred)) {
        return preferred;
    }

    return allowedTypes[0] ?? "INCOME";
};

export const getTransactionModalContentKey = (
    isModalOpen: boolean,
    mode: TransactionModalMode,
    transactionId?: string,
    initialType?: TransactionType | null,
) =>
    isModalOpen
        ? `${mode}-${transactionId ?? "new"}-${initialType ?? "default"}`
        : "closed";

export const getTransactionModalMaxWidth = (
    visibleTypes: readonly TransactionType[],
    headingType: TransactionType,
) =>
    visibleTypes.includes("TRANSFER") || headingType === "TRANSFER"
        ? "max-w-3xl"
        : "max-w-lg";
