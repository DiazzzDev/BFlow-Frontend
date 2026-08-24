import { WalletCards } from "lucide-react";
import { useParams } from "react-router";

import {
    budgetPeriodLabels,
    budgetScopeLabels,
    getBudgetDisplayName,
    getBudgetStatusLabel,
} from "../budgets/utils/budgetStatus";

import { useGetBudget } from "./hooks/useGetBudget";
import { isBudgetViewTab, type BudgetViewTab } from "./budgetView.tabs";
import { BudgetViewTabs } from "./components/BudgetViewTabs";
import { BudgetMetricCard } from "./components/BudgetMetricCard";
import { BudgetSpendingTrend } from "./components/BudgetSpendingTrend";
import { BudgetProgress } from "./components/BudgetProgress";
import { BudgetRecentActivity } from "./components/BudgetRecentActivity";
import { BudgetSettingsPanel } from "./components/BudgetSettingsPanel";

import { CustomEmptyState } from "@/components/custom/CustomEmptyState";
import { SkeletonText } from "@/components/loaders/SkeletonText";
import { formatCurrency } from "@/utils/formatters/formatCurrency";
import { useUpdateSearchParams } from "@/hooks/useUpdateSearchParams";

export const BudgetViewPage = () => {
    const { id: budgetId } = useParams<{ id: string }>();
    const { budget, isLoading, isNotFound } = useGetBudget(budgetId);
    const { params, updateSearchParams } = useUpdateSearchParams();
    const tabParam = params.get("tab");
    const activeTab: BudgetViewTab = isBudgetViewTab(tabParam) ? tabParam : "overview";

    if (isNotFound) {
        return (
            <CustomEmptyState
                title="Presupuesto no encontrado"
                description="El presupuesto que buscas no existe o ya no tienes acceso."
                Icon={WalletCards}
            />
        );
    }

    const currency = budget?.currency;
    const usedPercent = budget?.percentage ?? 0;
    const title = budget ? getBudgetDisplayName(budget) : "Presupuesto";
    const periodLabel = budget
        ? (budgetPeriodLabels[budget.period] ?? budget.period)
        : "";
    const scopeTags = budget
        ? budget.scope === "WALLET_CATEGORY"
            ? ["Wallet", "Category"]
            : [budgetScopeLabels[budget.scope] ?? budget.scope]
        : [];
    const statusLabel = budget ? getBudgetStatusLabel(budget.status) : "";
    const transactionCount = budget?.transactionCount ?? 0;
    const spentSubtitle = budget
        ? `${transactionCount} ${transactionCount === 1 ? "transacción" : "transacciones"} · ${formatCurrency(budget.averageDailySpend, currency)}/día`
        : "";

    return (
        <div className="flex h-full flex-col px-4 py-5 sm:px-7 pb-6">
            <header className="mb-6">
                {isLoading && !budget ? (
                    <div className="space-y-2">
                        <SkeletonText className="h-8 w-48" />
                        <SkeletonText className="h-4 w-56" />
                    </div>
                ) : (
                    <div className="flex justify-between items-center gap-5">
                        <h1 className="truncate text-2xl font-semibold tracking-tight text-light sm:text-3xl">
                            {title}
                        </h1>
                        <div className="mt-3 flex flex-wrap items-center gap-2">
                            <span className="inline-flex items-center rounded-full border border-light-10 bg-surface px-2.5 py-0.5 text-xs text-helper">
                                {periodLabel}
                            </span>
                            {scopeTags.map((tag) => (
                                <span
                                    key={tag}
                                    className="inline-flex items-center rounded-full border border-light-10 bg-surface px-2.5 py-0.5 text-xs text-helper"
                                >
                                    {tag}
                                </span>
                            ))}
                            <span className="inline-flex items-center rounded-full bg-success-sweet px-2.5 py-0.5 text-xs font-medium text-success">
                                {statusLabel}
                            </span>
                        </div>
                    </div>
                )}
            </header>

            <BudgetViewTabs
                activeTab={activeTab}
                onChange={(tab) => {
                    updateSearchParams({ tab: tab === "overview" ? null : tab });
                }}
                className={activeTab === "settings" ? "" : "mb-5"}
            />

            {activeTab === "settings" ? (
                <BudgetSettingsPanel
                    budget={budget}
                    isLoading={isLoading}
                />
            ) : (
                <div className="flex flex-1 flex-col gap-5 pb-5">
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                        <BudgetMetricCard
                            title="Remaining"
                            amount={budget?.remaining ?? 0}
                            currency={currency}
                            subtitle={`${budget?.daysLeft ?? 0} days left`}
                            isLoading={isLoading && !budget}
                        />
                        <BudgetMetricCard
                            title="Spent"
                            amount={budget?.spent ?? 0}
                            currency={currency}
                            subtitle={spentSubtitle}
                            isLoading={isLoading && !budget}
                        />
                        <BudgetMetricCard
                            title="Budget"
                            amount={budget?.budgetLimit ?? 0}
                            currency={currency}
                            isLoading={isLoading && !budget}
                        />
                    </div>

                    <BudgetProgress
                        percent={usedPercent}
                        warning={budget?.thresholdWarning}
                        critical={budget?.thresholdCritical}
                        spent={budget?.spent}
                        budgetLimit={budget?.budgetLimit}
                        currency={currency}
                    />

                    <div className="grid grid-cols-1 gap-4 xl:grid-cols-[minmax(0,1.35fr)_minmax(0,1fr)]">
                        <BudgetSpendingTrend
                            points={budget?.spendingTrend ?? []}
                            isLoading={isLoading && !budget}
                            currency={currency}
                            yMax={budget?.budgetLimit}
                        />
                        <BudgetRecentActivity
                            items={budget?.recentActivity}
                            currency={currency}
                            isLoading={isLoading && !budget}
                        />
                    </div>
                </div>
            )}
        </div>
    );
};
