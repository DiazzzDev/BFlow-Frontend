import { Link } from "react-router";
import { useTranslation } from "react-i18next";

const linkClass = "text-xs font-medium text-helper transition-colors hover:text-light";

export const AuthFooter = () => {
    const { t } = useTranslation();

    return (
        <footer className="relative z-10 border-t border-light-10">
            <div className="mx-auto flex w-full max-w-360 flex-col items-center justify-between gap-3 px-6 py-5 sm:flex-row sm:px-8">
                <p className="text-xs text-label">© {new Date().getFullYear()} BFlow Studio</p>

                <nav className="flex items-center gap-6">
                    <Link to="/terms" className={linkClass}>
                        {t("home.termsTitle")}
                    </Link>
                    <Link to="/privacy" className={linkClass}>
                        {t("home.privacyTitle")}
                    </Link>
                </nav>
            </div>
        </footer>
    );
};
