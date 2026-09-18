import type { DashboardActivityBreakdown } from "../interfaces/dashboard";
import { useTranslation } from "react-i18next";
import { dashboardCardClass, dashboardHeroClass, dashboardLabelClass } from "../utils/dashboardCard";
import { formatPercentValue } from "../utils/formatPercent";

import { SegmentedBar } from "./SegmentedBar";

interface ThisMonthCardProps {
    isLoading: boolean;
    breakdown: DashboardActivityBreakdown | undefined;
}

const ACTIVITY_SEGMENTS: Array<{
    key: keyof Pick<
        DashboardActivityBreakdown,
        "incomePercentage" | "expensePercentage" | "transferPercentage"
    >;
    keyLabel: "income" | "expenses" | "transfers";
    colorClass: string;
}> = [
    { key: "incomePercentage", keyLabel: "income", colorClass: "bg-info" },
    { key: "expensePercentage", keyLabel: "expenses", colorClass: "bg-primary" },
    { key: "transferPercentage", keyLabel: "transfers", colorClass: "bg-success" },
];

export const ThisMonthCard = ({ isLoading, breakdown }: ThisMonthCardProps) => {
    const { t } = useTranslation();
    const activityPercent = formatPercentValue(breakdown?.activityChangePercentage ?? 0);
    const segments = ACTIVITY_SEGMENTS.map((segment) => ({
        label: t(`dashboard.${segment.keyLabel}`),
        percent: breakdown?.[segment.key] ?? 0,
        colorClass: segment.colorClass,
    }));

    return (
        <div className={dashboardCardClass}>
            <p className={dashboardLabelClass}>{t("dashboard.thisMonth")}</p>

            <div className="mt-3 flex items-center gap-2.5">
                {isLoading ? (
                    <div className="h-10 w-20 animate-pulse rounded-lg bg-skeleton" />
                ) : (
                    <p className={dashboardHeroClass}>{activityPercent}%</p>
                )}
                <span className="max-w-16 text-xs leading-tight text-helper">
                    {t("dashboard.totalActivity")}
                </span>
            </div>

            {isLoading ? (
                <div className="mt-5 h-2 w-full animate-pulse rounded-full bg-skeleton" />
            ) : (
                <SegmentedBar segments={segments} showSegmentLabels />
            )}
        </div>
    );
};
