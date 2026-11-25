import { useMutation } from "@tanstack/react-query";

import { authService } from "@/auth/services/authService";

interface ChangePasswordArgs {
    currentPassword: string;
    newPassword: string;
}

export const useChangePassword = () => {
    return useMutation({
        mutationFn: ({ currentPassword, newPassword }: ChangePasswordArgs) =>
            authService.changePassword(currentPassword, newPassword),
    });
};
