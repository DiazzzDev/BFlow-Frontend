import type { WalletDetails } from "./interfaces/WalletDetails";
import type { WalletMember } from "./interfaces/WalletMember";

import type { Wallet } from "@/modules/app/interfaces/Wallet";
import type { Transaction, TransactionType } from "@/modules/app/interfaces/Transaction";
import {
    apiRequest,
    type ApiResponse,
    type PaginatedListResponse,
} from "@/utils/api";
import { config } from "@/config/config";

const walletsUrl = `${config.API_BASE_URL}/api/v1/wallets`;

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

// Paginated wallet transactions; pass `type` to filter INCOME/EXPENSE
export const getWalletTransactions = async (
    walletId: string,
    {
        type,
        query,
        page = 0,
        size = 5,
    }: {
        type?: TransactionType;
        query?: string;
        page?: number;
        size?: number;
    } = {},
) => {
    const params = new URLSearchParams({
        page: String(page),
        size: String(size),
    });

    if (type) {
        params.set("type", type);
    }

    if (query?.trim()) {
        params.set("query", query.trim());
    }

    return await apiRequest<PaginatedListResponse<Transaction>>(
        `${walletsUrl}/${walletId}/transactions?${params.toString()}`,
        { ...defaultApiOptions, method: "GET" },
        "Error al obtener las transacciones",
    );
};
