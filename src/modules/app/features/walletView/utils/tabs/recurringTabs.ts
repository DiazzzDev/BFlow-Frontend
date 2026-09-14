import type { CategoryType } from "@/modules/app/interfaces/Category";
import type { Periodicity } from "@/modules/app/interfaces/Periodicity";

export const RECURRING_TYPE_TABS: Array<{ id: CategoryType; label: string }> = [
    { id: "INCOME", label: "Ingreso" },
    { id: "EXPENSE", label: "Gasto" },
];

export const RECURRING_INTERVAL_UNIT_LABELS: Record<Periodicity, string> = {
    DAILY: "días",
    WEEKLY: "semanas",
    MONTHLY: "meses",
    YEARLY: "años",
};
