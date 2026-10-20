import { apiRequest } from "@/utils/api";
import { config } from "@/config/config";
import { authService } from "@/auth/services/authService";
import type {
    InternalUser,
    SubscriptionStatus,
    UserPlan,
    UserProfile,
} from "@/auth/InternalUser";
import { getDeletionScheduledAt } from "@/auth/utils/accountDeletion";
import { getBrowserLanguage, normalizeLanguage } from "@/i18n/types";

const AUTH_SYNC_URL = `${config.API_BASE_URL}/api/v1/auth/sync`;

const defaultApiOptions: RequestInit = {
    headers: { "Content-Type": "application/json" },
};

export type CognitoSessionTokens = {
    accessToken: string;
    idToken: string;
    email?: string;
};

export type SyncAuthResponse = {
    id: string;
    email: string;
    roles: string[];
    isNewUser: boolean;
    subscription?: {
        id: string;
        planName: string;
        status: SubscriptionStatus;
        billingAmount: number;
        startsAt: string;
        endsAt: string | null;
        nextBillingAt: string | null;
    } | null;
    plan?: UserPlan | null;
    wallets?: InternalUser["wallets"] | null;
    profile?: UserProfile | null;
    language?: string | null;
    preferredLanguage?: string | null;
    message?: string;
    status?: "ACTIVE" | "PENDING_DELETION" | "DELETED" | null;
    accountPendingDeletion?: boolean;
    deletionDaysRemaining?: number | null;
    deletedAt?: string | null;
    deletionScheduledAt?: string | null;
};

const mapSyncResponseToUser = (response: SyncAuthResponse): InternalUser => {
    const subscription = response.subscription ?? null;
    const plan = response.plan ?? null;
    const profile = response.profile ?? null;
    const status = profile?.status ?? response.status ?? "ACTIVE";
    const accountPendingDeletion =
        response.accountPendingDeletion ?? status === "PENDING_DELETION";

    return {
        id: response.id,
        email: response.email,
        roles: response.roles,
        isNewUser: response.isNewUser,
        name: profile?.name ?? null,
        pictureUrl: profile?.pictureUrl ?? null,
        language:
            normalizeLanguage(
                response.language ??
                response.preferredLanguage ??
                profile?.language ??
                profile?.preferredLanguage,
            ) ?? getBrowserLanguage(),
        serverMessage: response.message,
        subscription: {
            id: subscription?.id ?? null,
            planCode: plan?.planCode ?? subscription?.planName ?? "FREE",
            planName: plan?.planName ?? subscription?.planName ?? "Free",
            status: plan?.status ?? subscription?.status ?? null,
            billingAmount: subscription?.billingAmount ?? null,
            startsAt: subscription?.startsAt ?? null,
            endsAt: subscription?.endsAt ?? null,
            nextBillingAt: subscription?.nextBillingAt ?? null,
        },
        plan,
        wallets: response.wallets ?? [],
        profile,
        accountPendingDeletion,
        deletionDaysRemaining: response.deletionDaysRemaining ?? null,
        status,
        deletionScheduledAt:
            accountPendingDeletion || status === "DELETED"
                ? getDeletionScheduledAt(response.deletionScheduledAt, response.deletedAt)
                : null,
    };
};

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
