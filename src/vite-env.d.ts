/// <reference types="vite/client" />

interface ImportMetaEnv {
    readonly VITE_API_URL: string;

    readonly VITE_COGNITO_ISSUER: string;

    readonly VITE_COGNITO_DOMAIN: string;

    readonly VITE_COGNITO_CLIENT_ID: string;
}

interface ImportMeta {
    readonly env: ImportMetaEnv;
}