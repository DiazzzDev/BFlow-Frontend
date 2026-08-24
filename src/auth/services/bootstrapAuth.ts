import {
    getSessionTokens,
    syncAuthUser,
} from "@/auth/services/session.service";
import { authService } from "@/auth/services/authService";
import { useAuthStore } from "@/auth/authStore";

type BootstrapOptions = {
    signal?: AbortSignal;
};

const isAborted = (signal?: AbortSignal) => Boolean(signal?.aborted);

const isOAuthCallbackRoute = () =>
    window.location.pathname.startsWith("/auth/callback");

/**
 * Reconcilia Cognito (sesión real) con el store (perfil de app).
 * En `/auth/callback` no corre: ese flujo lo posee OAuthCallbackPage.
 */
export const bootstrapAuth = async (
    options: BootstrapOptions = {},
): Promise<void> => {
    const { signal } = options;
    const { setChecking, setSession, clearSession } = useAuthStore.getState();

    if (isOAuthCallbackRoute()) {
        // Dejamos authStatus en "checking" para que el callback termine el flujo.
        setChecking();
        return;
    }

    setChecking();

    try {
        const tokens = await getSessionTokens();

        if (isAborted(signal)) {
            return;
        }

        if (!tokens) {
            clearSession();
            return;
        }

        try {
            const user = await syncAuthUser(tokens.idToken, tokens.email);

            if (isAborted(signal)) {
                return;
            }

            setSession(user);
        } catch {
            if (isAborted(signal)) {
                return;
            }

            // Hay Cognito pero el backend no sincronizó: soltamos Cognito
            // para no dejar al usuario atrapado en AlreadyAuthenticated.
            try {
                await authService.logout();
            } catch {
                // ignore
            }

            if (isAborted(signal)) {
                return;
            }

            clearSession();
        }
    } catch {
        if (isAborted(signal)) {
            return;
        }

        clearSession();
    }
};
