import { useEffect } from "react";
import { useLocation } from "react-router";
import { useTranslation } from "react-i18next";
import type { TFunction } from "i18next";

type PageTitleKey =
    | "pageTitles.home"
    | "pageTitles.terms"
    | "pageTitles.privacy"
    | "pageTitles.cookies"
    | "pageTitles.contact"
    | "pageTitles.login"
    | "pageTitles.register"
    | "pageTitles.forgotPassword"
    | "pageTitles.resetPassword"
    | "pageTitles.verifyAccount"
    | "pageTitles.dashboard"
    | "pageTitles.wallets"
    | "pageTitles.history"
    | "pageTitles.budgets"
    | "pageTitles.settings"
    | "pageTitles.default";

const PAGE_TITLES: Array<{ pattern: RegExp; key: PageTitleKey }> = [
    { pattern: /^\/$/, key: "pageTitles.home" },
    { pattern: /^\/terms$/, key: "pageTitles.terms" },
    { pattern: /^\/privacy$/, key: "pageTitles.privacy" },
    { pattern: /^\/cookies$/, key: "pageTitles.cookies" },
    { pattern: /^\/contact$/, key: "pageTitles.contact" },
    { pattern: /^\/auth\/login$/, key: "pageTitles.login" },
    { pattern: /^\/auth\/register$/, key: "pageTitles.register" },
    { pattern: /^\/auth\/forgot-password$/, key: "pageTitles.forgotPassword" },
    { pattern: /^\/auth\/reset-password$/, key: "pageTitles.resetPassword" },
    { pattern: /^\/auth\/verify-account$/, key: "pageTitles.verifyAccount" },
    { pattern: /^\/app\/dashboard$/, key: "pageTitles.dashboard" },
    { pattern: /^\/app\/wallets(?:\/[^/]+)?$/, key: "pageTitles.wallets" },
    { pattern: /^\/app\/history$/, key: "pageTitles.history" },
    { pattern: /^\/app\/budgets(?:\/[^/]+)?$/, key: "pageTitles.budgets" },
    { pattern: /^\/app\/settings$/, key: "pageTitles.settings" },
];

export const getPageTitle = (pathname: string, t: TFunction): string => {
    const key: PageTitleKey =
        PAGE_TITLES.find(({ pattern }) => pattern.test(pathname))?.key ?? "pageTitles.default";
    return t(key);
};

/** Keeps the browser tab title aligned with the current application module. */
export const useDocumentTitle = () => {
    const { pathname } = useLocation();
    const { t } = useTranslation();

    useEffect(() => {
        document.title = getPageTitle(pathname, t);
    }, [pathname, t]);
};
