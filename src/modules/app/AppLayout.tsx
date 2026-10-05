import { useState } from "react";
import { Outlet } from "react-router";

import { Header } from "./components/Header.tsx";
import { Navbar } from "./components/Navbar.tsx";
import { usePrefetchNotifications } from "./features/notifications/hooks/usePrefetchNotifications.ts";
import { useAuthStore } from "@/auth/authStore.ts";
import { AccountPendingDeletion } from "@/auth/components/AccountPendingDeletion.tsx";

export const AppLayout = () => {
    const [isNavOpen, setIsNavOpen] = useState(false);
    const { user } = useAuthStore();
    // Prefetch list + unread count for the whole authenticated shell
    usePrefetchNotifications();

    const isPendingDeletion = user?.status === "PENDING_DELETION";
    console.log(user);

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
