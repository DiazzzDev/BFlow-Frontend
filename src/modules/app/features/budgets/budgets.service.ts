import type { CreateBudgetData, Budget } from "./interfaces/Budjets";

import { apiRequest, PaginatedListResponse } from "@/utils/api";
import { config } from "@/config/config";

const API_URL = `${config.API_BASE_URL}/api/v1/wallets`;

const defaultApiOptions: RequestInit = {
    headers: { "Content-Type": "application/json" },
};

export const getBudgets = () =>
    apiRequest<PaginatedListResponse<Budget>>(
        API_URL,
        { ...defaultApiOptions, method: "GET" },
        "Error al obtener las billeteras"
    );

export const postBudget = (budgetData: CreateBudgetData) =>
    apiRequest<Budget>(
        API_URL,
        {
            ...defaultApiOptions,
            method: "POST",
            body: JSON.stringify(budgetData),
        },
        "Error al crear el presupuesto"
    );
