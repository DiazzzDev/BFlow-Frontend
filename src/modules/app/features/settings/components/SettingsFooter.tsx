import { Link } from "react-router";
import { useTranslation } from "react-i18next";

export const SettingsFooter = () => {
    const { t } = useTranslation();
    const links = [
        { to: "/terms", label: t("home.termsTitle") },
        { to: "/privacy", label: t("home.privacyTitle") },
        { to: "/cookies", label: t("home.cookiesTitle") },
        { to: "/docs", label: t("settings.navigation.documentation") },
    ];

    return (
        <footer className="mt-2 flex flex-col items-center justify-between gap-3 border-t border-light-10 pt-5 text-xs text-helper sm:flex-row">
            <span>© {new Date().getFullYear()} BFlow Studio</span>
            <nav className="flex flex-wrap justify-center gap-x-5 gap-y-2">
                {links.map(({ to, label }) => <Link key={to} to={to} className="transition-colors hover:text-light">{label}</Link>)}
            </nav>
        </footer>
    );
};
