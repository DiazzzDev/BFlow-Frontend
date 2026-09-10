import {
    BUDGET_PERIOD_LABELS,
    BUDGET_SCOPE_LABELS,
    getBudgetDisplayName,
    getBudgetStatusLabel,
} from "../../budgets/utils/budgetStatus";
import { isBudgetViewTab, type BudgetViewTab } from "../utils/tabs/budgetViewTabs";

import { useGetBudget } from "./useGetBudget";

import { formatCurrency } from "@/utils/formatters/formatCurrency";
import { useUpdateSearchParams } from "@/hooks/useUpdateSearchParams";

const getScopeTags = (scope: string) => {
    if (scope === "WALLET_CATEGORY") {
        return ["Billetera", "Categoría"];
    }

    return [BUDGET_SCOPE_LABELS[scope] ?? scope];
};

export const useBudgetViewPage = (budgetId?: string) => {
    const { budget, isLoading, isNotFound } = useGetBudget(budgetId);
    const { params, updateSearchParams } = useUpdateSearchParams();
    const tabParam = params.get("tab");
    const activeTab: BudgetViewTab = isBudgetViewTab(tabParam)
        ? tabParam
        : "overview";

    const currency = budget?.currency;
    const usedPercent = budget?.percentage ?? 0;
    const title = budget ? getBudgetDisplayName(budget) : "Presupuesto";
    const periodLabel = budget
        ? (BUDGET_PERIOD_LABELS[budget.period] ?? budget.period)
        : "";
    const scopeTags = budget ? getScopeTags(budget.scope) : [];
    const statusLabel = budget ? getBudgetStatusLabel(budget.status) : "";
    const transactionCount = budget?.transactionCount ?? 0;
    const spentSubtitle = budget
        ? `${transactionCount} ${transactionCount === 1 ? "transacción" : "transacciones"} · ${formatCurrency(budget.averageDailySpend, currency)}/día`
        : "";

    const setTab = (tab: BudgetViewTab) => {
        updateSearchParams({ tab: tab === "overview" ? null : tab });
    };

    return {
        budget,
        isLoading,
        isNotFound,
        activeTab,
        setTab,
        currency,
        usedPercent,
        title,
        periodLabel,
        scopeTags,
        statusLabel,
        spentSubtitle,
    };
};
