import type { CreateExpenseData, Expense } from "./interfaces/Expense";
import type { CreateIncomeData, Income } from "./interfaces/Income";
import type { CreateTransferData, Transfer } from "./interfaces/Transfer";

import { apiRequest, idempotentPost } from "@/utils/api";
import { config } from "@/config/config";

const expensesUrl = `${config.API_BASE_URL}/api/v1/expenses`;
const incomesUrl = `${config.API_BASE_URL}/api/v1/incomes`;
const transfersUrl = `${config.API_BASE_URL}/api/v1/tranfers`;

const jsonOptions: RequestInit = {
    headers: { "Content-Type": "application/json" },
};

// --- /api/v1/expenses ---

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

// --- /api/v1/incomes ---

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

// --- /api/v1/tranfers ---

export const postTransfer = async (transferData: CreateTransferData) => {
    return await idempotentPost<Transfer>(transfersUrl, transferData, {
        friendlyMessage: "Error al crear la transferencia",
    });
};
