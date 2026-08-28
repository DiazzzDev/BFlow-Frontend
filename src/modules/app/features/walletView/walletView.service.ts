import type { Wallet } from "../wallets/interfaces/Wallets";

import type { Transaction, TransactionType, WalletDetails } from "./interfaces/Transaction";

import { apiRequest, PaginatedListResponse } from "@/utils/api";
import { config } from "@/config/config";

const walletsUrl = `${config.API_BASE_URL}/api/v1/wallets`;
const transactionsUrl = `${config.API_BASE_URL}/api/v1/transactions`;

const defaultApiOptions: RequestInit = {
    headers: { "Content-Type": "application/json" },
};

type ApiResponse<T> = {
    success: boolean;
    message: string;
    data: T;
};

export const getWalletById = async (walletId: string) => {
    return await apiRequest<ApiResponse<Wallet>>(
        `${walletsUrl}/${walletId}`,
        { ...defaultApiOptions, method: "GET" },
        "Error al obtener la billetera",
    );
};

export const getWalletDetails = async (walletId: string) => {
    return await apiRequest<ApiResponse<WalletDetails>>(
        `${walletsUrl}/${walletId}/info`,
        { ...defaultApiOptions, method: "GET" },
        "Error al obtener los detalles de la billetera",
    );
};

export const getOverview = async (
    walletId: string,
    {
        query,
        page = 0,
        size = 5,
    }: {
        query?: string;
        page?: number;
        size?: number;
    } = {},
) => {
    const params = new URLSearchParams({
        page: String(page),
        size: String(size)
    });

    if (query?.trim()) {
        params.set("query", query.trim());
    }

    return await apiRequest<PaginatedListResponse<Transaction>>(
        `${walletsUrl}/${walletId}/transactions?${params.toString()}`,
        { ...defaultApiOptions, method: "GET" },
        "Error al obtener las transacciones",
    );
};

export const getTransactions = async ({
    type,
    walletId,
    query,
    page = 0,
    size = 5,
}: {
    type: TransactionType;
    walletId: string;
    query?: string;
    page?: number;
    size?: number;
}) => {
    const params = new URLSearchParams({
        type,
        walletId,
        page: String(page),
        size: String(size),
    });

    if (query?.trim()) {
        params.set("query", query.trim());
    }

    return await apiRequest<PaginatedListResponse<Transaction>>(
        `${transactionsUrl}?${params.toString()}`,
        { ...defaultApiOptions, method: "GET" },
        "Error al obtener las transacciones",
    );
};
