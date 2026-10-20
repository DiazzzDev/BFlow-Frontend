import { NavLink } from "react-router";
import { useTranslation } from "react-i18next";

import { HEADER_NAV_LINKS } from "../utils/navItems";

export const HeaderNav = () => {
    const { t } = useTranslation();

    return (
        <nav aria-label={t("a11y.mainNavigation")} className="hidden items-center gap-1 lg:flex">
            {HEADER_NAV_LINKS.map(({ to, labelKey }) => (
                <NavLink
                    key={to}
                    to={to}
                    className={({ isActive }) =>
                        `rounded-lg px-3 py-2 text-sm font-medium transition-colors ${isActive ? "bg-light-5 text-light" : "text-helper hover:bg-light-5 hover:text-light"
                        }`
                    }
                >
                    {t(labelKey)}
                </NavLink>
            ))}
        </nav>
    );
};
