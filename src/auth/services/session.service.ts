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
    roles: response.roles ?? [],
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
 * Tras el redirect de Google, Amplify puede tardar un instante en
 * intercambiar el code por tokens. Reintenta antes de fallar.
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
 * Fuente de verdad: Cognito. Si hay tokens válidos, sincroniza el perfil
 * interno con el backend. Si no hay sesión Cognito, retorna null.
 */
export const resolveSession = async (): Promise<InternalUser | null> => {
    const tokens = await getSessionTokens();

    if (!tokens) {
        return null;
    }

    return syncAuthUser(tokens.idToken, tokens.email);
};
