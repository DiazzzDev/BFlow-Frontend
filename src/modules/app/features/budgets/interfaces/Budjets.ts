export interface CreateBudgetData {
    name: string;
    description?: string;
    initialValue: number;
    currency: string;
}

export interface Budget extends CreateBudgetData {
    id: string;
    balance: number;
    createdAt: string;
    updatedAt: string;
    role: string;
}
