import type { CreateRecurringData, Recurring } from "./interfaces/Recurring";

import { config } from "@/config/config";
import { idempotentPost } from "@/utils/idempotentPost";

const recurringUrl = `${config.API_BASE_URL}/api/v1/recurring`;

export const postRecurring = async (recurringData: CreateRecurringData) => {
    return await idempotentPost<Recurring>(recurringUrl, recurringData, {
        friendlyMessage: "Error al programar la transacción",
    });
};
