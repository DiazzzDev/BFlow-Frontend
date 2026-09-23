const DEFAULT_WOMPI_PRO_MONTHLY_PLAN_ID =
    "cc555789-a008-42b0-bd2b-4675e408bd2b";

export const config = { 
    API_BASE_URL: String(import.meta.env.VITE_API_URL),

    COGNITO_ISSUER: String(import.meta.env.VITE_COGNITO_ISSUER),

    COGNITO_DOMAIN: String(import.meta.env.VITE_COGNITO_DOMAIN),

    COGNITO_CLIENT_ID: String(import.meta.env.VITE_COGNITO_CLIENT_ID),

    VITE_COGNITO_REDIRECT_SIGN_OUT: String(import.meta.env.VITE_COGNITO_REDIRECT_SIGN_OUT),

    VITE_COGNITO_REDIRECT_SIGN_IN: String(import.meta.env.VITE_COGNITO_REDIRECT_SIGN_IN),
    
    VITE_COGNITO_USER_POOL_ID: String(import.meta.env.VITE_COGNITO_USER_POOL_ID),

    MCP_SERVER_URL: import.meta.env.VITE_MCP_SERVER_URL?.trim() ?? "",

    WOMPI_PRO_MONTHLY_PLAN_ID:
        String(
            import.meta.env.VITE_WOMPI_PRO_MONTHLY_PLAN_ID ||
                DEFAULT_WOMPI_PRO_MONTHLY_PLAN_ID,
        ).trim(),

    WOMPI_PRO_YEARLY_PLAN_ID:
        String(import.meta.env.VITE_WOMPI_PRO_YEARLY_PLAN_ID ?? "").trim(),
};
