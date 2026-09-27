import { ChevronRight } from "lucide-react";
import { useTranslation } from "react-i18next";

import {
    BUDGET_SCOPE_LABELS,
    BUDGET_STATUS_CLASS_NAMES,
    getBudgetDisplayName,
    getBudgetStatusLabel,
    resolveBudgetStatus,
} from "../utils/budgetStatus";

import { formatCurrency } from "@/utils/formatters/formatCurrency";
import type { Budget } from "@/modules/app/interfaces/Budget";
import { formatterDynamicDate } from "@/utils/formatters/formatDynamicDate";

interface BudgetItemProps {
    budget: Budget;
    onClick?: () => void;
}

export const BudgetItem = ({ budget, onClick }: BudgetItemProps) => {
    const { t } = useTranslation();
    const status = resolveBudgetStatus(budget);
    const name = getBudgetDisplayName(budget);

    const updatedLabel = budget.updatedAt ? t("budgets.updated", { date: formatterDynamicDate(budget.updatedAt) }) : t("budgets.noUpdated");

    const periodKey = budget.period.toLowerCase();
    const scopeKey = budget.scope === "WALLET_CATEGORY" ? "walletCategory" : budget.scope === "CATEGORY_GLOBAL" ? "category" : "wallet";
    const tags = [t(`budgets.periods.${periodKey}`, { defaultValue: budget.period }), t(`budgets.scopes.${scopeKey}`, { defaultValue: BUDGET_SCOPE_LABELS[budget.scope] ?? budget.scope }), budget.walletName, budget.categoryName].filter(Boolean) as string[];

    return (
        <button
            type="button"
            onClick={onClick}
            className="flex w-full cursor-pointer items-start justify-between gap-3 border-b border-light-10 px-1 py-4 text-left transition-colors last:border-b-0 hover:bg-secondary/40 sm:items-center sm:gap-4 sm:py-5"
        >
            <div className="min-w-0 flex-1">
                <p className="truncate text-base font-semibold text-light">{name}</p>
                <p className="mt-1 line-clamp-2 text-sm text-helper sm:truncate sm:line-clamp-none">
                    {formatCurrency(budget.budgetLimit)}
                    {" · "}
                    {updatedLabel}
                    {budget.spent !== null && (
                        <>
                            {" · "}
                            {t("budgets.spent")} {formatCurrency(budget.spent)}
                        </>
                    )}
                </p>
                <div className="mt-3 flex flex-wrap items-center gap-2">
                    {tags.map((tag) => (
                        <span
                            key={`${budget.id}-${tag}`}
                            className="inline-flex items-center rounded-full border border-light-10 bg-surface-hard px-2.5 py-0.5 text-xs text-helper"
                        >
                            {tag}
                        </span>
                    ))}
                </div>
            </div>

            <div className="flex shrink-0 items-center gap-2 sm:gap-3">
                <span
                    className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium sm:px-3 ${BUDGET_STATUS_CLASS_NAMES[status]}`}
                >
                    {t(`budgets.status.${status}`, { defaultValue: getBudgetStatusLabel(status) })}
                </span>
                <ChevronRight className="hidden h-5 w-5 text-helper sm:block" />
            </div>
        </button>
    );
};
