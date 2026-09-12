import type { Transaction } from "@/modules/app/interfaces/Transaction";
import { formatDateInputValue } from "@/utils/formatters/formatDateInputValue";

export const getTransactionFormInitialValues = (transaction: Transaction) => ({
    title: transaction.title,
    description: transaction.description,
    amount: String(Math.abs(transaction.amount)),
    date: formatDateInputValue(transaction.date),
    categoryId: transaction.categoryId,
    categoryName: transaction.categoryName,
});

export const getTransferFormInitialValues = (transaction: Transaction) => ({
    counterpartWalletId: transaction.counterpartWalletId ?? "",
    counterpartWalletName: transaction.counterpartWalletName ?? undefined,
    amount: String(Math.abs(transaction.amount)),
    description: transaction.description,
    direction: (transaction.amount < 0 ? "outgoing" : "incoming") as
        | "outgoing"
        | "incoming",
});
