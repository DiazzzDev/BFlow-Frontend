import { TrendingUp } from "lucide-react";
import {
    Line,
    LineChart,
    ResponsiveContainer,
    Tooltip,
    XAxis,
    YAxis,
} from "recharts";

import type { MonthlyStatistic } from "../interfaces/dashboard";
import { dashboardCardClass, dashboardLabelClass } from "../utils/dashboardCard";

import { CustomEmptyState } from "@/components/custom/CustomEmptyState";

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
                    <p className={dashboardLabelClass}>Estadísticas</p>

                    <div className="mt-2 flex flex-wrap items-center gap-4">
                        <div className="flex items-center gap-1.5">
                            <span className="h-1.5 w-1.5 rounded-full bg-info" />
                            <span className="text-xs text-helper">Ingresos totales</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                            <span className="h-1.5 w-1.5 rounded-full bg-primary" />
                            <span className="text-xs text-helper">Gastos totales</span>
                        </div>
                    </div>
                </div>

                {/* Reserved for upcoming filters */}
                <div className="min-h-8 min-w-0 shrink-0" aria-hidden />
            </div>

            <div className="mt-4 flex h-64 w-full items-center">
                {isLoading ? (
                    <div className="h-full w-full animate-pulse rounded-xl bg-skeleton" />
                ) : months.length === 0 ? (
                    <CustomEmptyState
                        title="Sin estadísticas"
                        description="Cuando tengas movimientos, verás ingresos y gastos aquí."
                        Icon={TrendingUp}
                        className="m-0!"
                    />
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
                                name="Ingresos totales"
                                stroke="var(--color-info)"
                                strokeWidth={2.5}
                                dot={false}
                                activeDot={{ r: 5 }}
                            />
                            <Line
                                type="monotone"
                                dataKey="expense"
                                name="Gastos totales"
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
