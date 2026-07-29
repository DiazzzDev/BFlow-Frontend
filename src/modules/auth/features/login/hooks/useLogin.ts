import { useMutation } from "@tanstack/react-query";

import { login } from "../login.service";

import { useAuthStore } from "@/auth/authStore";

interface LoginArgs {
    email: string;
    password: string;
}

export const useLogin = () => {
    const setSession = useAuthStore((state) => state.setSession);

    return useMutation({
        mutationFn: ({ email, password }: LoginArgs) => login(email, password),
        onSuccess: (user) => {
            setSession(user);
        },
    });
};
