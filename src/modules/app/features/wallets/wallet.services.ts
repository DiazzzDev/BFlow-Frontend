import { CreateWalletData, Wallet } from "./interfaces/Wallets";

import { apiRequest, PaginatedListResponse } from "@/utils/api";
import { config } from "@/api/config";

const API_URL = `${config.API_BASE_URL}/api/v1/wallets`;

const defaultApiOptions: RequestInit = {
    headers: { "Content-Type": "application/json" },
};

export const getWallets = () =>
    apiRequest<PaginatedListResponse<Wallet>>(
        API_URL,
        { ...defaultApiOptions, method: "GET" },
        "Error al obtener las billeteras"
    );

export const postWallet = (walletData: CreateWalletData) =>
    apiRequest<Wallet>(
        API_URL,
        { ...defaultApiOptions, method: "POST", body: JSON.stringify(walletData) },
        "Error al crear la billetera"
    );