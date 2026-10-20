import type { CategoryIconKey } from "@/utils/categoryIcons";

export type RecentActivityType = "ALL" | "INCOME" | "EXPENSE";

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
    budgetLimit?: number | null;
    spent?: number | null;
    remaining?: number | null;
    percentage?: number | null;
    color?: string | null;
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
