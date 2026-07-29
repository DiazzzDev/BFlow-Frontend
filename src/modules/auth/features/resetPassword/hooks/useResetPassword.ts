import { useMutation } from "@tanstack/react-query";

import { resetPassword } from "../resetPassword.service";

interface ResetPasswordArgs {
    email: string;
    code: string;
    password: string;
}

export const useResetPassword = () => {
    return useMutation({
        mutationFn: (args: ResetPasswordArgs) => resetPassword(args),
    });
};
