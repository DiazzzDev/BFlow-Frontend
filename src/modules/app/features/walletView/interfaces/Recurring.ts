import type { CategoryType } from "@/modules/app/interfaces/Category";
import type { Periodicity } from "@/modules/app/interfaces/Periodicity";

export interface CreateRecurringData {
    title: string;
    description: string;
    amount: number;
    walletId: string;
    categoryId: string;
    type: CategoryType;
    frequency: Periodicity;
    intervalValue: number;
    startDate: string;
    endDate: string;
}

export interface Recurring extends CreateRecurringData {
    id: string;
}
