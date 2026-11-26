import { cognitoRequest } from "@/auth/cognito/client";
import { beginAuthorization, beginHostedPage, beginLogout, getCognitoTokens, getIdTokenClaims, isFederatedIdentity } from "@/auth/cognito/oidc";
import { assertEmailActionAllowed } from "@/auth/utils/emailActionRateLimit";
import { markPendingLoginMethod } from "@/auth/utils/lastUsedLoginMethod";
import { config } from "@/config/config";

type AuthenticationResult = { AccessToken?: string; IdToken?: string; RefreshToken?: string };
const clientId = config.COGNITO_CLIENT_ID;
const saveTokens = (result: AuthenticationResult) => {
    if (!result.AccessToken || !result.IdToken) throw new Error("Cognito returned incomplete tokens.");
    sessionStorage.setItem("bflow.oidc.tokens", JSON.stringify({ accessToken: result.AccessToken, idToken: result.IdToken, refreshToken: result.RefreshToken }));
};

export const authService = {
    async login(email: string, password: string) {
        const result = await cognitoRequest<{ AuthenticationResult?: AuthenticationResult; ChallengeName?: string }>("InitiateAuth", { AuthFlow: "USER_PASSWORD_AUTH", ClientId: clientId, AuthParameters: { USERNAME: email.trim().toLowerCase(), PASSWORD: password } });
        if (result.ChallengeName) throw new Error(`Cognito challenge required: ${result.ChallengeName}`);
        saveTokens(result.AuthenticationResult ?? {});
    },
    async logout() { beginLogout(); },
    async getSession() {
        const tokens = await getCognitoTokens();
        if (!tokens) return { tokens: undefined };
        return { tokens: { accessToken: { toString: () => tokens.accessToken }, idToken: { toString: () => tokens.idToken, payload: getIdTokenClaims() ?? {} } } };
    },
    async getCurrentUser() {
        const tokens = await getCognitoTokens(); if (!tokens) throw new Error("No active Cognito session.");
        const claims = getIdTokenClaims(); return { username: String(claims?.["cognito:username"] ?? claims?.sub ?? ""), userId: String(claims?.sub ?? "") };
    },
    async canChangePassword() { return Boolean(await getCognitoTokens()) && !isFederatedIdentity(); },
    async forgotPassword(email: string) { const username = email.trim().toLowerCase(); assertEmailActionAllowed("password-reset", username); return cognitoRequest("ForgotPassword", { ClientId: clientId, Username: username }); },
    async confirmForgotPassword(email: string, code: string, password: string) { return cognitoRequest("ConfirmForgotPassword", { ClientId: clientId, Username: email.trim().toLowerCase(), ConfirmationCode: code.trim(), Password: password }); },
    async changePassword(currentPassword: string, newPassword: string) {
        const tokens = await getCognitoTokens(); if (!tokens) throw new Error("No active Cognito session.");
        if (isFederatedIdentity()) throw new Error("Federated users manage passwords with their identity provider.");
        return cognitoRequest("ChangePassword", { AccessToken: tokens.accessToken, PreviousPassword: currentPassword, ProposedPassword: newPassword });
    },
    async register(email: string, password: string, fullName: string) {
        const username = email.trim().toLowerCase(); assertEmailActionAllowed("signup", username);
        return cognitoRequest<{ UserConfirmed?: boolean }>("SignUp", { ClientId: clientId, Username: username, Password: password, UserAttributes: [{ Name: "email", Value: username }, { Name: "name", Value: fullName.trim() }] });
    },
    async confirmRegister(email: string, code: string) { return cognitoRequest("ConfirmSignUp", { ClientId: clientId, Username: email.trim().toLowerCase(), ConfirmationCode: code.trim() }); },
    async resendCode(email: string) { const username = email.trim().toLowerCase(); assertEmailActionAllowed("verification-resend", username); return cognitoRequest("ResendConfirmationCode", { ClientId: clientId, Username: username }); },
    async loginWithGoogle() { markPendingLoginMethod("Google"); await beginAuthorization("Google"); },
    async openManagedLogin() { beginHostedPage("login"); },
};
