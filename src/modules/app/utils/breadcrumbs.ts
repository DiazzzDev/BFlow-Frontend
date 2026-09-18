import { matchPath } from "react-router";

export type Breadcrumb = { text: string; path?: string };

type BreadcrumbRoute = {
    path: string;
    crumbs: Breadcrumb[];
};

// Shell breadcrumb map for authenticated app routes
export const APP_BREADCRUMB_ROUTES: BreadcrumbRoute[] = [
    { path: "/app/dashboard", crumbs: [{ text: "Dashboard" }] },
    { path: "/app/wallets", crumbs: [{ text: "Billeteras" }] },
    {
        path: "/app/wallets/:id",
        crumbs: [
            { text: "Billeteras", path: "/app/wallets" },
            { text: "Detalle" },
        ],
    },
    {
        path: "/app/history",
        crumbs: [
            { text: "Billeteras", path: "/app/wallets" },
            { text: "Historial" },
        ],
    },
    { path: "/app/budgets", crumbs: [{ text: "Presupuestos" }] },
    {
        path: "/app/budgets/:id",
        crumbs: [
            { text: "Presupuestos", path: "/app/budgets" },
            { text: "Detalle" },
        ],
    },
    { path: "/app/settings", crumbs: [{ text: "Ajustes" }] },
];

export const getBreadcrumbs = (pathname: string): Breadcrumb[] => {
    for (const route of APP_BREADCRUMB_ROUTES) {
        if (matchPath(route.path, pathname)) {
            return route.crumbs;
        }
    }

    return [{ text: "..." }];
};
