import { useMutation } from "@tanstack/react-query";

import { register } from "../register.service";

interface RegisterArgs {
    email: string;
    password: string;
    fullName: string;
}

export const useRegister = () => {
    return useMutation({
        mutationFn: (args: RegisterArgs) => register(args),
    });
};
