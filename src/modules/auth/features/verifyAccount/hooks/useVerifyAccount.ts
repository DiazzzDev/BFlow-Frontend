import { useMutation } from "@tanstack/react-query";

import { verifyAccount, resendVerificationCode } from "../verifyAccount.service";

interface VerifyAccountArgs {
    email: string;
    code: string;
}

export const useVerifyAccount = () => {
    return useMutation({
        mutationFn: (args: VerifyAccountArgs) => verifyAccount(args),
    });
};

export const useResendCode = () => {
    return useMutation({
        mutationFn: (email: string) => resendVerificationCode(email),
    });
};
