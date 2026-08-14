import {
    Line,
    LineChart,
    ResponsiveContainer,
    Tooltip,
    XAxis,
    YAxis,
} from "recharts";

import type { MonthlyStatistic } from "../interfaces/dashboard";
import { dashboardCardClass } from "../utils/dashboardCard";

interface StatisticsCardProps {
    isLoading: boolean;
    months: MonthlyStatistic[];
}

const formatAxisMoney = (value: number) =>
    new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD",
        notation: "compact",
        maximumFractionDigits: 1,
    }).format(value);

const CustomTooltip = ({
    active,
    payload,
}: {
    active?: boolean;
    payload?: { value: number; name: string; color: string }[];
    label?: string;
}) => {
    if (!active || !payload?.length) {
        return null;
    }

    return (
        <div className="flex flex-col gap-1.5">
            {payload.map((entry) => (
                <div
                    key={entry.name}
                    className="rounded-lg border border-light-10 bg-surface-hard px-2.5 py-1.5 shadow-custom"
                >
                    <p
                        className="text-sm font-semibold tabular-nums text-light"
                        style={{ color: entry.color }}
                    >
                        $
                        {entry.value.toLocaleString(undefined, {
                            minimumFractionDigits: 2,
                            maximumFractionDigits: 2,
                        })}
                    </p>
                </div>
            ))}
        </div>
    );
};

export const StatisticsCard = ({ isLoading, months }: StatisticsCardProps) => {
    return (
        <div className={dashboardCardClass}>
            <div className="flex items-start justify-between gap-3">
                <div>
                    <p className="text-sm font-medium text-helper">Statistics</p>

                    <div className="mt-2 flex flex-wrap items-center gap-4">
                        <div className="flex items-center gap-1.5">
                            <span className="h-2 w-2 rounded-full bg-info" />
                            <span className="text-xs text-helper">Total income</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                            <span className="h-2 w-2 rounded-full bg-primary" />
                            <span className="text-xs text-helper">Total expenses</span>
                        </div>
                    </div>
                </div>

                {/* Reserved for upcoming filters */}
                <div className="min-h-8 min-w-0 shrink-0" aria-hidden />
            </div>

            <div className="mt-4 h-64 w-full">
                {isLoading ? (
                    <div className="h-full w-full animate-pulse rounded-xl bg-skeleton" />
                ) : (
                    <ResponsiveContainer width="100%" height="100%">
                        <LineChart
                            data={months}
                            margin={{ top: 8, right: 12, left: 4, bottom: 0 }}
                        >
                            <XAxis
                                dataKey="month"
                                stroke="var(--color-helper)"
                                fontSize={12}
                                tickLine={false}
                                axisLine={false}
                            />
                            <YAxis
                                stroke="var(--color-helper)"
                                fontSize={12}
                                tickLine={false}
                                axisLine={false}
                                width={52}
                                tickFormatter={formatAxisMoney}
                            />
                            <Tooltip
                                content={<CustomTooltip />}
                                cursor={{
                                    stroke: "var(--color-helper)",
                                    strokeDasharray: "4 4",
                                    strokeWidth: 1,
                                }}
                            />
                            <Line
                                type="monotone"
                                dataKey="income"
                                name="Total income"
                                stroke="var(--color-info)"
                                strokeWidth={2.5}
                                dot={false}
                                activeDot={{ r: 5 }}
                            />
                            <Line
                                type="monotone"
                                dataKey="expense"
                                name="Total expenses"
                                stroke="var(--color-primary)"
                                strokeWidth={2.5}
                                dot={false}
                                activeDot={{ r: 5 }}
                            />
                        </LineChart>
                    </ResponsiveContainer>
                )}
            </div>
        </div>
    );
};
