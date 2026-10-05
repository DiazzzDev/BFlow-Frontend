import { CreditCard } from "lucide-react";
import { useNavigate } from "react-router";
import { useTranslation } from "react-i18next";

import type { BudgetHealth } from "../interfaces/dashboard";
import { getBudgetHealthStatusStyle } from "../utils/budgetHealthStatus";
import {
    dashboardCardClass,
    dashboardLabelClass,
} from "../utils/dashboardCard";

import { formatterDynamicDate } from "@/utils/formatters/formatDynamicDate";
import { formatCurrency } from "@/utils/formatters/formatCurrency";
import { Button } from "@/components/controls/Button";
import { CustomEmptyState } from "@/components/custom/CustomEmptyState";

interface BudgetsHealthCardProps {
    isLoading: boolean;
    budgets: BudgetHealth[];
    onReviewBudgets?: () => void;
}

export const BudgetsHealthCard = ({
    isLoading,
    budgets,
    onReviewBudgets,
}: BudgetsHealthCardProps) => {
    const navigate = useNavigate();
    const { t } = useTranslation();

    // Navigate to budgets list (or custom handler)
    const handleReview = () => {
        if (onReviewBudgets) {
            onReviewBudgets();
            return;
        }
        void navigate("/app/budgets");
    };

    const handleBudgetClick = (budgetId: string) => {
        void navigate(`/app/budgets/${budgetId}`);
    };

    return (
        <div className={`${dashboardCardClass} flex-1`}>
            <p className={dashboardLabelClass}>{t("dashboard.budgetHealth")}</p>

            <div className="mt-4 flex flex-1 flex-col gap-1">
                {isLoading &&
                    Array.from({ length: 2 }).map((_, index) => (
                        <div
                            key={index}
                            className="h-14 w-full animate-pulse rounded-xl bg-skeleton"
                        />
                    ))}

                {!isLoading && budgets.length === 0 && (
                    <CustomEmptyState
                        title={t("dashboard.noBudgets")}
                        description={t("dashboard.createBudgetHint")}
                        Icon={CreditCard}
                        className="m-0! py-2!"
                    />
                )}

                {!isLoading &&
                    budgets.map((budget) => {
                        const hasProgress = budget.percentage !== null && budget.percentage !== undefined;
                        const percentage = Math.max(0, Math.min(100, budget.percentage ?? 0));
                        const progressColor = budget.color ?? (budget.status === "EXCEEDED" ? "var(--color-danger)" : "var(--color-primary)");

                        return (
                            <button
                                key={budget.id}
                                type="button"
                                onClick={() => handleBudgetClick(budget.id)}
                                className="rounded-xl px-1 py-2 text-left transition-colors hover:bg-light-5 cursor-pointer"
                            >
                                <div className="flex items-center justify-between gap-3">
                                    <p className="truncate text-sm font-medium text-light">
                                        {budget.displayName}
                                    </p>
                                    {hasProgress ? (
                                        <span className="shrink-0 text-xs font-semibold text-primary">{Math.round(percentage)}%</span>
                                    ) : (
                                        <span className={`shrink-0 rounded-full px-2.5 py-1 text-xs font-medium ${getBudgetHealthStatusStyle(budget.status)}`}>
                                            {t(`budgets.status.${budget.status}`, { defaultValue: budget.status })}
                                        </span>
                                    )}
                                </div>
                                {hasProgress ? (
                                    <>
                                        <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-light-10">
                                            <div className="h-full rounded-full" style={{ width: `${percentage}%`, backgroundColor: progressColor }} />
                                        </div>
                                        <p className="mt-1.5 truncate text-[11px] text-helper">
                                            {budget.remaining !== null && budget.remaining !== undefined && budget.budgetLimit !== null && budget.budgetLimit !== undefined
                                                ? t("dashboard.budgetRemaining", { remaining: formatCurrency(budget.remaining), limit: formatCurrency(budget.budgetLimit) })
                                                : budget.spent !== null && budget.spent !== undefined && budget.budgetLimit !== null && budget.budgetLimit !== undefined
                                                    ? t("dashboard.budgetSpent", { spent: formatCurrency(budget.spent), limit: formatCurrency(budget.budgetLimit) })
                                                    : t("dashboard.updated", { date: formatterDynamicDate(budget.updatedAt) })}
                                        </p>
                                    </>
                                ) : (
                                    <p className="truncate text-[11px] text-helper">
                                        {t("dashboard.updated", { date: formatterDynamicDate(budget.updatedAt) })}
                                    </p>
                                )}
                            </button>
                        );
                    })}
            </div>

            <Button
                type="button"
                onClick={handleReview}
                text={t("dashboard.reviewBudgets")}
                className="mt-4 w-full"
            />
        </div>
    );
};
