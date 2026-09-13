import { useOAuthCallback } from "./hooks/useOAuthCallback";

export const OAuthCallbackPage = () => {
    // Kick off OAuth session sync on mount
    useOAuthCallback();

    return (
        <div className="flex h-screen items-center justify-center">
            Iniciando sesión...
        </div>
    );
};
