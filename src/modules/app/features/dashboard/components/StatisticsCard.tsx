import {
    Line,
    LineChart,
    ResponsiveContainer,
    Tooltip,
    XAxis,
} from "recharts";

import type { MonthlyStatistic } from "../interfaces/Dashboard";

interface StatisticsCardProps {
    isLoading: boolean;
    months: MonthlyStatistic[];
}

const CustomTooltip = ({
    active,
    payload,
    label,
}: {
    active?: boolean;
    payload?: { value: number; name: string; color: string }[];
    label?: string;
}) => {
    if (!active || !payload?.length) {
        return null;
    }

    return (
        <div className="rounded-md border border-light-10 bg-surface-hard px-3 py-2 shadow-custom">
            <p className="text-xs font-medium text-helper">{label}</p>
            {payload.map((entry) => (
                <p key={entry.name} className="text-sm font-semibold" style={{ color: entry.color }}>
                    {entry.name}: ${entry.value.toLocaleString()}
                </p>
            ))}
        </div>
    );
};

export const StatisticsCard = ({ isLoading, months }: StatisticsCardProps) => {
    return (
        <div className="flex flex-col rounded-lg border border-light-10 bg-surface p-5">
            <div className="flex items-center justify-between">
                <p className="text-sm font-medium text-helper">Statistics</p>

                <div className="flex items-center gap-4">
                    <div className="flex items-center gap-1.5">
                        <span className="h-1.5 w-1.5 rounded-full bg-info" />
                        <span className="text-xs text-helper">Total income</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                        <span className="h-1.5 w-1.5 rounded-full bg-primary" />
                        <span className="text-xs text-helper">Total expenses</span>
                    </div>
                </div>
            </div>

            <div className="mt-4 h-64 w-full">
                {isLoading ? (
                    <div className="h-full w-full animate-pulse rounded-md bg-skeleton" />
                ) : (
                    <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={months}>
                            <XAxis
                                dataKey="month"
                                stroke="var(--color-helper)"
                                fontSize={12}
                                tickLine={false}
                                axisLine={false}
                            />
                            <Tooltip content={<CustomTooltip />} />
                            <Line
                                type="monotone"
                                dataKey="income"
                                name="Total income"
                                stroke="var(--color-info)"
                                strokeWidth={2}
                                dot={false}
                            />
                            <Line
                                type="monotone"
                                dataKey="expense"
                                name="Total expenses"
                                stroke="var(--color-primary)"
                                strokeWidth={2}
                                dot={false}
                            />
                        </LineChart>
                    </ResponsiveContainer>
                )}
            </div>
        </div>
    );
};