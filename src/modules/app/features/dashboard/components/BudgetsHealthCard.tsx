import { CreditCard } from "lucide-react";

import type { BudgetHealth, BudgetHealthStatus } from "../interfaces/dashboard";

import { formatterDynamicDate } from "@/utils/formatters/formatDynamicDate";


import { Button } from "@/components/controls/Button";
import { CustomEmptyState } from "@/components/custom/CustomEmptyState";

// TODO: confirmar el resto de los valores de status que puede mandar el backend.
// Cualquiera no listado cae en el estilo "neutral" por defecto.
const STATUS_STYLES: Record<string, string> = {
    OK: "bg-success-sweet text-success",
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
    return (
        <div className="flex flex-col rounded-lg border border-light-10 bg-surface p-5">
            <p className="text-sm font-medium text-helper">Budgets health</p>

            <div className="mt-3 flex flex-1 flex-col gap-2">
                {isLoading &&
                    Array.from({ length: 2 }).map((_, index) => (
                        <div
                            key={index}
                            className="h-12 w-full animate-pulse rounded-md bg-skeleton"
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
                            className="flex cursor-pointer items-center justify-between gap-3 rounded-md px-1 py-1.5 text-left transition-colors hover:bg-light-5"
                        >
                            <div className="min-w-0">
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
                        </button>
                    ))}
            </div>

            <Button
                type="button"
                onClick={onReviewBudgets}
                text="Review budgets"
                className="mt-3 w-full"
            />
        </div>
    );
};