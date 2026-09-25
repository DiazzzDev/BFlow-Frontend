import { useState } from "react";
import { Link } from "react-router";
import { Menu, X } from "lucide-react";
import { useTranslation } from "react-i18next";

import { useLandingNav } from "../hooks/useLandingNav";

import { useAuth } from "@/auth/hooks/useAuth";

const getNavTranslationKey = (id: string) => {
    if (id === "how") {
        return "home.navFeatures";
    }
    if (id === "pricing") {
        return "home.navPricing";
    }
    if (id === "faq") {
        return "home.navFaq";
    }
    return "home.navContact";
};

export const LandingNavbar = () => {
    const { navLinks, handleNavClick } = useLandingNav();
    const { isAuthenticated, isChecking } = useAuth();
    const { t } = useTranslation();
    const [mobileOpen, setMobileOpen] = useState(false);

    const onNavClick = (id: string) => {
        handleNavClick(id);
        setMobileOpen(false);
    };

    return (
        <header className="sticky top-0 z-50 border-b border-light-10 bg-surface-hard/95 backdrop-blur-md">
            <nav className="mx-auto flex h-16 max-w-360 items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
                <div className="flex items-center gap-8">
                    <Link
                        to="/"
                        className="shrink-0 text-base font-semibold tracking-tight text-light"
                        onClick={() => setMobileOpen(false)}
                    >
                        BFlow <span className="font-normal text-helper">Studio</span>
                    </Link>

                    <div className="hidden items-center gap-1 md:flex">
                        {navLinks.map(({ label, id }) => (
                            <button
                                key={id}
                                type="button"
                                onClick={() => onNavClick(id)}
                                className="cursor-pointer rounded-md px-3 py-2 text-sm font-medium text-helper transition-colors hover:bg-light-10 hover:text-light"
                            >
                                {t(getNavTranslationKey(id), { defaultValue: label })}
                            </button>
                        ))}
                    </div>
                </div>

                <div className="flex items-center gap-3">
                    {isChecking ? null : isAuthenticated ? (
                        <Link to="/app/dashboard">
                            <button
                                type="button"
                                className="cursor-pointer rounded-md bg-primary px-3 py-2 text-sm font-medium text-light transition-colors hover:bg-primary-dark"
                            >
                                {t("home.goDashboard")}
                            </button>
                        </Link>
                    ) : (
                        <>
                            <Link
                                to="/auth/login"
                                className="hidden text-sm font-medium text-helper transition-colors hover:text-light sm:inline"
                            >
                                {t("home.signIn")}
                            </Link>
                            <Link to="/auth/register">
                                <button
                                    type="button"
                                    className="cursor-pointer rounded-md bg-primary px-3 py-2 text-sm font-medium text-light transition-colors hover:bg-primary-dark"
                                >
                                    {t("home.startFree")}
                                </button>
                            </Link>
                        </>
                    )}

                    <button
                        type="button"
                        className="inline-flex cursor-pointer items-center justify-center rounded-md p-2 text-helper hover:bg-light-10 hover:text-light md:hidden"
                        onClick={() => setMobileOpen((open) => !open)}
                        aria-label={mobileOpen ? t("a11y.closeMenu") : t("a11y.openMenu")}
                    >
                        {mobileOpen ? <X size={20} /> : <Menu size={20} />}
                    </button>
                </div>
            </nav>

            {mobileOpen && (
                <div className="border-t border-light-10 px-4 py-3 md:hidden">
                    <div className="flex flex-col gap-1">
                        {navLinks.map(({ label, id }) => (
                            <button
                                key={id}
                                type="button"
                                onClick={() => onNavClick(id)}
                                className="cursor-pointer rounded-md px-3 py-2 text-left text-sm font-medium text-helper transition-colors hover:bg-light-10 hover:text-light"
                            >
                                {t(getNavTranslationKey(id), { defaultValue: label })}
                            </button>
                        ))}
                        {!isAuthenticated && !isChecking && (
                            <Link
                                to="/auth/login"
                                onClick={() => setMobileOpen(false)}
                                className="rounded-md px-3 py-2 text-sm font-medium text-helper transition-colors hover:bg-light-10 hover:text-light sm:hidden"
                            >
                                {t("home.signIn")}
                            </Link>
                        )}
                    </div>
                </div>
            )}
        </header>
    );
};
