import type { Transaction } from "@/modules/app/interfaces/Transaction";

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
    transaction.contributorName.trim() ||
    transaction.contributorEmail?.trim() ||
    "—";
