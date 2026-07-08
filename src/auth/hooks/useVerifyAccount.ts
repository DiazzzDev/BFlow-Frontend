import { useMutation } from "@tanstack/react-query";
import { authService } from "@/auth/services/authService";

interface VerifyAccountArgs {
  email: string;
  code: string;
}

export const useVerifyAccount = () => {
  return useMutation({
    mutationFn: ({ email, code }: VerifyAccountArgs) => 
      authService.confirmRegister(email, code),
  });
};