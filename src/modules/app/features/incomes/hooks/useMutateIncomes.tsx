import { useMutation, useQueryClient } from "@tanstack/react-query";

import { postIncome } from "../incomes.service";
import type { CreateIncomeData } from "../interfaces/Income";

export const useMutateIncomes = () => {
    const queryClient = useQueryClient();

    const createIncome = useMutation({
        mutationFn: (incomeData: CreateIncomeData) => postIncome(incomeData),
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
        createIncome,
    };
};
