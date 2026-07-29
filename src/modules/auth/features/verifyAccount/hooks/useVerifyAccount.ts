import { useMutation } from "@tanstack/react-query";

import { verifyAccount } from "../verifyAccount.service";

interface VerifyAccountArgs {
    email: string;
    code: string;
}

export const useVerifyAccount = () => {
    return useMutation({
        mutationFn: (args: VerifyAccountArgs) => verifyAccount(args),
    });
};
