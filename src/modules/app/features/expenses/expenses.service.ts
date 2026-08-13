import type { CreateExpenseData, Expense } from "./interfaces/Expense";

import { apiRequest } from "@/utils/api";
import { config } from "@/config/config";
import { idempotentPost } from "@/utils/idempotentPost";

const expensesUrl = `${config.API_BASE_URL}/api/v1/expenses`;

const jsonOptions: RequestInit = {
    headers: { "Content-Type": "application/json" },
};

export const postExpense = async (expenseData: CreateExpenseData) => {
    return await idempotentPost<Expense>(expensesUrl, expenseData, {
        friendlyMessage: "Error al crear el gasto",
    });
};

export const putExpense = async (id: string, expenseData: CreateExpenseData) => {
    return await apiRequest<Expense>(
        `${expensesUrl}/${id}`,
        {
            ...jsonOptions,
            method: "PUT",
            body: JSON.stringify(expenseData),
        },
        "Error al actualizar el gasto",
    );
};

export const deleteExpense = async (id: string) => {
    return await apiRequest<unknown>(
        `${expensesUrl}/${id}`,
        { method: "DELETE" },
        "Error al eliminar el gasto",
    );
};
