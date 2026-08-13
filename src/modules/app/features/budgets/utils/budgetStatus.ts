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

export const getBudgetDisplayName = (budget: Budget) => {
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
