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
    DAILY: "Diario",
    WEEKLY: "Semanal",
    MONTHLY: "Mensual",
    YEARLY: "Anual",
};

export const budgetScopeLabels: Record<string, string> = {
    WALLET: "Billetera",
    CATEGORY_GLOBAL: "Categoría",
    WALLET_CATEGORY: "Billetera · Categoría",
};

export const getBudgetStatusLabel = (status?: string | null) => {
    const normalized = status?.trim();
    if (!normalized) {
        return "Activo";
    }
    if (normalized.toUpperCase() === "OK") {
        return "Activo";
    }

    const statusLabels: Record<string, string> = {
        exceeded: "Excedido",
        healthy: "Saludable",
        critical: "Crítico",
        warning: "Advertencia",
        active: "Activo",
    };

    const key = normalized.toLowerCase();
    return statusLabels[key] ?? normalized.charAt(0).toUpperCase() + normalized.slice(1).toLowerCase();
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
