import {
    isUserAlreadyAuthenticatedError,
    resolveSession,
    syncAuthUser,
    getSessionTokens,
} from "@/auth/services/session.service";
import { authService } from "@/auth/services/authService";
import type { InternalUser } from "@/auth/InternalUser";
import { recordEmailLogin } from "@/auth/utils/lastUsedLoginMethod";

export { syncAuthUser } from "@/auth/services/session.service";

export class UserNotConfirmedError extends Error {
    email: string;

    constructor(email: string, message = "Tu correo electrónico aún no ha sido verificado.") {
        super(message);
        this.name = "UserNotConfirmedError";
        this.email = email;
    }
}

export const isUserNotConfirmedError = (error: unknown): boolean => {
    if (error instanceof UserNotConfirmedError) {
        return true;
    }
    if (typeof error === "object" && error !== null && "name" in error) {
        const { name } = error as { name: string };
        if (name === "UserNotConfirmedException" || name === "UserNotConfirmedError") {
            return true;
        }
    }
    if (error instanceof Error && /not confirmed|CONFIRM_SIGN_UP/i.test(error.message)) {
        return true;
    }
    return false;
};

export const login = async (email: string, password: string) => {
    try { await authService.login(email, password); } catch (error) {
        if (isUserNotConfirmedError(error)) {
            throw new UserNotConfirmedError(email);
        }
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

    const user = await syncAuthUser(tokens.idToken, email);
    recordEmailLogin();
    return user;
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
