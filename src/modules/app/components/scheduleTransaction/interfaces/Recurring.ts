import type { CategoryType } from "@/modules/app/interfaces/Category";
import type { Periodicity } from "@/modules/app/interfaces/Periodicity";

export interface CreateRecurringData {
    title: string;
    description?: string;
    amount: number;
    walletId: string;
    categoryId?: string;
    type: CategoryType;
    frequency: Periodicity;
    intervalValue: number;
    startDate?: string;
    endDate?: string;
}

export interface Recurring extends Omit<CreateRecurringData, "description" | "categoryId" | "endDate"> {
    id: string;
    description: string | null;
    categoryId: string | null;
    endDate: string | null;
    nextExecutionDate: string;
    active: boolean;
}
