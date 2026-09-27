import type { DashboardActivityBreakdown } from "../interfaces/dashboard";

export const ACTIVITY_BREAKDOWN_SEGMENTS: Array<{
    key: keyof Pick<
        DashboardActivityBreakdown,
        "incomePercentage" | "expensePercentage" | "transferPercentage"
    >;
    keyLabel: "income" | "expenses" | "transfers";
    colorClass: string;
}> = [
    { key: "incomePercentage", keyLabel: "income", colorClass: "bg-info" },
    { key: "expensePercentage", keyLabel: "expenses", colorClass: "bg-primary" },
    {
        key: "transferPercentage",
        keyLabel: "transfers",
        colorClass: "bg-success",
    },
];
