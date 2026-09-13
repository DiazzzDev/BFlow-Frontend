// Sidebar wallet submenu + path helpers for the app shell navbar
export const WALLET_NAV_CHILDREN = [
    { label: "Historial", to: "/app/history" },
] as const;

export const isWalletsSectionPath = (pathname: string) =>
    pathname.startsWith("/app/wallets") || pathname.startsWith("/app/history");

export const isWalletParentPath = (pathname: string) =>
    pathname === "/app/wallets" || /^\/app\/wallets\/[^/]+$/.test(pathname);
