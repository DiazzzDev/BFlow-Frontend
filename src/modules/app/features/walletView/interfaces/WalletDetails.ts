import type { TransactionType } from "@/modules/app/interfaces/Transaction";

export interface WalletDetails {
    lastActivity: string;
    highestExpense: string;
    transactions: number;
    initialValue: number;
    upcoming: UpcomingTransaction[];
}

export interface UpcomingTransaction {
    title: string;
    amount: number;
    type: Exclude<TransactionType, "TRANSFER">;
    nextExecutionDate: string;
}
