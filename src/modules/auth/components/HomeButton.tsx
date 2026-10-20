import { Link } from "react-router";
import { House } from "lucide-react";
import { useTranslation } from "react-i18next";

export const HomeButton = () => {
    const { t } = useTranslation();

    return (
        <Link
            to="/"
            aria-label={t("auth.backHome")}
            title={t("auth.backHome")}
            className="flex h-10 w-10 items-center justify-center rounded-xl border border-light-10 bg-surface text-helper shadow-custom transition-colors hover:border-primary hover:text-primary absolute top-6 right-6 lg:right-12 z-50"
        >
            <House size={18} />
        </Link>
    );
};
