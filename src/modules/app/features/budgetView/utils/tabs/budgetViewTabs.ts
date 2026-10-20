export type BudgetViewTab = "overview" | "settings";

export const BUDGET_VIEW_TABS: Array<{ id: BudgetViewTab; label: string }> = [
    { id: "overview", label: "Resumen" },
    { id: "settings", label: "Ajustes" },
];

export const isBudgetViewTab = (value: string | null): value is BudgetViewTab =>
    !!value && BUDGET_VIEW_TABS.some((tab) => tab.id === value);
