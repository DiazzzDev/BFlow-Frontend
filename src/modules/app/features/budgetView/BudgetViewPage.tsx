import { WalletCards } from "lucide-react";

import { useBudgetRouteId, useGetBudget } from "./hooks/useGetBudget";
import { BudgetMetricCard } from "./components/BudgetMetricCard";
import { BudgetSpendingTrend } from "./components/BudgetSpendingTrend";
import { BudgetProgress } from "./components/BudgetProgress";
import { BudgetRecentActivity } from "./components/BudgetRecentActivity";

import { CustomEmptyState } from "@/components/custom/CustomEmptyState";
import { formatCurrency } from "@/utils/formatters/formatCurrency";

export const BudgetViewPage = () => {
    const budgetId = useBudgetRouteId();
    const { budget, isLoading, isNotFound } = useGetBudget(budgetId);

    if (isNotFound) {
        return (
            <CustomEmptyState
                title="Presupuesto no encontrado"
                description="El presupuesto que buscas no existe o ya no tienes acceso."
                Icon={WalletCards}
            />
        );
    }

    const spentPercent = budget
        ? (budget.spent / Math.max(budget.budget, 1)) * 100
        : 0;

    return (
        <div className="flex flex-col h-full min-h-0 px-6 py-5 gap-6">

            <section>

                <div className="grid grid-cols-1 xl:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)] gap-4">
                    <div className="flex flex-col gap-3">
                        <BudgetMetricCard
                            title="Remaining"
                            value={formatCurrency(budget?.remaining ?? 0, budget?.currency)}
                            subtitle={`${budget?.daysLeft ?? 0} days left`}
                        />
                        <BudgetMetricCard
                            title="Spent"
                            value={formatCurrency(budget?.spent ?? 0, budget?.currency)}
                            subtitle={`${spentPercent.toFixed(0)}% used`}
                        />
                        <BudgetMetricCard
                            title="Budget"
                            value={formatCurrency(budget?.budget ?? 0, budget?.currency)}
                        />
                    </div>
                    <div className="flex flex-col gap-4">
                        <BudgetSpendingTrend values={budget?.trend ?? []} />
                        <BudgetProgress percent={spentPercent} />
                    </div>
                </div>
            </section>


            <section className="grid grid-cols-1 lg:grid-cols-2 gap-4 pb-2">
                <BudgetRecentActivity
                    items={budget?.recentActivity}
                    currency={budget?.currency}
                />
                <BudgetRecentActivity empty />
            </section>
        </div>
    );
};
