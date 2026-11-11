import { useMutation, useQueryClient } from "@tanstack/react-query";

import type { CreateRecurringData } from "../interfaces/Recurring";
import { postRecurring } from "../scheduleTransaction.service";

export const usePostRecurring = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (recurringData: CreateRecurringData) =>
            postRecurring(recurringData),
        onSuccess: (_data, variables) => {
            void queryClient.invalidateQueries({
                queryKey: ["walletDetails", variables.walletId],
            });
            void queryClient.invalidateQueries({
                queryKey: ["wallet-overview", variables.walletId],
            });
            void queryClient.invalidateQueries({
                queryKey: ["wallet-transactions", variables.walletId],
            });
            void queryClient.invalidateQueries({
                queryKey: ["wallet", variables.walletId],
            });
            void queryClient.invalidateQueries({
                queryKey: ["dashboard-recent-activity"],
            });
            void queryClient.invalidateQueries({
                queryKey: ["dashboard-activity-breakdown"],
            });
        },
    });
};
