import { exchangeAuthorizationCode } from "@/auth/cognito/oidc";
import { syncAuthUser } from "@/auth/services/session.service";
import type { InternalUser } from "@/auth/InternalUser";
import { confirmPendingLoginMethod } from "@/auth/utils/lastUsedLoginMethod";

// Wait for Cognito tokens after redirect, then sync user with the API
export const completeOAuthLogin = async (): Promise<InternalUser> => {
    const tokens = await exchangeAuthorizationCode();

    const user = await syncAuthUser(tokens.idToken);
    confirmPendingLoginMethod();
    return user;
};
