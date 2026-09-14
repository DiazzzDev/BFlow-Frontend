import { useMutation } from "@tanstack/react-query";

import { register } from "../register.service";

interface RegisterArgs {
    email: string;
    password: string;
    fullName: string;
}

// Cognito sign-up mutation (no session yet — email confirm may follow)
export const useRegister = () => {
    return useMutation({
        mutationFn: (args: RegisterArgs) => register(args),
    });
};
