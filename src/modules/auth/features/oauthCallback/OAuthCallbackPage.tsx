import { useOAuthCallback } from "./hooks/useOAuthCallback";
import { useTranslation } from "react-i18next";

export const OAuthCallbackPage = () => {
    const { t } = useTranslation();
    // Kick off OAuth session sync on mount
    useOAuthCallback();

    return (
        <div className="flex h-screen items-center justify-center">
            {t("auth.oauthLoading")}
        </div>
    );
};
