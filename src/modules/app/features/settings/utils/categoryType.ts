import type { CategoryType } from "../interfaces/Category";

export const categoryTypeLabels: Record<CategoryType, string> = {
    INCOME: "Ingreso",
    EXPENSE: "Gasto",
};

export const categoryTypeFormOptions: Array<{
    value: CategoryType;
    label: string;
}> = [
    { value: "EXPENSE", label: categoryTypeLabels.EXPENSE },
    { value: "INCOME", label: categoryTypeLabels.INCOME },
];
