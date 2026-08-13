import { ChevronRight } from "lucide-react";

import type { Budget } from "../interfaces/Budget";
import {
    getBudgetDisplayName,
    resolveBudgetStatus,
    type BudgetStatus,
} from "../utils/budgetStatus";

import { formatCurrency } from "@/utils/formatters/formatCurrency";
import { formatterDynamicDate } from "@/utils/formatters/formatDynamicDate";

const statusStyles: Record<BudgetStatus, { label: string; className: string }> = {
    exceeded: {
        label: "Exceeded",
        className: "bg-danger-sweet text-danger",
    },
    healthy: {
        label: "Healthy",
        className: "bg-info/15 text-info",
    },
    critical: {
        label: "Critical",
        className: "bg-primary-15 text-primary",
    },
    warning: {
        label: "Warning",
        className: "bg-warning-sweet text-warning",
    },
};

const periodLabels: Record<string, string> = {
    DAILY: "Daily",
    WEEKLY: "Weekly",
    MONTHLY: "Monthly",
    YEARLY: "Yearly",
};

const scopeLabels: Record<string, string> = {
    WALLET: "Wallet",
    CATEGORY_GLOBAL: "Category",
    WALLET_CATEGORY: "Wallet · Category",
};

interface BudgetItemProps {
    budget: Budget;
    onClick?: () => void;
}

export const BudgetItem = ({ budget, onClick }: BudgetItemProps) => {
    const status = statusStyles[resolveBudgetStatus(budget)];
    const name = getBudgetDisplayName(budget);
    const updatedLabel = budget.updatedAt
        ? `Updated ${formatterDynamicDate(budget.updatedAt)}`
        : "Sin fecha de actualización";

    const tags = [
        periodLabels[budget.period] ?? budget.period,
        scopeLabels[budget.scope] ?? budget.scope,
        budget.walletName,
        budget.categoryName,
    ].filter(Boolean) as string[];

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
                            Spent {formatCurrency(budget.spent)}
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
                    className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium sm:px-3 ${status.className}`}
                >
                    {status.label}
                </span>
                <ChevronRight className="hidden h-5 w-5 text-helper sm:block" />
            </div>
        </button>
    );
};
