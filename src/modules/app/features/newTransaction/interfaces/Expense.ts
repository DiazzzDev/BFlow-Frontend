import type { Periodicity } from "@/modules/app/interfaces/Periodicity";

export interface CreateExpenseData {
    title: string;
    description: string;
    amount: number;
    date: string;
    walletId: string;
    source: string;
    recurring: boolean;
    recurrencePattern: Periodicity | null;
    categoryId: string;
}

export interface Expense extends CreateExpenseData {
    id: string;
}
