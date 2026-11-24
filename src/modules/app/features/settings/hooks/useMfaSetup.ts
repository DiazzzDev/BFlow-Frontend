import {
    fetchMFAPreference,
    setUpTOTP,
    updateMFAPreference,
    verifyTOTPSetup,
} from "aws-amplify/auth";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { useAuthStore } from "@/auth/authStore";

const mfaPreferenceQueryKey = ["mfa-preference"];

export const useMfaSetup = () => {
    const user = useAuthStore((state) => state.user);
    const queryClient = useQueryClient();
    const preferenceQuery = useQuery({
        queryKey: mfaPreferenceQueryKey,
        queryFn: fetchMFAPreference,
        enabled: Boolean(user),
        staleTime: 1000 * 60,
    });

    const setUp = useMutation({
        mutationFn: setUpTOTP,
    });

    const verify = useMutation({
        mutationFn: async (code: string) => {
            await verifyTOTPSetup({ code });
            await updateMFAPreference({ totp: "PREFERRED" });
        },
        onSuccess: async () => {
            await queryClient.invalidateQueries({ queryKey: mfaPreferenceQueryKey });
        },
    });

    return {
        isMfaEnabled: preferenceQuery.data?.enabled?.includes("TOTP") ?? false,
        isMfaStatusLoading: preferenceQuery.isLoading,
        setUp,
        verify,
    };
};
