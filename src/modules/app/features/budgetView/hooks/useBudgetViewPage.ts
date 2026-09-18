import {
    BUDGET_SCOPE_LABELS,
    getBudgetDisplayName,
    getBudgetStatusLabel,
} from "../../budgets/utils/budgetStatus";
import { isBudgetViewTab, type BudgetViewTab } from "../utils/tabs/budgetViewTabs";

import { useGetBudget } from "./useGetBudget";
import { useTranslation } from "react-i18next";

import { PERIODICITY_LABELS } from "@/modules/app/interfaces/Periodicity";
import { formatCurrency } from "@/utils/formatters/formatCurrency";
import { useUpdateSearchParams } from "@/hooks/useUpdateSearchParams";

const getScopeTags = (scope: string) => {
    if (scope === "WALLET_CATEGORY") {
        return ["Billetera", "Categoría"];
    }

    return [BUDGET_SCOPE_LABELS[scope] ?? scope];
};

export const useBudgetViewPage = (budgetId?: string) => {
    const { t } = useTranslation();
    // Budget detail fetch
    const { budget, isLoading, isNotFound } = useGetBudget(budgetId);

    // Active tab from the URL (`overview` is the default / omitted param)
    const { params, updateSearchParams } = useUpdateSearchParams();
    const tabParam = params.get("tab");
    const activeTab: BudgetViewTab = isBudgetViewTab(tabParam) ? tabParam : "overview";

    const setTab = (tab: BudgetViewTab) => {
        updateSearchParams({ tab: tab === "overview" ? null : tab });
    };

    // Header / overview labels derived from the budget
    const currency = budget?.currency;
    const usedPercent = budget?.percentage ?? 0;
    const title = budget ? getBudgetDisplayName(budget) : t("budgets.empty");
    const periodLabel = budget ? t(`budgets.periods.${budget.period.toLowerCase()}`, { defaultValue: PERIODICITY_LABELS[budget.period] }) : "";
    const scopeTags = budget ? getScopeTags(budget.scope).map((tag) => tag === "Billetera" ? t("budgets.wallet") : t("budgets.category")) : [];
    const statusLabel = budget ? t(`budgets.status.${budget.status?.toLowerCase()}`, { defaultValue: getBudgetStatusLabel(budget.status) }) : "";
    const transactionCount = budget?.transactionCount ?? 0;
    const spentSubtitle = budget
        ? `${transactionCount} ${transactionCount === 1 ? t("budgetView.transaction") : t("budgetView.transactions")} · ${formatCurrency(budget.averageDailySpend, currency)}${t("budgetView.perDay")}`
        : "";

    return {
        budget,
        isLoading,
        isNotFound,
        activeTab,
        currency,
        usedPercent,
        title,
        periodLabel,
        scopeTags,
        statusLabel,
        spentSubtitle,
        setTab,
    };
};
