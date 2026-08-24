import {
    isUserAlreadyAuthenticatedError,
    resolveSession,
    syncAuthUser,
    getSessionTokens,
} from "@/auth/services/session.service";
import { authService } from "@/auth/services/authService";
import type { InternalUser } from "@/auth/InternalUser";

export { syncAuthUser } from "@/auth/services/session.service";

export const login = async (email: string, password: string) => {
    try {
        const result = await authService.login(email, password);

        if (!result.isSignedIn) {
            throw new Error(result.nextStep.signInStep);
        }
    } catch (error) {
        // Cognito ya tenía sesión (caso típico tras refresh sin bootstrap previo).
        // En vez de fallar, reconciliamos y devolvemos el perfil.
        if (!isUserAlreadyAuthenticatedError(error)) {
            throw error;
        }
    }

    const tokens = await getSessionTokens();

    if (!tokens) {
        throw new Error("Tokens not found");
    }

    return syncAuthUser(tokens.idToken, email);
};

/**
 * Si ya hay sesión Cognito, sincroniza y retorna el user (sin redirect).
 * Si no, inicia el OAuth de Google (navegación fuera de la app).
 */
export const loginWithGoogle = async (): Promise<InternalUser | void> => {
    const existingTokens = await getSessionTokens();

    if (existingTokens) {
        return syncAuthUser(existingTokens.idToken, existingTokens.email);
    }

    await authService.loginWithGoogle();
};

/** Re-export por si algún flujo necesita resolver sesión existente. */
export { resolveSession };
