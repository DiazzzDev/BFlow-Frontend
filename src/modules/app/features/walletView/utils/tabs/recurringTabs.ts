import type { RecurringFrequency, RecurringType } from "../../interfaces/Recurring";

export const RECURRING_TYPE_TABS: Array<{ id: RecurringType; label: string }> = [
    { id: "INCOME", label: "Ingreso" },
    { id: "EXPENSE", label: "Gasto" },
];

export const RECURRING_FREQUENCY_OPTIONS: Array<{
    value: RecurringFrequency;
    label: string;
}> = [
    { value: "DAILY", label: "Diario" },
    { value: "WEEKLY", label: "Semanal" },
    { value: "MONTHLY", label: "Mensual" },
    { value: "YEARLY", label: "Anual" },
];

export const RECURRING_INTERVAL_UNIT_LABELS: Record<
    RecurringFrequency,
    string
> = {
    DAILY: "días",
    WEEKLY: "semanas",
    MONTHLY: "meses",
    YEARLY: "años",
};
