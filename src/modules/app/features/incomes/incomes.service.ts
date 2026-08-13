import type { CreateIncomeData, Income } from "./interfaces/Income";

import { apiRequest } from "@/utils/api";
import { config } from "@/config/config";
import { idempotentPost } from "@/utils/idempotentPost";

const incomesUrl = `${config.API_BASE_URL}/api/v1/incomes`;

const jsonOptions: RequestInit = {
    headers: { "Content-Type": "application/json" },
};

export const postIncome = async (incomeData: CreateIncomeData) => {
    return await idempotentPost<Income>(incomesUrl, incomeData, {
        friendlyMessage: "Error al crear el ingreso",
    });
};

export const putIncome = async (id: string, incomeData: CreateIncomeData) => {
    return await apiRequest<Income>(
        `${incomesUrl}/${id}`,
        {
            ...jsonOptions,
            method: "PUT",
            body: JSON.stringify(incomeData),
        },
        "Error al actualizar el ingreso",
    );
};

export const deleteIncome = async (id: string) => {
    return await apiRequest<unknown>(
        `${incomesUrl}/${id}`,
        { method: "DELETE" },
        "Error al eliminar el ingreso",
    );
};
