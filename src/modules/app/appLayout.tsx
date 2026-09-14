import { useState } from "react";
import { Outlet } from "react-router";

import { Header } from "./components/Header.tsx";
import { Navbar } from "./components/Navbar.tsx";
import { usePrefetchNotifications } from "./features/notifications/hooks/usePrefetchNotifications";

export const AppLayout = () => {
    const [isNavOpen, setIsNavOpen] = useState(false);

    // Prefetch list + unread count for the whole authenticated shell
    usePrefetchNotifications();

    return (
        <div className="flex h-dvh overflow-hidden">
            <Navbar isOpen={isNavOpen} onClose={() => setIsNavOpen(false)} />
            <section className="flex min-w-0 flex-1 flex-col">
                <Header onOpenNav={() => setIsNavOpen(true)} />
                <div className="@container flex min-h-0 flex-1 flex-col overflow-y-auto overflow-x-hidden">
                    <Outlet />
                </div>
            </section>
        </div>
    );
};
