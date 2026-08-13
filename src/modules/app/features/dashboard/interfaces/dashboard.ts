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
    percentage: number; // 0-1 segun ejemplo del swagger (0.1 = 10%)
}

export interface DashboardSpending {
    totalSpent: number;
    totalActivityPercentage: number; // 0-1
    topCategories: SpendingCategory[];
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
    percentageChangeLastMonth: number; // 0-1
}

export interface DashboardAverages {
    averageIncome: number;
    incomePercentageChangeLastMonth: number; // 0-1
    averageExpenses: number;
    expensesPercentageChangeLastMonth: number; // 0-1
}