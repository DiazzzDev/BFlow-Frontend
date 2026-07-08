import { useQuery } from "@tanstack/react-query";
import { authService } from "@/auth/services/authService";

export const useSession = () => {
  return useQuery({
    // Llave única para identificar la sesión en la caché de TanStack
    queryKey: ["auth-session"],
    
    queryFn: async () => {
      // Usamos el método de tu servicio centralizado
      const session = await authService.getSession();
      
      // Validamos si existe el accessToken y retornamos un booleano puro
      return !!session.tokens?.accessToken;
    },

    // Configuración de optimización para la sesión:
    staleTime: 1000 * 60 * 5, // Considera la sesión "fresca" por 5 minutos antes de volver a validar de fondo
    gcTime: 1000 * 60 * 30,    // Mantiene el valor en memoria por 30 minutos (antiguo cacheTime)
    retry: false,              // Si falla (usuario no logueado), no reintentes la petición para evitar bucles
  });
};