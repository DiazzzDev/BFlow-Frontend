interface HeaderNavLink {
    to: string;
    labelKey: "nav.dashboard" | "nav.wallets" | "nav.history" | "nav.budgets";
}

export const HEADER_NAV_LINKS: HeaderNavLink[] = [
    { to: "/app/dashboard", labelKey: "nav.dashboard" },
    { to: "/app/wallets", labelKey: "nav.wallets" },
    { to: "/app/history", labelKey: "nav.history" },
    { to: "/app/budgets", labelKey: "nav.budgets" },
];

// Sidebar wallet submenu + path helpers for the app shell navbar
export const WALLET_NAV_CHILDREN = [
    { label: "Historial", to: "/app/history" },
] as const;

export const isWalletsSectionPath = (pathname: string) =>
    pathname.startsWith("/app/wallets") || pathname.startsWith("/app/history");

export const isWalletParentPath = (pathname: string) =>
    pathname === "/app/wallets" || /^\/app\/wallets\/[^/]+$/.test(pathname);
