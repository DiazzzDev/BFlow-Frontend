import type { Transaction, TransactionType } from "../walletView/interfaces/Transaction";

import { apiRequest, PaginatedListResponse } from "@/utils/api";
import { config } from "@/config/config";

const transactionsUrl = `${config.API_BASE_URL}/api/v1/transactions`;

const defaultApiOptions: RequestInit = {
    headers: { "Content-Type": "application/json" },
};

export interface GetHistoryParams {
    query?: string;
    type?: TransactionType | null;
    page?: number;
    size?: number;
}

export const getHistory = async ({
    query,
    type,
    page = 0,
    size = 20,
}: GetHistoryParams = {}) => {
    const params = new URLSearchParams({
        page: String(page),
        size: String(size),
    });

    if (query?.trim()) {
        params.set("query", query.trim());
    }

    if (type) {
        params.set("type", type);
    }

    return await apiRequest<PaginatedListResponse<Transaction>>(
        `${transactionsUrl}?${params.toString()}`,
        { ...defaultApiOptions, method: "GET" },
        "Error al obtener el historial",
    );
};
