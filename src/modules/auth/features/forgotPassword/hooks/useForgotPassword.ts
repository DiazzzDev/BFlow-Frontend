import { useMutation } from "@tanstack/react-query";

import {
    forgotPassword,
    confirmForgotPasswordService,
} from "../forgotPassword.service";

export const useForgotPassword = () => {
    return useMutation({
        mutationFn: (email: string) => forgotPassword(email),
    });
};

interface ConfirmArgs {
    email: string;
    code: string;
    password: string;
}

export const useConfirmForgotPassword = () => {
    return useMutation({
        mutationFn: ({ email, code, password }: ConfirmArgs) =>
            confirmForgotPasswordService(email, code, password),
    });
};
