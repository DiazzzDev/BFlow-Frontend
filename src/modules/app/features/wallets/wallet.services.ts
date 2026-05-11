import { apiRequest, PaginatedListResponse } from "../../../../utils/api.ts";
import { config } from "../../../../api/config.ts";

import { CreateWalletData, Wallet } from "./interfaces/Wallets.ts";

const API_URL = `${config.API_BASE_URL}/api/v1/wallets`;

const defaultApiOptions: RequestInit = {
    credentials: 'include',
    headers: { 'Content-Type': 'application/json' }
};

export const getWallets = async () => {
    return await apiRequest<PaginatedListResponse<Wallet>>(
        `${API_URL}`,
        { ...defaultApiOptions, method: 'GET' },
        'Error al obtener las billeteras'
    );
};

export const postWallet = async (walletData: CreateWalletData) => {
    return await apiRequest<Wallet>(
        `${API_URL}`,
        { ...defaultApiOptions, method: 'POST', body: JSON.stringify(walletData) },
        'Error al crear la billetera'
    );
};