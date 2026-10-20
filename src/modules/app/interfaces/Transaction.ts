export const TRANSACTION_TYPE_VALUES = [
    "INCOME",
    "EXPENSE",
    "TRANSFER",
] as const;

export type TransactionType = (typeof TRANSACTION_TYPE_VALUES)[number];

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
    contributorEmail: string | null;
    contributorPictureUrl: string | null;
    status: string | null;
    source: string;
}
