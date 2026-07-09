import { useMutation } from "@tanstack/react-query";

import { authService } from "@/auth/services/authService";

export const useGoogleLogin = () => {
  return useMutation({
    mutationFn: () => authService.loginWithGoogle(),
  });
};