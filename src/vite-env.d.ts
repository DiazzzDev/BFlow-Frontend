/// <reference types="vite/client" />

interface ImportMetaEnv {
    readonly VITE_API_URL: string;

    readonly VITE_COGNITO_ISSUER: string;

    readonly VITE_COGNITO_DOMAIN: string;

    readonly VITE_COGNITO_CLIENT_ID: string;

    readonly VITE_MCP_SERVER_URL?: string;
}

interface ImportMeta {
    readonly env: ImportMetaEnv;
}
