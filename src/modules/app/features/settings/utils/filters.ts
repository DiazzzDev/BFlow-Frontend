import type { CategoryType } from "@/modules/app/interfaces/Category";

export type CategoryTypeFilter = CategoryType;

export const CATEGORY_TYPE_TABS: Array<{
    id: CategoryTypeFilter;
    label: string;
}> = [
    { id: "EXPENSE", label: "Gastos" },
    { id: "INCOME", label: "Ingresos" },
];
