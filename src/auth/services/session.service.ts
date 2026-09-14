import { apiRequest } from "@/utils/api";
import { config } from "@/config/config";
import { authService } from "@/auth/services/authService";
import type { InternalUser, UserProfile } from "@/auth/InternalUser";

const AUTH_SYNC_URL = `${config.API_BASE_URL}/api/v1/auth/sync`;

const defaultApiOptions: RequestInit = {
    headers: { "Content-Type": "application/json" },
};

export type CognitoSessionTokens = {
    accessToken: string;
    idToken: string;
    email?: string;
};

type SyncAuthResponse = {
    id: string;
    email: string;
    roles: string[];
    isNewUser: boolean;
    subscription?: unknown;
    wallets?: unknown[];
    profile?: UserProfile | null;
};

const mapSyncResponseToUser = (response: SyncAuthResponse): InternalUser => ({
    id: response.id,
    email: response.email,
    roles: response.roles,
    isNewUser: response.isNewUser,
    name: response.profile?.name ?? null,
    pictureUrl: response.profile?.pictureUrl ?? null,
});

export const isUserAlreadyAuthenticatedError = (error: unknown): boolean => {
    if (typeof error !== "object" || error === null || !("name" in error)) {
        return false;
    }

    return (error as { name: string }).name === "UserAlreadyAuthenticatedException";
};

export const syncAuthUser = async (idToken: string, email?: string) => {
    const response = await apiRequest<SyncAuthResponse>(
        AUTH_SYNC_URL,
        {
            ...defaultApiOptions,
            method: "POST",
            body: JSON.stringify(email ? { idToken, email } : { idToken }),
        },
        "Error al sincronizar el usuario",
    );

    return mapSyncResponseToUser(response);
};

export const getSessionTokens = async (): Promise<CognitoSessionTokens | null> => {
    const session = await authService.getSession();
    const accessToken = session.tokens?.accessToken.toString();
    const idToken = session.tokens?.idToken?.toString();

    if (!accessToken || !idToken) {
        return null;
    }

    const emailClaim = session.tokens?.idToken?.payload.email;
    const email = typeof emailClaim === "string" ? emailClaim : undefined;

    return { accessToken, idToken, email };
};

/**
 * After the Google redirect, Amplify may need a moment to exchange the
 * code for tokens. Retries before failing.
 */
export const waitForSessionTokens = async (
    attempts = 15,
    delayMs = 200,
): Promise<CognitoSessionTokens | null> => {
    for (let attempt = 0; attempt < attempts; attempt += 1) {
        const tokens = await getSessionTokens();

        if (tokens) {
            return tokens;
        }

        if (attempt < attempts - 1) {
            await new Promise((resolve) => {
                setTimeout(resolve, delayMs);
            });
        }
    }

    return null;
};

/**
 * Source of truth: Cognito. With valid tokens, syncs the internal profile
 * with the backend. With no Cognito session, returns null.
 */
export const resolveSession = async (): Promise<InternalUser | null> => {
    const tokens = await getSessionTokens();

    if (!tokens) {
        return null;
    }

    return syncAuthUser(tokens.idToken, tokens.email);
};
