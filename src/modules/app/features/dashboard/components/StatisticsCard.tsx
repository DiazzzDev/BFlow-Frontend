import { useState } from "react";
import { TrendingUp } from "lucide-react";
import { useTranslation } from "react-i18next";
import {
    Area,
    AreaChart,
    CartesianGrid,
    ResponsiveContainer,
    Tooltip,
    XAxis,
    YAxis,
} from "recharts";

import type { MonthlyStatistic } from "../interfaces/dashboard";
import {
    dashboardCardClass,
    dashboardLabelClass,
} from "../utils/dashboardCard";
import { formatAxisMoney } from "../utils/formatAxisMoney";

import { Select } from "@/components/controls/Select";
import { CustomEmptyState } from "@/components/custom/CustomEmptyState";
import { formatCurrency } from "@/utils/formatters/formatCurrency";

type FocusedSeries = "all" | "income" | "expense";

interface StatisticsCardProps {
    isLoading: boolean;
    months: MonthlyStatistic[];
    currency?: string;
}

interface TooltipEntry {
    value: number;
    name: string;
    color: string;
    dataKey?: string | number;
}

const StatisticsTooltip = ({
    active,
    payload,
    label,
    currency,
}: {
    active?: boolean;
    payload?: TooltipEntry[];
    label?: string;
    currency: string;
}) => {
    if (!active || !payload?.length) {
        return null;
    }

    return (
        <div className="min-w-40 rounded-xl border border-light-10 bg-surface-hard px-3 py-2.5 shadow-custom">
            <p className="mb-2 text-xs font-medium text-helper">{label}</p>
            <div className="flex flex-col gap-1.5">
                {payload.map((entry) => (
                    <div
                        key={String(entry.dataKey ?? entry.name)}
                        className="flex items-center justify-between gap-4"
                    >
                        <span className="flex min-w-0 items-center gap-1.5 text-xs text-helper">
                            <span
                                className="h-2 w-2 shrink-0 rounded-full"
                                style={{ backgroundColor: entry.color }}
                            />
                            <span className="truncate">{entry.name}</span>
                        </span>
                        <span className="shrink-0 text-sm font-semibold tabular-nums text-light">
                            {formatCurrency(entry.value, currency)}
                        </span>
                    </div>
                ))}
            </div>
        </div>
    );
};

export const StatisticsCard = ({
    isLoading,
    months,
    currency = "USD",
}: StatisticsCardProps) => {
    const { t } = useTranslation();
    const [focused, setFocused] = useState<FocusedSeries>("all");

    const showIncome = focused === "all" || focused === "income";
    const showExpense = focused === "all" || focused === "expense";

    const incomeLabel = t("dashboard.income");
    const expenseLabel = t("dashboard.expenses");

    const toggleSeries = (series: "income" | "expense") => {
        setFocused((current) => (current === series ? "all" : series));
    };

    return (
        <div className={dashboardCardClass}>
            <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                <p className={dashboardLabelClass}>{t("dashboard.statistics")}</p>

                {/* Design-only period filter — not wired to data yet */}
                <Select
                    id="statisticsPeriod"
                    defaultValue="month"
                    aria-label={t("dashboard.statisticsPeriod")}
                    className="w-auto min-w-36 py-1.5!"
                >
                    <option value="month">
                        {t("dashboard.statisticsPeriodMonth")}
                    </option>
                    <option value="week">
                        {t("dashboard.statisticsPeriodWeek")}
                    </option>
                    <option value="year">
                        {t("dashboard.statisticsPeriodYear")}
                    </option>
                </Select>
            </div>

            {!isLoading && months.length > 0 ? (
                <div className="mt-3 flex flex-wrap items-center gap-4">
                    <button
                        type="button"
                        onClick={() => toggleSeries("expense")}
                        className={`flex cursor-pointer items-center gap-1.5 text-xs transition-opacity ${
                            showExpense
                                ? "text-helper opacity-100"
                                : "text-helper opacity-35"
                        }`}
                    >
                        <span className="h-2 w-2 rounded-full bg-primary" />
                        {expenseLabel}
                    </button>
                    <button
                        type="button"
                        onClick={() => toggleSeries("income")}
                        className={`flex cursor-pointer items-center gap-1.5 text-xs transition-opacity ${
                            showIncome
                                ? "text-helper opacity-100"
                                : "text-helper opacity-35"
                        }`}
                    >
                        <span className="h-2 w-2 rounded-full bg-info" />
                        {incomeLabel}
                    </button>
                </div>
            ) : null}

            <div className="mt-4 flex h-64 w-full items-center">
                {isLoading ? (
                    <div className="h-full w-full animate-pulse rounded-xl bg-skeleton" />
                ) : months.length === 0 ? (
                    <CustomEmptyState
                        title={t("dashboard.noStatistics")}
                        description={t("dashboard.statisticsHint")}
                        Icon={TrendingUp}
                        className="m-0!"
                    />
                ) : (
                    <ResponsiveContainer width="100%" height="100%">
                        <AreaChart
                            data={months}
                            margin={{ top: 12, right: 8, left: 0, bottom: 0 }}
                        >
                            <defs>
                                <linearGradient
                                    id="statisticsIncomeFill"
                                    x1="0"
                                    y1="0"
                                    x2="0"
                                    y2="1"
                                >
                                    <stop
                                        offset="0%"
                                        stopColor="var(--color-info)"
                                        stopOpacity={0.28}
                                    />
                                    <stop
                                        offset="100%"
                                        stopColor="var(--color-info)"
                                        stopOpacity={0}
                                    />
                                </linearGradient>
                                <linearGradient
                                    id="statisticsExpenseFill"
                                    x1="0"
                                    y1="0"
                                    x2="0"
                                    y2="1"
                                >
                                    <stop
                                        offset="0%"
                                        stopColor="var(--color-primary)"
                                        stopOpacity={0.28}
                                    />
                                    <stop
                                        offset="100%"
                                        stopColor="var(--color-primary)"
                                        stopOpacity={0}
                                    />
                                </linearGradient>
                            </defs>
                            <CartesianGrid
                                stroke="var(--color-light-10)"
                                vertical={false}
                                strokeDasharray="4 6"
                            />
                            <XAxis
                                dataKey="month"
                                stroke="var(--color-helper)"
                                fontSize={12}
                                tickLine={false}
                                axisLine={false}
                                dy={6}
                            />
                            <YAxis
                                stroke="var(--color-helper)"
                                fontSize={12}
                                tickLine={false}
                                axisLine={false}
                                width={52}
                                tickFormatter={(value: number) =>
                                    formatAxisMoney(value, currency)
                                }
                            />
                            <Tooltip
                                content={
                                    <StatisticsTooltip currency={currency} />
                                }
                                cursor={{
                                    stroke: "var(--color-helper)",
                                    strokeDasharray: "4 4",
                                    strokeWidth: 1,
                                }}
                            />
                            {showExpense ? (
                                <Area
                                    type="monotone"
                                    dataKey="expense"
                                    name={expenseLabel}
                                    stroke="var(--color-primary)"
                                    strokeWidth={2.5}
                                    fill="url(#statisticsExpenseFill)"
                                    dot={false}
                                    activeDot={{
                                        r: 5,
                                        onClick: () => toggleSeries("expense"),
                                    }}
                                    style={{ cursor: "pointer" }}
                                    onClick={() => toggleSeries("expense")}
                                />
                            ) : null}
                            {showIncome ? (
                                <Area
                                    type="monotone"
                                    dataKey="income"
                                    name={incomeLabel}
                                    stroke="var(--color-info)"
                                    strokeWidth={2.5}
                                    fill="url(#statisticsIncomeFill)"
                                    dot={false}
                                    activeDot={{
                                        r: 5,
                                        onClick: () => toggleSeries("income"),
                                    }}
                                    style={{ cursor: "pointer" }}
                                    onClick={() => toggleSeries("income")}
                                />
                            ) : null}
                        </AreaChart>
                    </ResponsiveContainer>
                )}
            </div>
        </div>
    );
};
