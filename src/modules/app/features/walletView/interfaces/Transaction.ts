export type TransactionType = "INCOME" | "EXPENSE" | "TRANSFER";

export interface Transaction {
    id: string;
    type: TransactionType;
    title: string;
    description: string;
    amount: number;
    date: string;
    walletId: string;
    walletName: string;
    counterpartWalletId: string | null;
    counterpartWalletName: string | null;
    categoryId: string;
    categoryName: string;
    categoryIcon: string;
    categoryColor: string;
    contributorId: string;
    contributorName: string;
    status: string | null;
    source: string;
}

export interface WalletDetails {
    lastActivity: string;
    highestExpense: string;
    transactions: number;
    initialValue: number;
    upcoming: Array<{
        title: string;
        nextExecutionDate: string;
    }>;
}
