import { useMutation } from "@tanstack/react-query";
import { authService } from "@/auth/services/authService";

interface RegisterArgs {
  email: string;
  password: string;
  fullName: string;
}

export const useRegister = () => {
  return useMutation({
    mutationFn: ({ email, password, fullName }: RegisterArgs) =>
      authService.register(email, password, fullName),
  });
};