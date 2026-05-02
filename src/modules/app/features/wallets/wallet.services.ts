import { apiRequest, APIError, PaginatedListResponse } from "../../../../utils/api.ts";
import { config } from "../../../../api/config.ts";

import { Wallet } from "./interfaces/Wallets.ts";
import { WalletCreationPayload } from "./wallet.store.ts";

const API_URL = `${config.API_BASE_URL}/v1/wallets`;

const defaultApiOptions: RequestInit = {
    credentials: 'include',
    headers: { 'Content-Type': 'application/json' }
};

export const getWallets = async () => {
    try {
        return await apiRequest<PaginatedListResponse<Wallet>>(
            `${API_URL}`,
            { ...defaultApiOptions, method: 'GET' },
            'Error al obtener las billeteras'
        );
    } catch (error) {
        if (error instanceof APIError) {
            throw error;
        }
        throw new APIError('Error al obtener las billeteras', 0, error, `${API_URL}`);
    }
};

export const postWallet = async (walletData: WalletCreationPayload) => {
    try {
        return await apiRequest<Wallet>(
            `${API_URL}`,
            { ...defaultApiOptions, method: 'POST', body: JSON.stringify(walletData) },
            'Error al crear la billetera'
        );
    } catch (error) {
        if (error instanceof APIError) {
            throw error;
        }
        throw new APIError('Error al crear la billetera', 0, error, `${API_URL}`);
    }
};