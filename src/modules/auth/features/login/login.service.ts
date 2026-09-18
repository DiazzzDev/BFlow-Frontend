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
        // Cognito already had a session (typical after refresh without prior bootstrap).
        // Reconcile and return the profile instead of failing.
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
 * If a Cognito session already exists, sync and return the user (no redirect).
 * Otherwise start Google OAuth (navigates away from the app).
 */
export const loginWithGoogle = async (): Promise<InternalUser | void> => {
    const existingTokens = await getSessionTokens();

    if (existingTokens) {
        return syncAuthUser(existingTokens.idToken, existingTokens.email);
    }

    await authService.loginWithGoogle();
};

/** Re-export for flows that need to resolve an existing session. */
export { resolveSession };
