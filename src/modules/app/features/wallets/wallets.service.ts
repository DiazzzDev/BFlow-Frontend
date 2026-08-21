import type { Transaction } from "../walletView/interfaces/Transaction";

import type { CreateWalletData, UpdateWalletData, Wallet } from "./interfaces/Wallets";

import { apiRequest, PaginatedListResponse } from "@/utils/api";
import { config } from "@/config/config";

const walletsUrl = `${config.API_BASE_URL}/api/v1/wallets`;
const transactionsUrl = `${config.API_BASE_URL}/api/v1/transactions`;

const defaultApiOptions: RequestInit = {
    headers: { "Content-Type": "application/json" },
};

export interface GetWalletsParams {
    scope: "MINE" | "SHARED";
    query?: string;
    page?: number;
    size?: number;
}

export const getWallets = async ({
    scope,
    query,
    page = 0,
    size = 5,
}: GetWalletsParams) => {
    const params = new URLSearchParams({
        scope,
        page: String(page),
        size: String(size),
    });

    if (query?.trim()) {
        params.set("query", query.trim());
    }

    return await apiRequest<PaginatedListResponse<Wallet>>(
        `${walletsUrl}?${params.toString()}`,
        { ...defaultApiOptions, method: "GET" },
        "Error al obtener las billeteras",
    );
};

export const getHistory = async () => {
    return await apiRequest<PaginatedListResponse<Transaction>>(
        transactionsUrl,
        { ...defaultApiOptions, method: "GET" },
        "Error al obtener el historial",
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
        "Error al crear la billetera",
    );
};

export const patchWallet = async (id: string, walletData: UpdateWalletData) => {
    return await apiRequest<Wallet>(
        `${walletsUrl}/${id}`,
        {
            ...defaultApiOptions,
            method: "PATCH",
            body: JSON.stringify(walletData),
        },
        "Error al actualizar la billetera",
    );
};

export const deleteWallet = async (id: string) => {
    return await apiRequest<unknown>(
        `${walletsUrl}/${id}`,
        { method: "DELETE" },
        "Error al eliminar la billetera",
    );
};
