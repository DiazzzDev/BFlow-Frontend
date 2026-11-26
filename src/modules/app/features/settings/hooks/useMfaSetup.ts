import { fetchMfaPreference, setUpTotp, verifyAndEnableTotp } from "@/auth/cognito/mfa";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { useAuthStore } from "@/auth/authStore";
import { config } from "@/config/config";

const mfaPreferenceQueryKey = ["mfa-preference"];

export const useMfaSetup = () => {
    const user = useAuthStore((state) => state.user);
    const queryClient = useQueryClient();
    const preferenceQuery = useQuery({
        queryKey: mfaPreferenceQueryKey,
        queryFn: fetchMfaPreference,
        enabled: Boolean(user),
        staleTime: 1000 * 60,
    });

    const setUp = useMutation({
        mutationFn: setUpTotp,
    });

    const verify = useMutation({
        mutationFn: async (code: string) => {
            await verifyAndEnableTotp(code);
        },
        onSuccess: async () => {
            await queryClient.invalidateQueries({ queryKey: mfaPreferenceQueryKey });
        },
    });

    return {
        isMfaSelfServiceEnabled: config.COGNITO_SELF_SERVICE_MFA_ENABLED,
        isMfaEnabled: preferenceQuery.data?.enabled?.includes("SOFTWARE_TOKEN_MFA") ?? false,
        mfaMethods: preferenceQuery.data?.enabled ?? [],
        isMfaStatusLoading: preferenceQuery.isLoading,
        setUp,
        verify,
    };
};
