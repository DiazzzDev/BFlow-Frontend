export type RecurringType = "INCOME" | "EXPENSE";

export type RecurringFrequency = "DAILY" | "WEEKLY" | "MONTHLY" | "YEARLY";

export interface CreateRecurringData {
    title: string;
    description: string;
    amount: number;
    walletId: string;
    categoryId: string;
    type: RecurringType;
    frequency: RecurringFrequency;
    intervalValue: number;
    startDate: string;
    endDate: string;
}

export interface Recurring extends CreateRecurringData {
    id: string;
}
