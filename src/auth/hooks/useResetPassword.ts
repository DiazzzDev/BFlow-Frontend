import { useMutation } from "@tanstack/react-query";

import { authService } from "@/auth/services/authService";

interface ResetPasswordArgs {
  email: string;
  code: string;
  password: string;
}

export const useResetPassword = () => {
  return useMutation({
    mutationFn: ({ email, code, password }: ResetPasswordArgs) =>
      authService.confirmForgotPassword(email, code, password),
  });
};