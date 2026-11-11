import { useMutation, useQueryClient } from "@tanstack/react-query";

import { deleteExpense, postExpense, putExpense } from "../newTransaction.service";
import type { CreateExpenseData } from "../interfaces/Expense";
import { invalidateFinancialQueries } from "@/utils/query/invalidateFinancialQueries";

const invalidateExpenseQueries = (
    queryClient: ReturnType<typeof useQueryClient>,
    walletId: string,
) => {
    return invalidateFinancialQueries(queryClient, [walletId]);
};

export const usePostExpense = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (expenseData: CreateExpenseData) => postExpense(expenseData),
        onSuccess: async (_data, variables) => {
            await invalidateExpenseQueries(queryClient, variables.walletId);
        },
    });
};

export const usePutExpense = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({
            id,
            data,
        }: {
            id: string;
            data: CreateExpenseData;
        }) => putExpense(id, data),
        onSuccess: async (_data, variables) => {
            await invalidateExpenseQueries(queryClient, variables.data.walletId);
        },
    });
};

export const useDeleteExpense = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ id }: { id: string; walletId: string }) => deleteExpense(id),
        onSuccess: async (_data, variables) => {
            await invalidateExpenseQueries(queryClient, variables.walletId);
        },
    });
};
