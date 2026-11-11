import type { CreateRecurringData, Recurring } from "./interfaces/Recurring";

import { idempotentPost } from "@/utils/api";
import { config } from "@/config/config";

const recurringUrl = `${config.API_BASE_URL}/api/v1/recurring`;

export const postRecurring = async (recurringData: CreateRecurringData) => {
    return await idempotentPost<Recurring>(recurringUrl, recurringData, {
        friendlyMessage: "Error al programar la transacción",
    });
};
