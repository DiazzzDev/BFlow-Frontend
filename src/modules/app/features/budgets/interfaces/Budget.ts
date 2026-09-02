export type BudgetPeriod = "DAILY" | "WEEKLY" | "MONTHLY" | "YEARLY";
export type BudgetScope = "WALLET" | "CATEGORY_GLOBAL" | "WALLET_CATEGORY";

export interface Budget {
    id: string;
    budgetLimit: number;
    period: BudgetPeriod ;
    scope: BudgetScope;
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
    period: BudgetPeriod;
    startDate: string;
    scope: BudgetScope;
    currency: string;
    thresholdWarning: number;
    thresholdCritical: number;
    walletId?: string | null;
    categoryId?: string | null;
}

export interface UpdateBudgetData {
    amount: number;
    period: BudgetPeriod;
    startDate: string;
    thresholdWarning: number;
    thresholdCritical: number;
}

export interface BudgetSpendingTrendPoint {
    dayIndex: number;
    date: string;
    cumulativeAmount: number;
}

export interface BudgetRecentActivityItem {
    id: string;
    description: string;
    date: string;
    amount: number;
}

export interface BudgetDetail {
    id: string;
    walletId: string | null;
    walletName: string | null;
    currency: string;
    categoryId: string | null;
    categoryName: string | null;
    scope: BudgetScope;
    period: BudgetPeriod;
    status: string;
    startDate: string;
    endDate: string;
    daysLeft: number;
    daysElapsed: number;
    budgetLimit: number;
    spent: number;
    remaining: number;
    percentage: number;
    thresholdWarning: number;
    thresholdCritical: number;
    transactionCount: number;
    averageDailySpend: number;
    projectedTotal: number;
    spendingTrend: BudgetSpendingTrendPoint[];
    recentActivity: BudgetRecentActivityItem[];
}
