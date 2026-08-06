import { useMutation, useQueryClient } from "@tanstack/react-query";

import { postExpense } from "../expenses.service";
import type { CreateExpenseData } from "../interfaces/Expense";

export const useMutateExpenses = () => {
    const queryClient = useQueryClient();

    const createExpense = useMutation({
        mutationFn: (expenseData: CreateExpenseData) => postExpense(expenseData),
        onSuccess: (_data, variables) => {
            void queryClient.invalidateQueries({ queryKey: ["wallet-overview", variables.walletId] });
            void queryClient.invalidateQueries({ queryKey: ["wallet-transactions", variables.walletId] });
            void queryClient.invalidateQueries({ queryKey: ["wallet", variables.walletId] });
            void queryClient.invalidateQueries({ queryKey: ["walletDetails", variables.walletId] });
            void queryClient.invalidateQueries({ queryKey: ["wallets"] });
            void queryClient.invalidateQueries({ queryKey: ["history"] });
            void queryClient.invalidateQueries({ queryKey: ["transactions-history"] });
        },
    });

    return {
        createExpense,
    };
};
