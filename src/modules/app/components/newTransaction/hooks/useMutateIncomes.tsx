import { useMutation, useQueryClient } from "@tanstack/react-query";

import { deleteIncome, postIncome, putIncome } from "../services/incomes.service";
import type { CreateIncomeData } from "../interfaces/Income";

const invalidateIncomeQueries = (
    queryClient: ReturnType<typeof useQueryClient>,
    walletId: string,
) => {
    void queryClient.invalidateQueries({ queryKey: ["wallet-overview", walletId] });
    void queryClient.invalidateQueries({ queryKey: ["wallet-transactions", walletId] });
    void queryClient.invalidateQueries({ queryKey: ["wallet", walletId] });
    void queryClient.invalidateQueries({ queryKey: ["walletDetails", walletId] });
    void queryClient.invalidateQueries({ queryKey: ["wallets"] });
    void queryClient.invalidateQueries({ queryKey: ["history"] });
    void queryClient.invalidateQueries({ queryKey: ["transactions-history"] });
};

export const usePostIncome = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (incomeData: CreateIncomeData) => postIncome(incomeData),
        onSuccess: (_data, variables) => {
            invalidateIncomeQueries(queryClient, variables.walletId);
        },
    });
};

export const usePutIncome = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({
            id,
            data,
        }: {
            id: string;
            data: CreateIncomeData;
        }) => putIncome(id, data),
        onSuccess: (_data, variables) => {
            invalidateIncomeQueries(queryClient, variables.data.walletId);
        },
    });
};

export const useDeleteIncome = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ id }: { id: string; walletId: string }) => deleteIncome(id),
        onSuccess: (_data, variables) => {
            invalidateIncomeQueries(queryClient, variables.walletId);
        },
    });
};
