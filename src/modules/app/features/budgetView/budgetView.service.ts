import type { BudgetDetail } from "../budgets/interfaces/Budget";

import { apiRequest } from "@/utils/api";
import { config } from "@/config/config";

const budgetsUrl = `${config.API_BASE_URL}/api/v1/budgets`;

const defaultApiOptions: RequestInit = {
    headers: { "Content-Type": "application/json" },
};

type ApiResponse<T> = {
    success: boolean;
    message: string;
    data: T;
};

export const getBudgetById = async (budgetId: string) => {
    return await apiRequest<ApiResponse<BudgetDetail>>(
        `${budgetsUrl}/${budgetId}/detail`,
        { ...defaultApiOptions, method: "GET" },
        "Error al obtener el presupuesto",
    );
};
