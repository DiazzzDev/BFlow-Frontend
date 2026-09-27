export const config = { 
    API_BASE_URL: String(import.meta.env.VITE_API_URL),

    COGNITO_ISSUER: String(import.meta.env.VITE_COGNITO_ISSUER),

    COGNITO_DOMAIN: String(import.meta.env.VITE_COGNITO_DOMAIN),

    COGNITO_CLIENT_ID: String(import.meta.env.VITE_COGNITO_CLIENT_ID),

    VITE_COGNITO_REDIRECT_SIGN_OUT: String(import.meta.env.VITE_COGNITO_REDIRECT_SIGN_OUT ?? ""),

    VITE_COGNITO_REDIRECT_SIGN_IN: String(import.meta.env.VITE_COGNITO_REDIRECT_SIGN_IN ?? ""),
    
    VITE_COGNITO_USER_POOL_ID: String(import.meta.env.VITE_COGNITO_USER_POOL_ID ?? ""),

    FIREBASE_ENABLED: import.meta.env.VITE_FIREBASE_ENABLED === "true",

    FIREBASE_API_KEY: String(import.meta.env.VITE_FIREBASE_API_KEY ?? ""),

    FIREBASE_AUTH_DOMAIN: String(
        import.meta.env.VITE_FIREBASE_AUTH_DOMAIN ?? "",
    ),

    FIREBASE_PROJECT_ID: String(
        import.meta.env.VITE_FIREBASE_PROJECT_ID ?? "",
    ),

    FIREBASE_STORAGE_BUCKET: String(
        import.meta.env.VITE_FIREBASE_STORAGE_BUCKET ?? "",
    ),

    FIREBASE_MESSAGING_SENDER_ID: String(
        import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID ?? "",
    ),

    FIREBASE_APP_ID: String(import.meta.env.VITE_FIREBASE_APP_ID ?? ""),

    FIREBASE_VAPID_KEY: String(import.meta.env.VITE_FIREBASE_VAPID_KEY ?? ""),

    MCP_SERVER_URL: String(
        import.meta.env.VITE_MCP_SERVER_URL ?? "",
    ).trim(),
};
