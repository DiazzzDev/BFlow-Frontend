import type { Transaction } from "@/modules/app/interfaces/Transaction";

export const getTransactionColumnsClassName = (showCategory: boolean) =>
    showCategory
        ? "grid-cols-[minmax(0,1.6fr)_minmax(0,1.2fr)_minmax(0,0.9fr)_minmax(0,0.7fr)_minmax(0,0.75fr)_auto] gap-3 items-center"
        : "grid-cols-[minmax(0,1.8fr)_minmax(0,1.3fr)_minmax(0,0.7fr)_minmax(0,0.75fr)_auto] gap-3 items-center";

/** @deprecated Prefer getTransactionColumnsClassName(showCategory) */
export const transactionColumnsClassName = getTransactionColumnsClassName(true);

export const displayAmount = (tx: Transaction) => {
    const abs = Math.abs(tx.amount);

    if (tx.type === "EXPENSE") {
        return -abs;
    }
    if (tx.type === "INCOME") {
        return abs;
    }
    return tx.amount;
};

export const canEditOrDelete = (type: Transaction["type"]) =>
    type === "INCOME" || type === "EXPENSE";

export const hasCategory = (tx: Transaction) =>
    tx.type === "INCOME" || tx.type === "EXPENSE";

export const getContributorDisplayName = (transaction: Transaction) =>
    transaction.contributorName?.trim() ||
    transaction.contributorEmail?.trim() ||
    "—";
