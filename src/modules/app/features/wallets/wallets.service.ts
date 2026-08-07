import type { Transaction } from "../walletView/interfaces/Transaction";

import type { CreateWalletData, Wallet } from "./interfaces/Wallets";

import { apiRequest, PaginatedListResponse } from "@/utils/api";
import { config } from "@/config/config";

const walletsUrl = `${config.API_BASE_URL}/api/v1/wallets`;
const transactionsUrl = `${config.API_BASE_URL}/api/v1/transactions`;

const defaultApiOptions: RequestInit = {
    headers: { "Content-Type": "application/json" },
};

export const getWallets = async (scope: "MINE" | "SHARED", query?: string) => {
    const params = new URLSearchParams({ scope });

    if (query?.trim()) {
        params.set("query", query.trim());
    }

    return await apiRequest<PaginatedListResponse<Wallet>>(
        `${walletsUrl}?${params.toString()}`,
        { ...defaultApiOptions, method: "GET" },
        "Error al obtener las billeteras"
    );
};

export const getHistory = async () => {
    return await apiRequest<PaginatedListResponse<Transaction>>(
        transactionsUrl,
        { ...defaultApiOptions, method: "GET" },
        "Error al obtener el historial"
    );
};

export const postWallet = async (walletData: CreateWalletData) => {
    return await apiRequest<Wallet>(
        walletsUrl,
        {
            ...defaultApiOptions,
            method: "POST",
            body: JSON.stringify(walletData),
        },
        "Error al crear la billetera"
    );
};
