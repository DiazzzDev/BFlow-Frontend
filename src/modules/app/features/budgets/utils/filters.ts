import type { BudgetPeriod, BudgetScope } from "../interfaces/Budget";

export const BUDGET_PERIOD_TABS: Array<{ label: string; value: string }> = [
    { label: "Todos", value: "ALL" },
    { label: "Mensual", value: "MONTHLY" },
    { label: "Semanal", value: "WEEKLY" },
    { label: "Anual", value: "YEARLY" },
];

export const BUDGET_SCOPE_TABS: Array<{ id: BudgetScope; label: string }> = [
    { id: "WALLET", label: "Billetera" },
    { id: "CATEGORY_GLOBAL", label: "Categoría" },
    { id: "WALLET_CATEGORY", label: "Billetera + categoría" },
];

export const BUDGET_SORT_OPTIONS: Array<{ label: string; value: string }> = [
    { value: "amount,desc", label: "Mayor monto" },
    { value: "amount,asc", label: "Menor monto" },
    { value: "updatedAt,desc", label: "Más recientes" },
    { value: "startDate,desc", label: "Inicio reciente" },
];

export const BUDGET_PERIOD_FORM_OPTIONS: Array<{
    value: BudgetPeriod;
    label: string;
}> = [
    { value: "MONTHLY", label: "Mensual" },
    { value: "WEEKLY", label: "Semanal" },
    { value: "YEARLY", label: "Anual" },
    { value: "DAILY", label: "Diario" },
];
