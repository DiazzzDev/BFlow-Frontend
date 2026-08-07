import { Link } from "react-router";
import { ArrowLeft } from "lucide-react";

import { useAuth } from "@/auth/hooks/useAuth";
import { LandingNavbar } from "@/modules/home/components/LandingNavbar";
import { LandingFooter } from "@/modules/home/components/LandingFooter";

export const NotFoundPage = () => {
    const { isAuthenticated } = useAuth();
    const homeTo = isAuthenticated ? "/app/dashboard" : "/";

    return (
        <div className="flex min-h-screen flex-col bg-surface-hard text-light">
            <LandingNavbar />

            <main className="mx-auto flex w-full max-w-[1440px] flex-1 items-center px-6 py-16 md:px-12 lg:px-20">
                <section className="max-w-xl">
                    <p className="mb-3 text-sm font-semibold text-primary">404</p>
                    <h1 className="mb-4 text-4xl font-bold tracking-tight md:text-5xl">
                        Página no encontrada
                    </h1>
                    <p className="mb-8 text-base text-helper md:text-lg">
                        Lo sentimos, no pudimos encontrar la página que estás buscando.
                    </p>
                    <Link
                        to={homeTo}
                        className="inline-flex items-center gap-2 text-sm font-medium text-primary transition-colors hover:text-primary-dark"
                    >
                        <ArrowLeft className="h-4 w-4" />
                        {isAuthenticated ? "Volver al dashboard" : "Volver al inicio"}
                    </Link>
                </section>
            </main>

            <LandingFooter />
        </div>
    );
};
