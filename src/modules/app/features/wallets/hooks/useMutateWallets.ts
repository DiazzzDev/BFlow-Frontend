import { useMutation, useQueryClient } from "@tanstack/react-query";

import { postWallet } from "../wallets.service";
import type { CreateWalletData } from "../interfaces/Wallets";

export const useMutateWallets = () => {
    const queryClient = useQueryClient();

    const createWallet = useMutation({
        mutationFn: (walletData: CreateWalletData) => postWallet(walletData),
        onSuccess: () => {
            void queryClient.invalidateQueries({ queryKey: ["wallets"] });
        },
    });

    // updateWallet, deleteWallet, patchWallet → acá cuando existan

    return {
        createWallet,
    };
};
