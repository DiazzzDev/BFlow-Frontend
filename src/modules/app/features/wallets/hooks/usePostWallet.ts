import { toast } from "react-toastify";
import { useMutation, useQueryClient } from "@tanstack/react-query";

import { postWallet } from "../wallet.services";
import { CreateWalletData } from "../interfaces/Wallets";

import { APIError } from "@/utils/api";

export const usePostWallet = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (newWalletData: CreateWalletData) => postWallet(newWalletData),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['wallets'] });
            toast.success('Billetera creada');
        },
        onError: (error: APIError) => {
            toast.error(error.message || 'Error al crear la billetera');
        }
    });
};
