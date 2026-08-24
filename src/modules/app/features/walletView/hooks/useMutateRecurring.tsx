import { useMutation, useQueryClient } from "@tanstack/react-query";

import { postRecurring } from "../recurring.service";
import type { CreateRecurringData } from "../interfaces/Recurring";

export const usePostRecurring = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (recurringData: CreateRecurringData) => postRecurring(recurringData),
        onSuccess: (_data, variables) => {
            void queryClient.invalidateQueries({ queryKey: ["walletDetails", variables.walletId] });
            void queryClient.invalidateQueries({ queryKey: ["wallet-overview", variables.walletId] });
            void queryClient.invalidateQueries({ queryKey: ["wallet-transactions", variables.walletId] });
            void queryClient.invalidateQueries({ queryKey: ["wallet", variables.walletId] });
        },
    });
};
