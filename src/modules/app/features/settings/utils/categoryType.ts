import type { CategoryType } from "../interfaces/Category";

export const CATEGORY_TYPE_LABELS: Record<CategoryType, string> = {
    INCOME: "Ingreso",
    EXPENSE: "Gasto",
};

export const CATEGORY_TYPE_FORM_OPTIONS: Array<{
    value: CategoryType;
    label: string;
}> = [
    { value: "EXPENSE", label: CATEGORY_TYPE_LABELS.EXPENSE },
    { value: "INCOME", label: CATEGORY_TYPE_LABELS.INCOME },
];
