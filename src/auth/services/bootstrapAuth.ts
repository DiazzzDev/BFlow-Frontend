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
 * Reconciles Cognito (real session) with the store (app profile).
 * Skips `/auth/callback` — that flow is owned by OAuthCallbackPage.
 */
export const bootstrapAuth = async (
    options: BootstrapOptions = {},
): Promise<void> => {
    const { signal } = options;
    const { setChecking, setSession, clearSession } = useAuthStore.getState();

    if (isOAuthCallbackRoute()) {
        // Keep authStatus as "checking" so the callback can finish the flow.
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

            // Cognito session exists but backend sync failed: sign out Cognito
            // so the user is not stuck on AlreadyAuthenticated.
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
