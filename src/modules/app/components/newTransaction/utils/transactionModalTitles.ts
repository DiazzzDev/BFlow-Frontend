import type { TransactionType } from "@/modules/app/interfaces/Transaction";

export type TransactionModalMode = "create" | "view" | "edit";

export const TRANSACTION_MODAL_TITLES: Record<
    TransactionModalMode,
    Record<TransactionType, string>
> = {
    create: {
        INCOME: "transactions.new",
        EXPENSE: "transactions.new",
        TRANSFER: "transactions.new",
    },
    view: {
        INCOME: "transactions.incomeDetail",
        EXPENSE: "transactions.expenseDetail",
        TRANSFER: "transactions.transferDetail",
    },
    edit: {
        INCOME: "transactions.incomeEdit",
        EXPENSE: "transactions.expenseEdit",
        TRANSFER: "transactions.transferEdit",
    },
};

export const getTransactionModalTitle = (
    mode: TransactionModalMode,
    type: TransactionType,
) =>
    mode === "create"
        ? "transactions.new"
        : TRANSACTION_MODAL_TITLES[mode][type];
