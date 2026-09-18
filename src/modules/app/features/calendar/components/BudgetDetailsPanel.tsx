import { useNavigate } from "react-router";
import { ArrowUpRight } from "lucide-react";

import { useGetBudget } from "@/modules/app/features/budgetView/hooks/useGetBudget";
import {
    BUDGET_SCOPE_LABELS,
    getBudgetDisplayName,
    getBudgetStatusLabel,
} from "@/modules/app/features/budgets/utils/budgetStatus";
import { PERIODICITY_LABELS } from "@/modules/app/interfaces/Periodicity";
import { CustomModal } from "@/components/custom/CustomModal";
import { Button } from "@/components/controls/Button";
import { SkeletonText } from "@/components/loaders/SkeletonText";
import { formatCurrency } from "@/utils/formatters/formatCurrency";
import { formatDateInputValue } from "@/utils/formatters/formatDateInputValue";

interface BudgetDetailsPanelProps {
    budgetId: string | null;
    onClose: () => void;
}

const DetailRow = ({ label, value }: { label: string; value: React.ReactNode }) => (
    <div className="flex items-center justify-between border-b border-light-10 py-2.5 last:border-none">
        <span className="text-sm text-helper">{label}</span>
        <span className="text-sm font-medium text-light">{value}</span>
    </div>
);

export const BudgetDetailsPanel = ({ budgetId, onClose }: BudgetDetailsPanelProps) => {
    const navigate = useNavigate();
    const { budget, isLoading } = useGetBudget(budgetId ?? undefined);

    return (
        <CustomModal
            isModalOpen={Boolean(budgetId)}
            setIsModalOpen={(open) => !open && onClose()}
            title="Presupuesto"
            maxWidth="max-w-md"
        >
            {isLoading || !budget ? (
                <div className="flex flex-col gap-3">
                    <SkeletonText className="h-6 w-40" />
                    <SkeletonText className="h-4 w-full" />
                    <SkeletonText className="h-4 w-full" />
                    <SkeletonText className="h-4 w-full" />
                </div>
            ) : (
                <div className="flex flex-col gap-4">
                    <div className="flex items-start justify-between gap-3">
                        <h3 className="text-base font-semibold text-light">
                            {getBudgetDisplayName(budget)}
                        </h3>
                        <span className="shrink-0 rounded-full bg-success-sweet px-2.5 py-0.5 text-xs font-medium text-success">
                            {getBudgetStatusLabel(budget.status)}
                        </span>
                    </div>

                    <div className="flex flex-col">
                        <DetailRow
                            label="Período"
                            value={`${formatDateInputValue(budget.startDate)} → ${formatDateInputValue(budget.endDate)}`}
                        />
                        <DetailRow label="Frecuencia" value={PERIODICITY_LABELS[budget.period]} />
                        <DetailRow
                            label="Límite"
                            value={formatCurrency(budget.budgetLimit, budget.currency)}
                        />
                        <DetailRow
                            label="Gastado"
                            value={formatCurrency(budget.spent, budget.currency)}
                        />
                        <DetailRow
                            label="Disponible"
                            value={formatCurrency(budget.remaining, budget.currency)}
                        />
                        <DetailRow
                            label="Alcance"
                            value={BUDGET_SCOPE_LABELS[budget.scope] ?? budget.scope}
                        />
                        {budget.walletName ? (
                            <DetailRow label="Billetera" value={budget.walletName} />
                        ) : null}
                        {budget.categoryName ? (
                            <DetailRow label="Categoría" value={budget.categoryName} />
                        ) : null}
                    </div>

                    <Button
                        text="Ver detalle completo"
                        icon={<ArrowUpRight className="h-4 w-4" />}
                        onClick={() => void navigate(`/app/budgets/${budget.id}`)}
                        className="w-full"
                    />
                </div>
            )}
        </CustomModal>
    );
};
