import { WalletCards } from "lucide-react";
import { useParams } from "react-router";
import { useTranslation } from "react-i18next";

import { useBudgetViewPage } from "./hooks/useBudgetViewPage";
import { BudgetViewTabs } from "./components/BudgetViewTabs";
import { BudgetMetricCard } from "./components/BudgetMetricCard";
import { BudgetSpendingTrend } from "./components/BudgetSpendingTrend";
import { BudgetProgress } from "./components/BudgetProgress";
import { BudgetRecentActivity } from "./components/BudgetRecentActivity";
import { BudgetSettingsPanel } from "./components/BudgetSettingsPanel";

import { CustomEmptyState } from "@/components/custom/CustomEmptyState";
import { SkeletonText } from "@/components/loaders/SkeletonText";

export const BudgetViewPage = () => {
    const { t } = useTranslation();
    const { id: budgetId } = useParams<{ id: string }>();
    const view = useBudgetViewPage(budgetId);

    if (view.isNotFound) {
        return (
            <CustomEmptyState
                title={t("budgetView.notFound")}
                description={t("budgetView.notFoundHint")}
                Icon={WalletCards}
            />
        );
    }

    return (
        <div className="flex h-full flex-col px-4 py-5 sm:px-7 pb-6">
            <header className="mb-6">
                {view.isLoading && !view.budget ? (
                    <div className="space-y-2">
                        <SkeletonText className="h-8 w-48" />
                        <SkeletonText className="h-4 w-56" />
                    </div>
                ) : (
                    <div className="flex justify-between items-center gap-5">
                        <h1 className="truncate text-2xl font-semibold tracking-tight text-light sm:text-3xl">
                            {view.title}
                        </h1>
                        <div className="mt-3 flex flex-wrap items-center gap-2">
                            <span className="inline-flex items-center rounded-full border border-light-10 bg-surface px-2.5 py-0.5 text-xs text-helper">
                                {view.periodLabel}
                            </span>
                            {view.scopeTags.map((tag) => (
                                <span
                                    key={tag}
                                    className="inline-flex items-center rounded-full border border-light-10 bg-surface px-2.5 py-0.5 text-xs text-helper"
                                >
                                    {tag}
                                </span>
                            ))}
                            <span className="inline-flex items-center rounded-full bg-success-sweet px-2.5 py-0.5 text-xs font-medium text-success">
                                {view.statusLabel}
                            </span>
                        </div>
                    </div>
                )}
            </header>

            <BudgetViewTabs
                activeTab={view.activeTab}
                onChange={view.setTab}
                className={view.activeTab === "settings" ? "" : "mb-5"}
            />

            {view.activeTab === "settings" ? (
                <BudgetSettingsPanel
                    budget={view.budget}
                    isLoading={view.isLoading}
                />
            ) : (
                <div className="flex flex-1 flex-col gap-5 pb-5">
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                        <BudgetMetricCard
                            title={t("budgetView.remaining")}
                            amount={view.budget?.remaining ?? 0}
                            currency={view.currency}
                            subtitle={`${view.budget?.daysLeft ?? 0} ${(view.budget?.daysLeft ?? 0) === 1 ? t("budgetView.dayRemaining") : t("budgetView.daysRemaining")}`}
                            isLoading={view.isLoading && !view.budget}
                        />
                        <BudgetMetricCard
                            title={t("budgetView.spent")}
                            amount={view.budget?.spent ?? 0}
                            currency={view.currency}
                            subtitle={view.spentSubtitle}
                            isLoading={view.isLoading && !view.budget}
                        />
                        <BudgetMetricCard
                            title={t("budgetView.budget")}
                            amount={view.budget?.budgetLimit ?? 0}
                            currency={view.currency}
                            isLoading={view.isLoading && !view.budget}
                        />
                    </div>

                    <BudgetProgress
                        percent={view.usedPercent}
                        warning={view.budget?.thresholdWarning}
                        critical={view.budget?.thresholdCritical}
                        spent={view.budget?.spent}
                        budgetLimit={view.budget?.budgetLimit}
                        currency={view.currency}
                    />

                    <div className="grid grid-cols-1 gap-4 xl:grid-cols-[minmax(0,1.35fr)_minmax(0,1fr)]">
                        <BudgetSpendingTrend
                            points={view.budget?.spendingTrend ?? []}
                            isLoading={view.isLoading && !view.budget}
                            currency={view.currency}
                            yMax={view.budget?.budgetLimit}
                        />
                        <BudgetRecentActivity
                            items={view.budget?.recentActivity}
                            currency={view.currency}
                            isLoading={view.isLoading && !view.budget}
                        />
                    </div>
                </div>
            )}
        </div>
    );
};
