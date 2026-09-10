import type { Wallet } from "../wallets/interfaces/Wallets";

import type { Transaction, TransactionType } from "@/modules/app/interfaces/Transaction";
import type { WalletDetails } from "./interfaces/WalletDetails";
import type { WalletMember } from "./interfaces/WalletMember";
import type { CreateRecurringData, Recurring } from "./interfaces/Recurring";

import {
    apiRequest,
    idempotentPost,
    type ApiResponse,
    type PaginatedListResponse,
} from "@/utils/api";
import { config } from "@/config/config";

const walletsUrl = `${config.API_BASE_URL}/api/v1/wallets`;
const transactionsUrl = `${config.API_BASE_URL}/api/v1/transactions`;
const recurringUrl = `${config.API_BASE_URL}/api/v1/recurring`;

const defaultApiOptions: RequestInit = {
    headers: { "Content-Type": "application/json" },
};

// --- /api/v1/wallets ---

export const getWalletById = async (walletId: string) => {
    return await apiRequest<ApiResponse<Wallet>>(
        `${walletsUrl}/${walletId}`,
        { ...defaultApiOptions, method: "GET" },
        "Error al obtener la billetera",
    );
};

export const getWalletMembers = async (walletId: string) => {
    return await apiRequest<ApiResponse<WalletMember[]>>(
        `${walletsUrl}/${walletId}/members`,
        { ...defaultApiOptions, method: "GET" },
        "Error al obtener los miembros de la billetera",
    );
};

export const removeWalletMember = async (walletId: string, memberId: string) => {
    return await apiRequest<ApiResponse<string>>(
        `${walletsUrl}/${walletId}/members/${memberId}`,
        { ...defaultApiOptions, method: "DELETE" },
        "Error al eliminar el miembro",
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
        size: String(size),
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

// --- /api/v1/transactions ---

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

// --- /api/v1/recurring ---

export const postRecurring = async (recurringData: CreateRecurringData) => {
    return await idempotentPost<Recurring>(recurringUrl, recurringData, {
        friendlyMessage: "Error al programar la transacción",
    });
};
