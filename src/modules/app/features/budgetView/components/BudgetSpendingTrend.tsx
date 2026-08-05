interface BudgetSpendingTrendProps {
    values: number[];
}

export const BudgetSpendingTrend = ({ values }: BudgetSpendingTrendProps) => {
    const width = 520;
    const height = 220;
    const paddingX = 28;
    const paddingY = 20;
    const series = values.length > 0 ? values : [0];

    const maxValue = Math.max(...series, 1);
    const minValue = Math.min(...series, 0);
    const range = Math.max(maxValue - minValue, 1);

    const points = series.map((value, index) => {
        const x =
            paddingX
            + (index / Math.max(series.length - 1, 1)) * (width - paddingX * 2);
        const y =
            height
            - paddingY
            - ((value - minValue) / range) * (height - paddingY * 2);
        return `${x},${y}`;
    });

    const yTicks = [60, 50, 40, 30, 20, 10];
    const xTicks = [1, 5, 10, 15, 20];

    return (
        <article className="rounded-2xl border border-light-10 bg-surface px-5 py-4 h-full min-h-64 flex flex-col">
            <p className="text-sm font-medium text-light mb-4">Spending Trend</p>

            <div className="flex-1 min-h-0">
                <svg
                    viewBox={`0 0 ${width} ${height}`}
                    className="w-full h-full text-info"
                    role="img"
                    aria-label="Spending trend chart"
                >
                    {yTicks.map((tick) => {
                        const y =
                            height
                            - paddingY
                            - ((tick - minValue) / range) * (height - paddingY * 2);
                        return (
                            <g key={tick}>
                                <line
                                    x1={paddingX}
                                    y1={y}
                                    x2={width - paddingX}
                                    y2={y}
                                    className="stroke-light-10"
                                    strokeWidth="1"
                                />
                                <text
                                    x={paddingX - 8}
                                    y={y + 4}
                                    textAnchor="end"
                                    className="fill-helper text-[10px]"
                                >
                                    {tick}
                                </text>
                            </g>
                        );
                    })}

                    <polyline
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2.5"
                        strokeLinejoin="round"
                        strokeLinecap="round"
                        points={points.join(" ")}
                    />

                    {xTicks.map((tick) => {
                        const index = Math.min(tick - 1, series.length - 1);
                        const x =
                            paddingX
                            + (index / Math.max(series.length - 1, 1))
                                * (width - paddingX * 2);
                        return (
                            <text
                                key={tick}
                                x={x}
                                y={height - 4}
                                textAnchor="middle"
                                className="fill-helper text-[10px]"
                            >
                                {tick}
                            </text>
                        );
                    })}
                </svg>
            </div>
        </article>
    );
};
