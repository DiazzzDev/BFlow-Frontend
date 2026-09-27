import type { CategoryIconKey } from "@/utils/categoryIcons";

export interface MonthlyStatistic {
    month: string;
    income: number;
    expense: number;
}

export interface DashboardStatistics {
    months: MonthlyStatistic[];
}

export interface DashboardActivityBreakdown {
    totalTransactions: number;
    incomePercentage: number;
    expensePercentage: number;
    transferPercentage: number;
    activityChangePercentage: number;
}

export interface RecentActivityItem {
    type: string;
    name: string;
    createdAt: string;
    amount: number;
    walletName: string;
    categoryColor: string;
    categoryIcon: CategoryIconKey;
}

export type BudgetHealthStatus = "OK" | "WARNING" | "CRITICAL" | "EXCEEDED";

export interface BudgetHealth {
    id: string;
    displayName: string;
    updatedAt: string;
    status: BudgetHealthStatus;
}

export interface DashboardBalance {
    total: number;
    /** Percent units as returned by API (e.g. 8.4 = 8.4%). */
    percentageChangeLastMonth: number;
}

export interface DashboardAverages {
    averageIncome: number;
    incomePercentageChangeLastMonth: number;
    averageExpenses: number;
    expensesPercentageChangeLastMonth: number;
}
