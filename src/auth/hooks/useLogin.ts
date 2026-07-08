import { useMutation } from "@tanstack/react-query";
import { authService } from "@/auth/services/authService";
import { useAuthStore } from "@/auth/authStore";
import type { InternalUser } from "@/auth/InternalUser";
import { config } from "@/config/config";
import { apiRequest } from "../../utils/api";

interface LoginArgs {
  email: string;
  password: string;
}

export const useLogin = () => {
  const setUser = useAuthStore((state) => state.setUser);

  return useMutation({
    mutationFn: async ({ email, password }: LoginArgs) => {
      const result = await authService.login(email, password);

      if (!result.isSignedIn) {
        throw new Error(result.nextStep.signInStep);
      }

      const session = await authService.getSession();
      const accessToken = session.tokens?.accessToken.toString();
      const idToken = session.tokens?.idToken?.toString();

      if (!accessToken || !idToken) {
        throw new Error("Tokens not found");
      }

      const url = `${config.API_BASE_URL}/api/v1/auth/sync`;
      
      const user = await apiRequest<InternalUser>(
        url,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ idToken, email }),
        },
        "Error al sincronizar el usuario"
      );

      return user;
    },

    // Mantenemos esto aquí para que Zustand siempre se actualice automáticamente
    onSuccess: (user) => {
      setUser(user);
    },
  });
};