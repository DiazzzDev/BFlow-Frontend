export interface MonthlyStatistic {
    month: string;
    income: number;
    expense: number;
}

export interface DashboardStatistics {
    months: MonthlyStatistic[];
}

export interface SpendingCategory {
    categoryId: string;
    categoryName: string;
    /** Percent units as returned by API (e.g. 58.7 = 58.7%). */
    percentage: number;
}

export interface DashboardSpending {
    totalSpent: number;
    /** Percent units as returned by API (e.g. 5.8 = 5.8%). */
    totalActivityPercentage: number;
    topCategories: SpendingCategory[];
}

export interface DashboardActivityBreakdown {
    totalTransactions: number;
    incomePercentage: number;
    expensePercentage: number;
    transferPercentage: number;
    activityChangePercentage: number;
}

export interface RecentActivityItem {
    type: string; // TODO: confirmar enum real (ej: "INCOME" | "EXPENSE")
    name: string;
    createdAt: string;
    amount: number;
    walletName: string;
}

// TODO: el swagger solo muestra "OK" como ejemplo, confirmar el resto del enum
export type BudgetHealthStatus = "OK" | (string & {});

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