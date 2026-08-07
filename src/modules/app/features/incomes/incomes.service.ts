import type { CreateIncomeData, Income } from "./interfaces/Income";

import { config } from "@/config/config";
import { idempotentPost } from "@/utils/idempotentPost";

const incomesUrl = `${config.API_BASE_URL}/api/v1/incomes`;

export const postIncome = async (incomeData: CreateIncomeData) => {
    return await idempotentPost<Income>(incomesUrl, incomeData, {
        friendlyMessage: "Error al crear el ingreso",
    });
};
