import { useMutation, useQueryClient } from "@tanstack/react-query";

import {
    confirmReceipt,
    registerQuickTransaction,
    uploadReceipt,
    waitForReceipt,
} from "../dashboard.service";

import { useAuthStore } from "@/auth/authStore";
import { resolveSession } from "@/auth/services/session.service";

export const useRegisterQuickTransaction = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (amount: number) => registerQuickTransaction(amount),
        onSuccess: async () => {
            try {
                const user = await resolveSession();

                if (user) {
                    useAuthStore.getState().setSession(user);
                }
            } catch {
                // The expense was already saved; keep the mutation successful if sync is temporarily unavailable.
            } finally {
                await queryClient.invalidateQueries();
            }
        },
    });
};


export const useUploadReceipt = () => {
    return useMutation({
        mutationFn: async (file: File) => {
            const uploaded = await uploadReceipt(file);
            return await waitForReceipt(uploaded.data.id);
        },
    });
};

export const useConfirmReceipt = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({
            receiptId,
            payload,
        }: {
            receiptId: string;
            payload: Parameters<typeof confirmReceipt>[1];
        }) => confirmReceipt(receiptId, payload),
        onSuccess: async () => {
            try {
                const user = await resolveSession();

                if (user) {
                    useAuthStore.getState().setSession(user);
                }
            } catch {
                // The receipt was already confirmed; keep the mutation successful if sync is temporarily unavailable.
            } finally {
                await queryClient.invalidateQueries();
            }
        },
    });
};
