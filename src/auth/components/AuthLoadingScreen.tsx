import { MotionConfig } from "framer-motion";
import { useTranslation } from "react-i18next";

import { SessionLoader } from "./SessionLoader";

export const AuthLoadingScreen = () => {
    const { t } = useTranslation();

    return (
        <MotionConfig reducedMotion="user">
            <div
                role="status"
                aria-live="polite"
                aria-label={t("a11y.loadingSession")}
                className="fixed inset-0 flex items-center justify-center bg-surface-hard px-6 text-light"
            >
                <SessionLoader />
            </div>
        </MotionConfig>
    );
};
