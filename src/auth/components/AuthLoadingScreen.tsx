import { useTranslation } from "react-i18next";

export const AuthLoadingScreen = () => {
    const { t } = useTranslation();
    return (
        <div className="flex h-screen w-full items-center justify-center bg-surface-hard">
            <div
                className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent"
                aria-label={t("a11y.loadingSession")}
                role="status"
            />
        </div>
    );
};
