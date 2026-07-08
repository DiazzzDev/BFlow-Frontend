import { useMutation } from "@tanstack/react-query";
import { authService } from "@/auth/services/authService";

export const useForgotPassword = () => {
  return useMutation({
    mutationFn: (email: string) => authService.forgotPassword(email),
  });
};