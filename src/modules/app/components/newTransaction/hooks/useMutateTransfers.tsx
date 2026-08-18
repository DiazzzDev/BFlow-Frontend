import { useMutation, useQueryClient } from "@tanstack/react-query";

import { postTransfer } from "../services/transfers.service";
import type { CreateTransferData } from "../interfaces/Transfer";

export const useMutateTransfers = () => {
    const queryClient = useQueryClient();

    const createTransfer = useMutation({
        mutationFn: (transferData: CreateTransferData) => postTransfer(transferData),
        onSuccess: (_data, variables) => {
            void queryClient.invalidateQueries({ queryKey: ["wallet-overview", variables.fromWalletId] });
            void queryClient.invalidateQueries({ queryKey: ["wallet-overview", variables.toWalletId] });
            void queryClient.invalidateQueries({ queryKey: ["wallet-transactions", variables.fromWalletId] });
            void queryClient.invalidateQueries({ queryKey: ["wallet-transactions", variables.toWalletId] });
            void queryClient.invalidateQueries({ queryKey: ["wallet", variables.fromWalletId] });
            void queryClient.invalidateQueries({ queryKey: ["wallet", variables.toWalletId] });
            void queryClient.invalidateQueries({ queryKey: ["walletDetails", variables.fromWalletId] });
            void queryClient.invalidateQueries({ queryKey: ["walletDetails", variables.toWalletId] });
            void queryClient.invalidateQueries({ queryKey: ["wallets"] });
            void queryClient.invalidateQueries({ queryKey: ["history"] });
            void queryClient.invalidateQueries({ queryKey: ["transactions-history"] });
        },
    });

    return {
        createTransfer,
    };
};
