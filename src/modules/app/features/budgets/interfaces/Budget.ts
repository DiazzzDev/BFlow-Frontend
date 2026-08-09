export type BudgetPeriod = "DAILY" | "WEEKLY" | "MONTHLY" | "YEARLY";
export type BudgetScope = "WALLET" | "CATEGORY_GLOBAL" | "WALLET_CATEGORY";

export interface Budget {
    id: string;
    budgetLimit: number;
    period: BudgetPeriod | string;
    scope: BudgetScope | string;
    startDate: string;
    thresholdCritical: number;
    thresholdWarning: number;
    updatedAt: string | null;
    createdAt: string | null;
    walletId: string | null;
    walletName: string | null;
    categoryId: string | null;
    categoryName: string | null;
    percentage: number | null;
    remaining: number | null;
    spent: number | null;
    status: string | null;
}

export interface GetBudgetsParams {
    query?: string;
    sort?: string;
    period?: string;
    page?: number;
    size?: number;
}

export interface CreateBudgetData {
    amount: number;
    period: BudgetPeriod | string;
    startDate: string;
    scope: BudgetScope;
    thresholdWarning: number;
    thresholdCritical: number;
    walletId?: string | null;
    categoryId?: string | null;
}
