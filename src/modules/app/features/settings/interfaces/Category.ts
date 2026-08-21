export type CategoryType = "INCOME" | "EXPENSE";

export interface Category {
    id: string;
    name: string;
    type: CategoryType;
    icon: string;
    color: string;
}

export interface CreateCategoryData {
    name: string;
    type: CategoryType;
    icon: string;
    color: string;
}
