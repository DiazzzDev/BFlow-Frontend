const env = (name: string) => (import.meta.env[name] as string | undefined)?.trim() ?? "";
const enabled = (name: string) => env(name).toLowerCase() === "true";

export const config = {
    API_BASE_URL: env("VITE_API_URL"),
    COGNITO_ISSUER: env("VITE_COGNITO_ISSUER"),
    COGNITO_DOMAIN: env("VITE_COGNITO_DOMAIN"),
    COGNITO_CLIENT_ID: env("VITE_COGNITO_CLIENT_ID"),
    VITE_COGNITO_REDIRECT_SIGN_OUT: env("VITE_COGNITO_REDIRECT_SIGN_OUT"),
    VITE_COGNITO_REDIRECT_SIGN_IN: env("VITE_COGNITO_REDIRECT_SIGN_IN"),
    VITE_COGNITO_USER_POOL_ID: env("VITE_COGNITO_USER_POOL_ID"),
    COGNITO_SELF_SERVICE_MFA_ENABLED: enabled("VITE_COGNITO_SELF_SERVICE_MFA_ENABLED"),

    MCP_SERVER_URL: import.meta.env.VITE_MCP_SERVER_URL?.trim() ?? "",
};
