import type { RecurringOccurrenceSource } from "./interfaces/Calendar";

import type { Transaction } from "@/modules/app/interfaces/Transaction";
import { apiRequest, type ApiResponse, type PaginatedListResponse } from "@/utils/api";
import { config } from "@/config/config";

const transactionsUrl = `${config.API_BASE_URL}/api/v1/transactions`;
const recurringUrl = `${config.API_BASE_URL}/api/v1/recurring`;

const defaultApiOptions: RequestInit = {
    headers: { "Content-Type": "application/json" },
};

/**
 * GET /api/v1/transactions does not support date-range filtering today, so
 * the calendar fetches a large, recency-sorted page and buckets it by day on
 * the client. This reuses the existing endpoint/DTO instead of introducing a
 * parallel "calendar transactions" model. If the backend later exposes
 * date-range filtering, only this function needs to change.
 */
export const getCalendarTransactions = async (size = 300) => {
    const params = new URLSearchParams({
        page: "0",
        size: String(size),
        sort: "date,desc",
    });

    return await apiRequest<PaginatedListResponse<Transaction>>(
        `${transactionsUrl}?${params.toString()}`,
        { ...defaultApiOptions, method: "GET" },
        "Error al obtener los movimientos del calendario",
    );
};

/** GET /api/v1/recurring — all recurring transactions for the authenticated
 * user, across every wallet. Returns a plain array (not paginated). */
export const getUserRecurring = async () => {
    return await apiRequest<ApiResponse<RecurringOccurrenceSource[]> | RecurringOccurrenceSource[]>(
        recurringUrl,
        { ...defaultApiOptions, method: "GET" },
        "Error al obtener las recurrencias",
    );
};
