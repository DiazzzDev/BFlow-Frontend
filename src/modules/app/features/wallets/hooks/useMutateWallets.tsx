import { useMutation, useQueryClient } from "@tanstack/react-query";

import { deleteWallet, patchWallet, postWallet } from "../wallets.service";
import type { CreateWalletData, UpdateWalletData } from "../interfaces/Wallets";

const invalidateWalletQueries = (
    queryClient: ReturnType<typeof useQueryClient>,
    walletId?: string,
) => {
    void queryClient.invalidateQueries({ queryKey: ["wallets"] });
    if (!walletId) {
        return;
    }
    void queryClient.invalidateQueries({ queryKey: ["wallet", walletId] });
    void queryClient.invalidateQueries({ queryKey: ["walletDetails", walletId] });
    void queryClient.invalidateQueries({ queryKey: ["wallet-overview", walletId] });
    void queryClient.invalidateQueries({ queryKey: ["wallet-transactions", walletId] });
};

export const useMutateWallets = () => {
    const queryClient = useQueryClient();

    const createWallet = useMutation({
        mutationFn: (walletData: CreateWalletData) => postWallet(walletData),
        onSuccess: () => {
            invalidateWalletQueries(queryClient);
        },
    });

    const updateWallet = useMutation({
        mutationFn: ({
            id,
            data,
        }: {
            id: string;
            data: UpdateWalletData;
        }) => patchWallet(id, data),
        onSuccess: (_data, variables) => {
            invalidateWalletQueries(queryClient, variables.id);
        },
    });

    const removeWallet = useMutation({
        mutationFn: (id: string) => deleteWallet(id),
        onSuccess: (_data, id) => {
            invalidateWalletQueries(queryClient, id);
        },
    });

    return {
        createWallet,
        updateWallet,
        removeWallet,
    };
};
