import type { Budget } from "../interfaces/Budget";

export type BudgetStatus = "exceeded" | "healthy" | "critical" | "warning";

export const resolveBudgetStatus = (budget: Budget): BudgetStatus => {
    const normalized = budget.status?.toLowerCase();

    if (normalized === "exceeded" || normalized === "healthy" || normalized === "critical" || normalized === "warning") {
        return normalized;
    }

    if (budget.percentage === null) {
        return "healthy";
    }

    if (budget.percentage >= 100) {
        return "exceeded";
    }
    if (budget.percentage >= budget.thresholdCritical) {
        return "critical";
    }
    if (budget.percentage >= budget.thresholdWarning) {
        return "warning";
    }

    return "healthy";
};

export const budgetPeriodLabels: Record<string, string> = {
    DAILY: "Daily",
    WEEKLY: "Weekly",
    MONTHLY: "Monthly",
    YEARLY: "Yearly",
};

export const budgetScopeLabels: Record<string, string> = {
    WALLET: "Wallet",
    CATEGORY_GLOBAL: "Category",
    WALLET_CATEGORY: "Wallet · Category",
};

export const getBudgetStatusLabel = (status?: string | null) => {
    const normalized = status?.trim();
    if (!normalized) {
        return "Active";
    }
    if (normalized.toUpperCase() === "OK") {
        return "Active";
    }
    return normalized.charAt(0).toUpperCase() + normalized.slice(1).toLowerCase();
};

export const getBudgetDisplayName = (
    budget: Pick<Budget, "scope" | "walletName" | "categoryName">,
) => {
    if (budget.scope === "CATEGORY_GLOBAL" && budget.categoryName) {
        return budget.categoryName;
    }
    if (budget.scope === "WALLET_CATEGORY" && budget.walletName && budget.categoryName) {
        return `${budget.walletName} · ${budget.categoryName}`;
    }
    if (budget.walletName) {
        return budget.walletName;
    }
    if (budget.categoryName) {
        return budget.categoryName;
    }
    return "Presupuesto";
};
