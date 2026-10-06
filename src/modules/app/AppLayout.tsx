import { useMemo, useState } from "react";
import { Outlet, useLocation } from "react-router";

import { Header } from "./components/Header.tsx";
import { Navbar } from "./components/Navbar.tsx";
import { usePrefetchNotifications } from "./features/notifications/hooks/usePrefetchNotifications.ts";
import { useAuthStore } from "@/auth/authStore.ts";
import { AccountPendingDeletion } from "@/auth/components/AccountPendingDeletion.tsx";
import { useDocumentTitle } from "@/hooks/useDocumentTitle";
import { useTranslation } from "react-i18next";

export const AppLayout = () => {
    const [isNavOpen, setIsNavOpen] = useState(false);
    const { pathname } = useLocation();
    const { t } = useTranslation();
    const { user } = useAuthStore();
    // Prefetch list + unread count for the whole authenticated shell
    usePrefetchNotifications();

    const isPendingDeletion = user?.status === "PENDING_DELETION";

    const documentTitle = useMemo((): string => {
        const walletMatch = pathname.match(/^\/app\/wallets\/([^/]+)/);

        if (walletMatch) {
            const wallet = user?.wallets.find((item) => item.id === walletMatch[1]);
            return wallet?.name || String(t("breadcrumbs.wallets"));
        }

        if (pathname.startsWith("/app/budgets/")) {
            return String(t("breadcrumbs.budgets"));
        }

        const pageTitleKeys: Record<string, "breadcrumbs.dashboard" | "breadcrumbs.wallets" | "breadcrumbs.history" | "breadcrumbs.budgets" | "breadcrumbs.settings"> = {
            "/app/dashboard": "breadcrumbs.dashboard",
            "/app/wallets": "breadcrumbs.wallets",
            "/app/history": "breadcrumbs.history",
            "/app/budgets": "breadcrumbs.budgets",
            "/app/settings": "breadcrumbs.settings",
        };

        return String(t(pageTitleKeys[pathname] ?? "breadcrumbs.dashboard"));
    }, [pathname, t, user?.wallets]);

    useDocumentTitle(documentTitle);

    return (
        <div className="flex h-dvh overflow-hidden">
            <Navbar isOpen={isNavOpen} onClose={() => setIsNavOpen(false)} />
            <section className="flex min-w-0 flex-1 flex-col">
                <Header onOpenNav={() => setIsNavOpen(true)} />
                <div className="@container flex min-h-0 flex-1 flex-col overflow-y-auto overflow-x-hidden">
                    <Outlet />
                </div>
            </section>
            {isPendingDeletion && (
                <AccountPendingDeletion />
            )}
        </div>
    );
};
