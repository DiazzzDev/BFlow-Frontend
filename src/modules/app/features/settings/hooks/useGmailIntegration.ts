import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import {
    disconnectGmail,
    getGmailConnectUrl,
    getGmailStatus,
    syncGmail,
    type GmailSyncData,
} from "../settings.service";

import { useAuthStore } from "@/auth/authStore";

const gmailStatusQueryKey = ["gmail-integration-status"];

export const useGmailIntegration = () => {
    const user = useAuthStore((state) => state.user);
    const queryClient = useQueryClient();

    const statusQuery = useQuery({
        queryKey: gmailStatusQueryKey,
        queryFn: getGmailStatus,
        enabled: Boolean(user),
        staleTime: 1000 * 30,
    });

    const connect = useMutation({
        mutationFn: getGmailConnectUrl,
    });

    const sync = useMutation({
        mutationFn: (data?: GmailSyncData) => syncGmail(data),
    });

    const disconnect = useMutation({
        mutationFn: disconnectGmail,
        onSuccess: async () => {
            await queryClient.invalidateQueries({ queryKey: gmailStatusQueryKey });
        },
    });

    return {
        status: statusQuery.data?.data,
        isStatusLoading: statusQuery.isLoading,
        connect,
        sync,
        disconnect,
    };
};
