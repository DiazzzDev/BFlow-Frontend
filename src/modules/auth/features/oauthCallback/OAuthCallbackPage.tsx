import { useOAuthCallback } from "./hooks/useOAuthCallback";

export const OAuthCallbackPage = () => {
    useOAuthCallback();

    return (
        <div className="flex h-screen items-center justify-center">
            Iniciando sesión...
        </div>
    );
};
