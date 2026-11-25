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
    description: string | null;
    amount: number;
    date: string;
    walletId: string;
    walletName: string;
    counterpartWalletId: string | null;
    counterpartWalletName: string | null;
    categoryId: string | null;
    categoryName: string | null;
    categoryIcon: string | null;
    categoryColor: string | null;
    contributorId: string;
    contributorName: string;
    contributorEmail: string | null;
    contributorPictureUrl: string | null;
    status: string | null;
    source: string;
}
