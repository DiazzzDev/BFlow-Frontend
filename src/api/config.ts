export const config = { 
    API_BASE_URL: String(import.meta.env.VITE_API_URL),

    COGNITO_ISSUER: String(import.meta.env.VITE_COGNITO_ISSUER),

    COGNITO_DOMAIN: String(import.meta.env.VITE_COGNITO_DOMAIN),

    COGNITO_CLIENT_ID: String(import.meta.env.VITE_COGNITO_CLIENT_ID),

    VITE_COGNITO_REDIRECT_SIGN_OUT: String(import.meta.env.VITE_COGNITO_REDIRECT_SIGN_OUT),

    VITE_COGNITO_REDIRECT_SIGN_IN: String(import.meta.env.VITE_COGNITO_REDIRECT_SIGN_IN),
    
    VITE_COGNITO_USER_POOL_ID: String(import.meta.env.VITE_COGNITO_USER_POOL_ID),
};