import { useMutation, useQueryClient } from "@tanstack/react-query";

import { deleteExpense, postExpense, putExpense } from "../expenses.service";
import type { CreateExpenseData } from "../interfaces/Expense";

const invalidateExpenseQueries = (
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

export const usePostExpense = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (expenseData: CreateExpenseData) => postExpense(expenseData),
        onSuccess: (_data, variables) => {
            invalidateExpenseQueries(queryClient, variables.walletId);
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
        onSuccess: (_data, variables) => {
            invalidateExpenseQueries(queryClient, variables.data.walletId);
        },
    });
};

export const useDeleteExpense = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ id }: { id: string; walletId: string }) => deleteExpense(id),
        onSuccess: (_data, variables) => {
            invalidateExpenseQueries(queryClient, variables.walletId);
        },
    });
};
