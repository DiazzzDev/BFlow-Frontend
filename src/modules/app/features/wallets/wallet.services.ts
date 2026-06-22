import { apiRequest, PaginatedListResponse } from "../../../../utils/api.ts";
import { config } from "../../../../api/config.ts";

import { CreateWalletData, Wallet } from "./interfaces/Wallets.ts";

const API_URL = `${config.API_BASE_URL}/api/v1/wallets`;

const defaultApiOptions: RequestInit = {
    headers: {
        "Content-Type": "application/json"
    }
};

export const getWallets = async (token: string) => {
    return await apiRequest<PaginatedListResponse<Wallet>>(
        `${API_URL}`,
        { ...defaultApiOptions, method: "GET" },
        "Error al obtener las billeteras",
        [],
        token
    );
};

export const postWallet = async (walletData: CreateWalletData, token: string) => {
    return await apiRequest<Wallet>(
        `${API_URL}`,
        { ...defaultApiOptions, method:"POST", body:JSON.stringify(walletData) },
        "Error al crear la billetera",
        [],
        token
    );
};