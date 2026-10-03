import { useLocation, Link } from "react-router";
import { Menu } from "lucide-react";
import { useTranslation } from "react-i18next";

import { NotificationsMenu } from "./NotificationsMenu";
import { UserMenu } from "./UserMenu";

import { getBreadcrumbs } from "../utils/breadcrumbs";

import BflowLogo from "@/assets/BFlow logo.svg";

interface HeaderProps {
    onOpenNav: () => void;
}

export const Header = ({ onOpenNav }: HeaderProps) => {
    const { t } = useTranslation();
    const { pathname } = useLocation();
    const crumbs = getBreadcrumbs(pathname);

    return (
        <header className="flex items-center justify-between gap-3 border-b border-light-10 bg-surface-hard px-4 py-4 text-light sm:px-6 lg:px-8 lg:py-5">
            <div className="flex min-w-0 items-center gap-3 sm:gap-4">
                <button
                    type="button"
                    onClick={onOpenNav}
                    aria-label={t("a11y.openMenu")}
                    className="flex h-9 w-9 shrink-0 cursor-pointer items-center justify-center rounded-lg border border-light-25 bg-surface text-light transition-colors hover:border-light-50"
                >
                    <Menu className="h-5 w-5" />
                </button>

                <Link to="/app/dashboard" aria-label="BFlow Studio" className="shrink-0">
                    <img src={BflowLogo} alt="" className="h-7 w-auto" />
                </Link>

                <div className="flex min-w-0 items-center gap-2 text-base font-medium sm:text-lg">
                    {crumbs.map((crumb, i) => {
                        const isLast = i === crumbs.length - 1;

                        return (
                            <span className="flex min-w-0 items-center gap-2" key={i}>
                                {i > 0 && <span className="shrink-0 text-helper">/</span>}

                                {!isLast && crumb.path ? (
                                    <Link
                                        to={crumb.path}
                                        className="truncate text-helper transition-colors hover:text-light"
                                    >
                                        {t(crumb.text, { defaultValue: crumb.text })}
                                    </Link>
                                ) : (
                                    <span
                                        className={`truncate ${isLast ? "text-light font-medium" : "text-helper"
                                            }`}
                                    >
                                        {t(crumb.text, { defaultValue: crumb.text })}
                                    </span>
                                )}
                            </span>
                        );
                    })}
                </div>
            </div>

            <div className="flex shrink-0 items-center gap-2 sm:gap-4">
                <NotificationsMenu />
                <UserMenu />
            </div>
        </header>
    );
};
