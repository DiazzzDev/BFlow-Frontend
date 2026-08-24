export type RecurrencePattern = "DAILY" | "WEEKLY" | "MONTHLY" | "YEARLY";

export interface CreateIncomeData {
    title: string;
    description: string;
    amount: number;
    date: string;
    walletId: string;
    source: string;
    recurring: boolean;
    recurrencePattern: RecurrencePattern | null;
    categoryId: string;
    taxable: boolean;
}

export interface Income extends CreateIncomeData {
    id: string;
}
