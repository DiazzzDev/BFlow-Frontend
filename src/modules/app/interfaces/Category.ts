export const CATEGORY_TYPE_VALUES = ["INCOME", "EXPENSE"] as const;

export type CategoryType = (typeof CATEGORY_TYPE_VALUES)[number];

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
