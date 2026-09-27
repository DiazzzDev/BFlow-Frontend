import { useEffect } from "react";
import { useLocation } from "react-router";

const PAGE_TITLES: Array<{ pattern: RegExp; title: string }> = [
    { pattern: /^\/$/, title: "Inicio" },
    { pattern: /^\/terms$/, title: "Terms" },
    { pattern: /^\/privacy$/, title: "Privacy" },
    { pattern: /^\/cookies$/, title: "Cookies" },
    { pattern: /^\/auth\/login$/, title: "Login" },
    { pattern: /^\/auth\/register$/, title: "Register" },
    { pattern: /^\/auth\/forgot-password$/, title: "Forgot password" },
    { pattern: /^\/auth\/reset-password$/, title: "Reset password" },
    { pattern: /^\/auth\/verify-account$/, title: "Verify account" },
    { pattern: /^\/app\/dashboard$/, title: "Dashboard" },
    { pattern: /^\/app\/wallets(?:\/[^/]+)?$/, title: "Billeteras" },
    { pattern: /^\/app\/history$/, title: "Historial" },
    { pattern: /^\/app\/budgets(?:\/[^/]+)?$/, title: "Presupuestos" },
    { pattern: /^\/app\/settings$/, title: "Ajustes" },
];

export const getPageTitle = (pathname: string): string => {
    return PAGE_TITLES.find(({ pattern }) => pattern.test(pathname))?.title ?? "BFlow";
};

/** Keeps the browser tab title aligned with the current application module. */
export const useDocumentTitle = () => {
    const { pathname } = useLocation();

    useEffect(() => {
        document.title = getPageTitle(pathname);
    }, [pathname]);
};
