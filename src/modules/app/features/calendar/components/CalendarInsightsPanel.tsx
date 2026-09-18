import { getBudgetBarColor } from "../utils/budgetWeekBars";
import type { EnrichedBudget } from "../interfaces/Calendar";

import { SkeletonText } from "@/components/loaders/SkeletonText";
import { formatCurrency } from "@/utils/formatters/formatCurrency";
import { getBudgetDisplayName } from "@/modules/app/features/budgets/utils/budgetStatus";

interface CalendarInsightsPanelProps {
    income: number;
    expense: number;
    net: number;
    upcomingRecurringCount: number;
    budgets: EnrichedBudget[];
    onSelectBudget: (budgetId: string) => void;
    isLoading: boolean;
    currency?: string;
}

/** Content-sized, not a second dashboard: a quiet reference to what the
 * calendar is already showing, plus the legend that gives the grid's
 * budget interval bars their meaning. */
export const CalendarInsightsPanel = ({
    income,
    expense,
    net,
    upcomingRecurringCount,
    budgets,
    onSelectBudget,
    isLoading,
    currency = "USD",
}: CalendarInsightsPanelProps) => {
    return (
        <div className="flex flex-col gap-5">
            <div className="rounded-2xl border border-light-10 bg-surface p-4 shadow-custom">
                <p className="mb-3 text-xs font-medium uppercase tracking-wide text-helper">
                    Resumen del mes
                </p>
                <div className="flex flex-col gap-2.5">
                    <StatRow label="Ingresos" isLoading={isLoading} valueClassName="text-info">
                        {formatCurrency(income, currency)}
                    </StatRow>
                    <StatRow label="Gastos" isLoading={isLoading} valueClassName="text-danger">
                        {formatCurrency(expense, currency)}
                    </StatRow>
                    <StatRow
                        label="Neto"
                        isLoading={isLoading}
                        valueClassName={net >= 0 ? "text-info" : "text-danger"}
                    >
                        {formatCurrency(net, currency)}
                    </StatRow>
                    <StatRow label="Próximas recurrencias" isLoading={isLoading}>
                        {upcomingRecurringCount}
                    </StatRow>
                </div>
            </div>

            {budgets.length > 0 && (
                <div className="rounded-2xl border border-light-10 bg-surface p-4 shadow-custom">
                    <p className="mb-3 text-xs font-medium uppercase tracking-wide text-helper">
                        Presupuestos activos
                    </p>
                    <div className="flex flex-col gap-1">
                        {budgets.map((budget, index) => (
                            <button
                                key={budget.id}
                                type="button"
                                onClick={() => onSelectBudget(budget.id)}
                                className="flex cursor-pointer items-center gap-2.5 rounded-lg px-1.5 py-2 text-left transition-colors hover:bg-light-5"
                            >
                                <span
                                    className="h-2 w-2 shrink-0 rounded-full"
                                    style={{ backgroundColor: getBudgetBarColor(index) }}
                                />
                                <span className="min-w-0 flex-1">
                                    <span className="block truncate text-sm text-light">
                                        {getBudgetDisplayName(budget)}
                                    </span>
                                    <span className="block text-[11px] text-helper">
                                        {budget.startDate.slice(0, 10)} → {budget.periodEndDate}
                                    </span>
                                </span>
                            </button>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};

const StatRow = ({
    label,
    children,
    isLoading,
    valueClassName = "text-light",
}: {
    label: string;
    children: React.ReactNode;
    isLoading: boolean;
    valueClassName?: string;
}) => (
    <div className="flex items-center justify-between gap-3">
        <span className="text-xs text-helper">{label}</span>
        {isLoading ? (
            <SkeletonText className="h-3.5 w-14" />
        ) : (
            <span className={`text-sm font-medium tabular-nums ${valueClassName}`}>{children}</span>
        )}
    </div>
);
