import { create } from 'zustand';
import { toast } from 'react-toastify';

import { getAuthMe, logout as logoutService } from './auth.service.ts';
import { UserInfo } from './auth.ts';

interface AuthState {
    user: UserInfo | null;
    isInitializing: boolean;
    isAuthenticated: boolean;
    checkAuth: () => Promise<void>;
    logout: () => Promise<void>;
}

export const useAuthStore = create<AuthState>()(
    (set) => ({
        user: null,
        isInitializing: true,
        isAuthenticated: false,

        checkAuth: async () => {
            try {
                const userData = await getAuthMe();
                set({
                    user: userData.data,
                    isInitializing: false,
                    isAuthenticated: true
                });
            } catch (error) {
                console.error('Error checking auth:', error);
                set({
                    user: null,
                    isInitializing: false,
                    isAuthenticated: false
                });
            }
        },

        logout: async () => {
            try {
                await toast.promise(
                    logoutService(),
                    {
                        pending: 'Cerrando sesión...',
                        success: 'Sesión cerrada exitosamente',
                        error: 'Error al cerrar sesión'
                    }
                );
            } catch (error) {
                console.warn(error);
            }

            set({
                user: null,
                isAuthenticated: false,
                isInitializing: false
            });
        }
    })

);