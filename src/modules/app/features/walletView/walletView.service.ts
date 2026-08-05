import { getWallets } from "../wallets/wallets.service";
import type { Wallet } from "../wallets/interfaces/Wallets";

export const getWalletById = async (walletId: string): Promise<Wallet | null> => {
    const response = await getWallets();
    return response.data.content.find((wallet) => wallet.id === walletId) ?? null;
};
