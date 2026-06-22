export const config = { 
    API_BASE_URL: String(import.meta.env.VITE_API_URL),

    COGNITO_ISSUER: String(import.meta.env.VITE_COGNITO_ISSUER),

    COGNITO_DOMAIN: String(import.meta.env.VITE_COGNITO_DOMAIN),

    COGNITO_CLIENT_ID: String(import.meta.env.VITE_COGNITO_CLIENT_ID),
};