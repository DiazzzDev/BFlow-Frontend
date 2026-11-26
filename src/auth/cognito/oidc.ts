import { config } from "@/config/config";

export type CognitoTokens = { accessToken: string; idToken: string; refreshToken?: string };

const keys = { state: "bflow.oidc.state", verifier: "bflow.oidc.verifier", transaction: "bflow.oidc.transaction", tokens: "bflow.oidc.tokens" };
const TRANSACTION_TTL_MS = 10 * 60 * 1000;
const configurationError = "Cognito no está configurado para este entorno. Configura las variables VITE_COGNITO_* antes de iniciar sesión.";
const domain = () => {
    const value = config.COGNITO_DOMAIN.replace(/\/$/, "");
    if (!/^https:\/\/[^/]+$/i.test(value)) throw new Error(configurationError);
    return value;
};
const assertOAuthConfiguration = () => {
    if (!config.COGNITO_CLIENT_ID || !config.VITE_COGNITO_REDIRECT_SIGN_IN) throw new Error(configurationError);
    domain();
};
const authorizationScope = () => [
    "openid",
    "email",
    "profile",
    ...(config.COGNITO_SELF_SERVICE_MFA_ENABLED ? ["aws.cognito.signin.user.admin"] : []),
].join(" ");
const b64 = (bytes: Uint8Array) => btoa(String.fromCharCode(...bytes)).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
const random = () => { const bytes = new Uint8Array(32); crypto.getRandomValues(bytes); return b64(bytes); };

type OAuthTransaction = { state: string; verifier: string; createdAt: number };
const saveTransaction = (transaction: OAuthTransaction) => {
    sessionStorage.setItem(keys.state, transaction.state);
    sessionStorage.setItem(keys.verifier, transaction.verifier);
    // Cognito normally returns in the same tab. This short-lived backup covers
    // browsers that restore the callback in a new tab without persisting sessionStorage.
    localStorage.setItem(keys.transaction, JSON.stringify(transaction));
};
const readTransaction = (): OAuthTransaction | null => {
    const state = sessionStorage.getItem(keys.state); const verifier = sessionStorage.getItem(keys.verifier);
    if (state && verifier) return { state, verifier, createdAt: Date.now() };
    try {
        const value = JSON.parse(localStorage.getItem(keys.transaction) ?? "") as OAuthTransaction;
        return value.state && value.verifier && Date.now() - value.createdAt <= TRANSACTION_TTL_MS ? value : null;
    } catch { return null; }
};
const clearTransaction = () => { sessionStorage.removeItem(keys.state); sessionStorage.removeItem(keys.verifier); localStorage.removeItem(keys.transaction); };

export const beginAuthorization = async (provider?: string) => {
    assertOAuthConfiguration();
    const state = random(); const verifier = random();
    const digest = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(verifier));
    saveTransaction({ state, verifier, createdAt: Date.now() });
    const query = new URLSearchParams({ client_id: config.COGNITO_CLIENT_ID, response_type: "code", scope: authorizationScope(), redirect_uri: config.VITE_COGNITO_REDIRECT_SIGN_IN, state, code_challenge: b64(new Uint8Array(digest)), code_challenge_method: "S256" });
    if (provider) query.set("identity_provider", provider);
    window.location.assign(`${domain()}/oauth2/authorize?${query.toString()}`);
};

export const exchangeAuthorizationCode = async (): Promise<CognitoTokens> => {
    assertOAuthConfiguration();
    const query = new URLSearchParams(window.location.search); const code = query.get("code"); const state = query.get("state");
    const authorizationError = query.get("error");
    const authorizationErrorDescription = query.get("error_description");
    const transaction = readTransaction();
    if (authorizationError) throw new Error(authorizationErrorDescription ?? `Cognito authorization failed: ${authorizationError}`);
    if (!code || !transaction || state !== transaction.state) throw new Error("Invalid Cognito callback. Start the sign-in flow again from this browser tab.");
    const response = await fetch(`${domain()}/oauth2/token`, { method: "POST", headers: { "Content-Type": "application/x-www-form-urlencoded" }, body: new URLSearchParams({ grant_type: "authorization_code", client_id: config.COGNITO_CLIENT_ID, redirect_uri: config.VITE_COGNITO_REDIRECT_SIGN_IN, code, code_verifier: transaction.verifier }) });
    if (!response.ok) throw new Error("Cognito token exchange failed.");
    const payload = await response.json() as { access_token?: string; id_token?: string; refresh_token?: string };
    if (!payload.access_token || !payload.id_token) throw new Error("Cognito returned incomplete tokens.");
    const tokens = { accessToken: payload.access_token, idToken: payload.id_token, refreshToken: payload.refresh_token };
    sessionStorage.setItem(keys.tokens, JSON.stringify(tokens)); clearTransaction(); return tokens;
};

export const getStoredCognitoTokens = (): CognitoTokens | null => {
    const raw = sessionStorage.getItem(keys.tokens);
    if (!raw) return null;
    try { return JSON.parse(raw) as CognitoTokens; } catch { sessionStorage.removeItem(keys.tokens); return null; }
};

export const clearStoredCognitoTokens = () => sessionStorage.removeItem(keys.tokens);

const decodeJwtPayload = (token: string): Record<string, unknown> | null => {
    try { const encoded = token.split(".")[1]; return encoded ? JSON.parse(atob(encoded.replace(/-/g, "+").replace(/_/g, "/"))) as Record<string, unknown> : null; } catch { return null; }
};
const isExpiring = (token: string) => { const exp = decodeJwtPayload(token)?.exp; return typeof exp !== "number" || exp * 1000 < Date.now() + 30_000; };

export const getCognitoTokens = async (): Promise<CognitoTokens | null> => {
    const tokens = getStoredCognitoTokens();
    if (!tokens || !isExpiring(tokens.accessToken)) return tokens;
    if (!tokens.refreshToken) { clearStoredCognitoTokens(); return null; }
    const response = await fetch(`${domain()}/oauth2/token`, { method: "POST", headers: { "Content-Type": "application/x-www-form-urlencoded" }, body: new URLSearchParams({ grant_type: "refresh_token", client_id: config.COGNITO_CLIENT_ID, refresh_token: tokens.refreshToken }) });
    if (!response.ok) { clearStoredCognitoTokens(); return null; }
    const payload = await response.json() as { access_token?: string; id_token?: string; refresh_token?: string };
    if (!payload.access_token || !payload.id_token) { clearStoredCognitoTokens(); return null; }
    const renewed = { accessToken: payload.access_token, idToken: payload.id_token, refreshToken: payload.refresh_token ?? tokens.refreshToken };
    sessionStorage.setItem(keys.tokens, JSON.stringify(renewed)); return renewed;
};

export const getIdTokenClaims = () => { const tokens = getStoredCognitoTokens(); return tokens ? decodeJwtPayload(tokens.idToken) : null; };
export const isFederatedIdentity = () => { const identities = getIdTokenClaims()?.identities; return Array.isArray(identities) && identities.length > 0; };
export const beginHostedPage = (page: "login" | "signup" | "forgotPassword") => {
    assertOAuthConfiguration();
    const query = new URLSearchParams({ client_id: config.COGNITO_CLIENT_ID, response_type: "code", scope: authorizationScope(), redirect_uri: config.VITE_COGNITO_REDIRECT_SIGN_IN });
    window.location.assign(`${domain()}/${page}?${query.toString()}`);
};
export const beginLogout = () => { assertOAuthConfiguration(); clearStoredCognitoTokens(); const query = new URLSearchParams({ client_id: config.COGNITO_CLIENT_ID, logout_uri: config.VITE_COGNITO_REDIRECT_SIGN_OUT }); window.location.assign(`${domain()}/logout?${query.toString()}`); };
