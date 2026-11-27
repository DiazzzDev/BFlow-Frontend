import { useMutation, useQueryClient } from "@tanstack/react-query";

import type { CreateRecurringData } from "../interfaces/Recurring";
import { deleteRecurring, postRecurring, updateRecurring } from "../scheduleTransaction.service";

const invalidateWalletRecurring = (queryClient: ReturnType<typeof useQueryClient>, walletId: string) => {
    void queryClient.invalidateQueries({ queryKey: ["wallet-recurring", walletId] });
    void queryClient.invalidateQueries({ queryKey: ["walletDetails", walletId] });
};

export const usePostRecurring = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (recurringData: CreateRecurringData) =>
            postRecurring(recurringData),
        onSuccess: (_data, variables) => {
            invalidateWalletRecurring(queryClient, variables.walletId);
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

export const useUpdateRecurring = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({ id, data }: { id: string; data: CreateRecurringData }) => updateRecurring(id, data),
        onSuccess: (_data, variables) => invalidateWalletRecurring(queryClient, variables.data.walletId),
    });
};

export const useDeleteRecurring = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({ id, walletId: _walletId }: { id: string; walletId: string }) => deleteRecurring(id),
        onSuccess: (_data, variables) => invalidateWalletRecurring(queryClient, variables.walletId),
    });
};
