import { useMutation } from "@tanstack/react-query";

import { useAuthStore } from "@/auth/authStore";

import { verifyAccount, resendVerificationCode } from "../verifyAccount.service";

/* eslint-disable @typescript-eslint/no-unnecessary-condition -- The API client can return no user during verification edge cases. */

interface VerifyAccountArgs {
    email: string;
    code: string;
}

export const useVerifyAccount = () => {
    const setSession = useAuthStore((state) => state.setSession);

    return useMutation({
        mutationFn: (args: VerifyAccountArgs) => verifyAccount(args),
        onSuccess: (user) => {
            if (user) {
                setSession(user);
            }
        },
    });
};

export const useResendCode = () => {
    return useMutation({
        mutationFn: (email: string) => resendVerificationCode(email),
    });
};
