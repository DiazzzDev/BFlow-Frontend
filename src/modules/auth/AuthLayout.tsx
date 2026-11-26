import { Link, Outlet, useMatches } from "react-router";

import { AuthBackground } from "./components/AuthBackground";
import { AuthFooter } from "./components/AuthFooter";
import { BflowLogo } from "@/components/brand/BflowLogo";

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
            <header className="relative z-20 flex h-20 items-center px-6 sm:px-8 lg:px-12">
                <Link to="/" aria-label="BFlow" className="flex items-center rounded-md focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-primary">
                    <BflowLogo className="h-7 w-auto" />
                </Link>
            </header>

            <main className="relative z-10 flex flex-1 items-center justify-center px-6 pb-12 pt-2 sm:px-8">
                <Outlet />
            </main>

            <AuthFooter />
        </div>
    );
};
