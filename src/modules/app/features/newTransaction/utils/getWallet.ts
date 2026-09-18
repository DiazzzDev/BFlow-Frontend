import type { Wallet } from "@/modules/app/interfaces/Wallet";

export const getWallet = (list: Wallet[], id: string): Wallet | null => {
    const item = list.find((wallet) => wallet.id === id);

    return item || null;
};
