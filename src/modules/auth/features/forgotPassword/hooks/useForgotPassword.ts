import { useMutation } from "@tanstack/react-query";

import { forgotPassword } from "../forgotPassword.service";

export const useForgotPassword = () => {
    return useMutation({
        mutationFn: (email: string) => forgotPassword(email),
    });
};
