import { useOAuthCallback } from "./hooks/useOAuthCallback";

import { AuthLoadingScreen } from "@/auth/components/AuthLoadingScreen";

export const OAuthCallbackPage = () => {
    // Kick off OAuth session sync on mount
    useOAuthCallback();

    return <AuthLoadingScreen />;
};
