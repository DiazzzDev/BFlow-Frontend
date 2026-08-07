import type { CreateExpenseData, Expense } from "./interfaces/Expense";

import { config } from "@/config/config";
import { idempotentPost } from "@/utils/idempotentPost";

const expensesUrl = `${config.API_BASE_URL}/api/v1/expenses`;

export const postExpense = async (expenseData: CreateExpenseData) => {
    return await idempotentPost<Expense>(expensesUrl, expenseData, {
        friendlyMessage: "Error al crear el gasto",
    });
};
