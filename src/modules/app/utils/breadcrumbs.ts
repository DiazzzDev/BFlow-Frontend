import { matchPath } from "react-router";

export type Breadcrumb = { text: string; path?: string };

type BreadcrumbRoute = {
    path: string;
    crumbs: Breadcrumb[];
};

// Shell breadcrumb map for authenticated app routes
export const APP_BREADCRUMB_ROUTES: BreadcrumbRoute[] = [
    { path: "/app/dashboard", crumbs: [{ text: "breadcrumbs.dashboard" }] },
    { path: "/app/wallets", crumbs: [{ text: "breadcrumbs.wallets" }] },
    {
        path: "/app/wallets/:id",
        crumbs: [
            { text: "breadcrumbs.wallets", path: "/app/wallets" },
            { text: "breadcrumbs.detail" },
        ],
    },
    {
        path: "/app/history",
        crumbs: [
            { text: "breadcrumbs.wallets", path: "/app/wallets" },
            { text: "breadcrumbs.history" },
        ],
    },
    { path: "/app/budgets", crumbs: [{ text: "breadcrumbs.budgets" }] },
    {
        path: "/app/budgets/:id",
        crumbs: [
            { text: "breadcrumbs.budgets", path: "/app/budgets" },
            { text: "breadcrumbs.detail" },
        ],
    },
    { path: "/app/settings", crumbs: [{ text: "breadcrumbs.settings" }] },
];

export const getBreadcrumbs = (pathname: string): Breadcrumb[] => {
    for (const route of APP_BREADCRUMB_ROUTES) {
        if (matchPath(route.path, pathname)) {
            return route.crumbs;
        }
    }

    return [{ text: "common.loading" }];
};
