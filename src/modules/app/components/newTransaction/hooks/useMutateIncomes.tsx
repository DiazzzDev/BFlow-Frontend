import { useMutation, useQueryClient } from "@tanstack/react-query";

import { deleteIncome, postIncome, putIncome } from "../newTransaction.service";
import type { CreateIncomeData } from "../interfaces/Income";
import { invalidateFinancialQueries } from "@/utils/query/invalidateFinancialQueries";

const invalidateIncomeQueries = (
    queryClient: ReturnType<typeof useQueryClient>,
    walletId: string,
) => {
    return invalidateFinancialQueries(queryClient, [walletId]);
};

export const usePostIncome = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (incomeData: CreateIncomeData) => postIncome(incomeData),
        onSuccess: async (_data, variables) => {
            await invalidateIncomeQueries(queryClient, variables.walletId);
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
        onSuccess: async (_data, variables) => {
            await invalidateIncomeQueries(queryClient, variables.data.walletId);
        },
    });
};

export const useDeleteIncome = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ id }: { id: string; walletId: string }) => deleteIncome(id),
        onSuccess: async (_data, variables) => {
            await invalidateIncomeQueries(queryClient, variables.walletId);
        },
    });
};
