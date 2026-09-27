/// <reference types="vite/client" />

interface ImportMetaEnv {
    readonly VITE_API_URL: string;

    readonly VITE_COGNITO_ISSUER: string;

    readonly VITE_COGNITO_DOMAIN: string;

    readonly VITE_COGNITO_CLIENT_ID: string;

    readonly VITE_MCP_SERVER_URL?: string;

    readonly VITE_FIREBASE_ENABLED?: string;
    readonly VITE_FIREBASE_API_KEY?: string;
    readonly VITE_FIREBASE_AUTH_DOMAIN?: string;
    readonly VITE_FIREBASE_PROJECT_ID?: string;
    readonly VITE_FIREBASE_STORAGE_BUCKET?: string;
    readonly VITE_FIREBASE_MESSAGING_SENDER_ID?: string;
    readonly VITE_FIREBASE_APP_ID?: string;
    readonly VITE_FIREBASE_VAPID_KEY?: string;
}

interface ImportMeta {
    readonly env: ImportMetaEnv;
}
