import { TrendingUp } from "lucide-react";
import {
    CartesianGrid,
    Line,
    LineChart,
    ResponsiveContainer,
    Tooltip,
    XAxis,
    YAxis,
} from "recharts";

import type { BudgetSpendingTrendPoint } from "../../budgets/interfaces/Budget";

import { BudgetCardEmpty } from "./BudgetCardEmpty";

interface BudgetSpendingTrendProps {
    points: BudgetSpendingTrendPoint[];
    isLoading?: boolean;
    currency?: string;
    yMax?: number;
}

const formatAxisMoney = (value: number, currency = "USD") =>
    new Intl.NumberFormat("en-US", {
        style: "currency",
        currency,
        notation: "compact",
        maximumFractionDigits: 1,
    }).format(value);

const CustomTooltip = ({
    active,
    payload,
}: {
    active?: boolean;
    payload?: { value: number }[];
}) => {
    if (!active || !payload?.length) {
        return null;
    }

    return (
        <div className="rounded-lg border border-light-10 bg-surface-hard px-2.5 py-1.5 shadow-custom">
            <p className="text-sm font-semibold tabular-nums text-light">
                $
                {payload[0].value.toLocaleString(undefined, {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                })}
            </p>
        </div>
    );
};

export const BudgetSpendingTrend = ({
    points,
    isLoading = false,
    currency = "USD",
    yMax = 0,
}: BudgetSpendingTrendProps) => {
    const data = points.map((point, index) => ({
        day: point.dayIndex > 0 ? point.dayIndex : index + 1,
        amount: point.cumulativeAmount,
    }));
    const isEmpty = data.length === 0 || data.every((point) => point.amount === 0);
    const dataMax = Math.max(...data.map((point) => point.amount), 0);
    const domainMax = Math.max(dataMax, yMax, 1);

    return (
        <article className="flex h-full min-h-80 flex-col rounded-2xl border border-light-10 bg-surface p-6 shadow-custom">
            <p className="mb-4 text-base font-semibold text-light">Spending Trend</p>

            <div className="flex min-h-0 flex-1 items-center">
                {isLoading ? (
                    <div className="h-full min-h-52 w-full animate-pulse rounded-xl bg-skeleton" />
                ) : isEmpty ? (
                    <BudgetCardEmpty
                        Icon={TrendingUp}
                        title="Sin tendencia"
                        description="Todavía no hay gasto en este periodo."
                    />
                ) : (
                    <div className="h-full min-h-64 w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <LineChart
                                data={data}
                                margin={{ top: 8, right: 12, left: 4, bottom: 0 }}
                            >
                                <CartesianGrid
                                    stroke="var(--color-light-10)"
                                    vertical={false}
                                />
                                <XAxis
                                    dataKey="day"
                                    stroke="var(--color-helper)"
                                    fontSize={12}
                                    tickLine={false}
                                    axisLine={false}
                                />
                                <YAxis
                                    domain={[0, domainMax]}
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
                                    content={<CustomTooltip />}
                                    cursor={{
                                        stroke: "var(--color-helper)",
                                        strokeDasharray: "4 4",
                                        strokeWidth: 1,
                                    }}
                                />
                                <Line
                                    type="monotone"
                                    dataKey="amount"
                                    stroke="var(--color-info)"
                                    strokeWidth={2.5}
                                    dot={false}
                                    activeDot={{ r: 5 }}
                                />
                            </LineChart>
                        </ResponsiveContainer>
                    </div>
                )}
            </div>
        </article>
    );
};
