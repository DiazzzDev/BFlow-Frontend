import type { Transaction } from "../../walletView/interfaces/Transaction";
import type { CreateExpenseData } from "../../../components/newTransaction/interfaces/Expense";
import type { CreateIncomeData } from "../../../components/newTransaction/interfaces/Income";
import type { CreateTransferData } from "../../../components/newTransaction/interfaces/Transfer";

export const toDateInputValue = (date: string) => date.slice(0, 10);

export const todayDateInputValue = () => new Date().toISOString().slice(0, 10);

export const withDuplicatedDescription = (description: string) => {
    const base = description.trim();
    return base ? `${base} (Transacción duplicada)` : "(Transacción duplicada)";
};

export const buildDuplicateExpensePayload = (
    transaction: Transaction,
): CreateExpenseData => ({
    title: transaction.title,
    description: withDuplicatedDescription(transaction.description),
    amount: Math.abs(transaction.amount),
    date: todayDateInputValue(),
    walletId: transaction.walletId,
    source: transaction.source || "manual",
    recurring: false,
    recurrencePattern: null,
    categoryId: transaction.categoryId,
    taxDeductible: false,
    reimbursable: false,
});

export const buildDuplicateIncomePayload = (
    transaction: Transaction,
): CreateIncomeData => ({
    title: transaction.title,
    description: withDuplicatedDescription(transaction.description),
    amount: Math.abs(transaction.amount),
    date: todayDateInputValue(),
    walletId: transaction.walletId,
    source: transaction.source || "manual",
    recurring: false,
    recurrencePattern: null,
    categoryId: transaction.categoryId,
    taxable: false,
});

export const buildDuplicateTransferPayload = (
    transaction: Transaction,
): CreateTransferData | null => {
    if (!transaction.counterpartWalletId) {
        return null;
    }

    const amount = Math.abs(transaction.amount);
    const isOutgoing = transaction.amount < 0;

    return {
        fromWalletId: isOutgoing
            ? transaction.walletId
            : transaction.counterpartWalletId,
        toWalletId: isOutgoing
            ? transaction.counterpartWalletId
            : transaction.walletId,
        amount,
        description: withDuplicatedDescription(transaction.description),
    };
};
