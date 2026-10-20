import type { CategoryType } from "@/modules/app/interfaces/Category";

export type CategoryTypeFilter = "ALL" | CategoryType;

export const CATEGORY_TYPE_TABS: Array<{
    id: CategoryTypeFilter;
    label: string;
}> = [
    { id: "ALL", label: "Todas" },
    { id: "EXPENSE", label: "Gastos" },
    { id: "INCOME", label: "Ingresos" },
];
