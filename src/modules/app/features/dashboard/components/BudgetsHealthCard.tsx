import { ChevronRight, CreditCard } from "lucide-react";
import { useNavigate } from "react-router";

import type { BudgetHealth, BudgetHealthStatus } from "../interfaces/dashboard";
import { dashboardCardClass } from "../utils/dashboardCard";

import { formatterDynamicDate } from "@/utils/formatters/formatDynamicDate";
import { Button } from "@/components/controls/Button";
import { CustomEmptyState } from "@/components/custom/CustomEmptyState";

const STATUS_STYLES: Record<string, string> = {
    OK: "bg-info-25 text-info",
    WARNING: "bg-warning-sweet text-warning",
    AT_RISK: "bg-danger-sweet text-danger",
};

const STATUS_LABELS: Record<string, string> = {
    OK: "Healthy",
    WARNING: "Warning",
    AT_RISK: "At risk",
};

const getStatusStyle = (status: BudgetHealthStatus) =>
    STATUS_STYLES[status] ?? "bg-light-10 text-helper";

const getStatusLabel = (status: BudgetHealthStatus) =>
    STATUS_LABELS[status] ?? status;

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
        <div className={`${dashboardCardClass} h-full`}>
            <p className="text-sm font-medium text-helper">Budgets health</p>

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
                        title="Sin presupuestos"
                        description="Creá un presupuesto para ver su salud acá."
                        Icon={CreditCard}
                        className="m-0! py-2!"
                    />
                )}

                {!isLoading &&
                    budgets.map((budget) => (
                        <button
                            key={budget.id}
                            type="button"
                            onClick={() => handleBudgetClick(budget.id)}
                            className="flex cursor-pointer items-center gap-3 rounded-xl px-1 py-1.5 text-left transition-colors hover:bg-light-5"
                        >
                            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-light-5 text-helper">
                                <CreditCard className="h-4 w-4" />
                            </div>

                            <div className="min-w-0 flex-1">
                                <p className="truncate text-sm font-medium text-light">
                                    {budget.displayName}
                                </p>
                                <p className="truncate text-xs text-helper">
                                    Updated {formatterDynamicDate(budget.updatedAt)}
                                </p>
                            </div>

                            <span
                                className={`shrink-0 rounded-full px-2.5 py-1 text-xs font-medium ${getStatusStyle(budget.status)}`}
                            >
                                {getStatusLabel(budget.status)}
                            </span>

                            <ChevronRight className="h-4 w-4 shrink-0 text-helper" />
                        </button>
                    ))}
            </div>

            <Button
                type="button"
                onClick={handleReview}
                text="Review budgets"
                className="mt-4 w-full"
            />
        </div>
    );
};
