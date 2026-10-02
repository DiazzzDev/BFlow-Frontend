import { Outlet, useMatches } from "react-router";

import { AuthBackground } from "./components/AuthBackground";
import { AuthFooter } from "./components/AuthFooter";
import { HomeButton } from "./components/HomeButton";

interface AuthRouteHandle {
    hideAuthChrome?: boolean;
}

export const AuthLayout = () => {
    // Full-screen pages (OAuth callback) opt out of the header, footer and background
    const hideChrome = useMatches().some(
        ({ handle }) => (handle as AuthRouteHandle | undefined)?.hideAuthChrome,
    );

    if (hideChrome) {
        return <Outlet />;
    }

    return (
        <div className="relative flex min-h-dvh flex-col overflow-hidden bg-surface-hard text-light">
            <AuthBackground />
            <HomeButton />

            <main className="relative z-10 flex flex-1 items-center justify-center px-4 pb-12 pt-4 sm:px-6">
                <Outlet />
            </main>

            <AuthFooter />
        </div>
    );
};
