export type RecurrencePattern = "DAILY" | "WEEKLY" | "MONTHLY" | "YEARLY";

export interface CreateExpenseData {
    title: string;
    description: string;
    amount: number;
    date: string;
    walletId: string;
    source: string;
    recurring: boolean;
    recurrencePattern: RecurrencePattern | null;
    categoryId: string;
    taxDeductible: boolean;
    reimbursable: boolean;
}

export interface Expense extends CreateExpenseData {
    id: string;
}
