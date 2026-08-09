import type { Budget, CreateBudgetData, GetBudgetsParams } from "./interfaces/Budget";

import { apiRequest, PaginatedListResponse } from "@/utils/api";
import { config } from "@/config/config";

const budgetsUrl = `${config.API_BASE_URL}/api/v1/budgets`;

const defaultApiOptions: RequestInit = {
    headers: { "Content-Type": "application/json" },
};

export const getBudgets = async (filters: GetBudgetsParams = {}) => {
    const params = new URLSearchParams({
        page: String(filters.page ?? 0),
        size: String(filters.size ?? 5),
    });

    if (filters.query?.trim()) {
        params.set("query", filters.query.trim());
    }
    if (filters.sort?.trim()) {
        params.set("sort", filters.sort.trim());
    }
    if (filters.period?.trim()) {
        params.set("period", filters.period.trim());
    }

    return await apiRequest<PaginatedListResponse<Budget>>(
        `${budgetsUrl}?${params.toString()}`,
        { ...defaultApiOptions, method: "GET" },
        "Error al obtener los presupuestos",
    );
};

export const postBudget = async (budgetData: CreateBudgetData) => {
    return await apiRequest<Budget>(
        budgetsUrl,
        {
            ...defaultApiOptions,
            method: "POST",
            body: JSON.stringify(budgetData),
        },
        "Error al crear el presupuesto",
    );
};
