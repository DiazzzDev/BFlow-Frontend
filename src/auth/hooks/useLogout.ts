import { useMutation, useQueryClient } from "@tanstack/react-query";

import { authService } from "@/auth/services/authService";
import { useAuthStore } from "@/auth/authStore";

export const useLogout = () => {
	const clearUser = useAuthStore((state) => state.clearUser);
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: async () => {
			// 1. Cerramos sesión en AWS Amplify
			await authService.logout();
		},
		// Usamos 'onSettled' para asegurar que el estado se limpie pase lo que pase
		// (incluso si la petición de AWS Amplify llegara a fallar por falta de red)
		onSettled: () => {
			// 2. Limpiamos el store global de Zustand (esto vacía el localStorage automáticamente)
			clearUser();

			// 3. Opcional pero muy recomendado: Limpiamos TODA la caché de TanStack Query
			// Esto evita que queden datos de perfiles, estudios, etc., en memoria de la app
			queryClient.clear();
		},
	});
};