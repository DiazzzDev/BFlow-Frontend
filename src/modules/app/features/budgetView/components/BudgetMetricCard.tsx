import { SkeletonText } from "@/components/loaders/SkeletonText";
import { formatCurrency } from "@/utils/formatters/formatCurrency";

interface BudgetMetricCardProps {
    title: string;
    amount: number;
    currency?: string;
    subtitle?: string;
    isLoading?: boolean;
}

export const BudgetMetricCard = ({
    title,
    amount,
    currency = "USD",
    subtitle,
    isLoading = false,
}: BudgetMetricCardProps) => {
    const formatted = formatCurrency(amount, currency);
    const decimalIndex = formatted.lastIndexOf(".");
    const whole = decimalIndex === -1 ? formatted : formatted.slice(0, decimalIndex);
    const cents = decimalIndex === -1 ? "" : formatted.slice(decimalIndex);

    return (
        <article className="flex min-w-0 flex-col rounded-2xl border border-light-10 bg-surface p-6 shadow-custom">
            <p className="text-base font-semibold text-light">{title}</p>
            {isLoading ? (
                <SkeletonText className="mt-3 h-9 w-36" />
            ) : (
                <p className="mt-1.5 text-3xl font-semibold tracking-tight text-light">
                    {whole}
                    {cents ? (
                        <span className="font-medium text-light-75">{cents}</span>
                    ) : null}
                </p>
            )}
            {isLoading ? (
                <SkeletonText className="mt-2 h-4 w-28" />
            ) : subtitle ? (
                <p className="mt-2 text-sm text-helper">{subtitle}</p>
            ) : null}
        </article>
    );
};
