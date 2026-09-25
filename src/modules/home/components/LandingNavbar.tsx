import { useState, useEffect } from "react";
import { Link } from "react-router";
import { Menu, X } from "lucide-react";

import { useLandingNav } from "../hooks/useLandingNav";

import { useAuth } from "@/auth/hooks/useAuth";

export const LandingNavbar = () => {
    const { navLinks, handleNavClick } = useLandingNav();
    const { isAuthenticated, isChecking } = useAuth();
    const [mobileOpen, setMobileOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);

    // Add shadow on scroll
    useEffect(() => {
        const onScroll = () => setScrolled(window.scrollY > 10);
        window.addEventListener("scroll", onScroll, { passive: true });
        return () => window.removeEventListener("scroll", onScroll);
    }, []);

    const onNavClick = (id: string) => {
        handleNavClick(id);
        setMobileOpen(false);
    };

    return (
        <header
            className={`sticky top-0 z-50 border-b border-light-10 bg-surface-hard/95 backdrop-blur-md transition-shadow duration-200 ${
                scrolled ? "shadow-[0_2px_16px_rgba(0,0,0,0.3)]" : ""
            }`}
        >
            <nav className="mx-auto flex h-16 max-w-360 items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
                <div className="flex items-center gap-8">
                    {/* Logo */}
                    <Link
                        to="/"
                        className="shrink-0 flex items-center gap-2 text-base font-semibold tracking-tight text-light"
                        onClick={() => setMobileOpen(false)}
                    >
                        <div className="flex h-6 w-6 items-center justify-center rounded-md bg-primary">
                            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M12 2L2 7l10 5 10-5-10-5z" />
                                <path d="M2 17l10 5 10-5" />
                                <path d="M2 12l10 5 10-5" />
                            </svg>
                        </div>
                        BFlow <span className="font-normal text-helper">Studio</span>
                    </Link>

                    <div className="hidden items-center gap-1 md:flex">
                        {navLinks.map(({ label, id }) => (
                            <button
                                key={id}
                                type="button"
                                onClick={() => onNavClick(id)}
                                className="cursor-pointer rounded-md px-3 py-2 text-sm font-medium text-helper transition-colors hover:bg-light-10 hover:text-light"
                            >
                                {label}
                            </button>
                        ))}
                    </div>
                </div>

                <div className="flex items-center gap-3">
                    {isChecking ? null : isAuthenticated ? (
                        <Link to="/app/dashboard">
                            <button
                                type="button"
                                className="cursor-pointer rounded-lg bg-primary px-4 py-2 text-sm font-medium text-light transition-colors hover:bg-primary-dark"
                            >
                                Ir al dashboard
                            </button>
                        </Link>
                    ) : (
                        <>
                            <Link
                                to="/auth/login"
                                className="hidden text-sm font-medium text-helper transition-colors hover:text-light sm:inline"
                            >
                                Iniciar sesión
                            </Link>
                            <Link to="/auth/register">
                                <button
                                    type="button"
                                    className="cursor-pointer rounded-lg bg-primary px-4 py-2 text-sm font-medium text-light transition-colors hover:bg-primary-dark"
                                >
                                    Empezar gratis
                                </button>
                            </Link>
                        </>
                    )}

                    <button
                        type="button"
                        className="inline-flex cursor-pointer items-center justify-center rounded-md p-2 text-helper hover:bg-light-10 hover:text-light md:hidden"
                        onClick={() => setMobileOpen((open) => !open)}
                        aria-label={mobileOpen ? "Cerrar menú" : "Abrir menú"}
                    >
                        {mobileOpen ? <X size={20} /> : <Menu size={20} />}
                    </button>
                </div>
            </nav>

            {mobileOpen && (
                <div className="border-t border-light-10 px-4 py-3 md:hidden">
                    <div className="flex flex-col gap-1">
                        {navLinks.map(({ label, id }) => (
                            <button
                                key={id}
                                type="button"
                                onClick={() => onNavClick(id)}
                                className="cursor-pointer rounded-md px-3 py-2 text-left text-sm font-medium text-helper transition-colors hover:bg-light-10 hover:text-light"
                            >
                                {label}
                            </button>
                        ))}
                        {!isAuthenticated && !isChecking && (
                            <Link
                                to="/auth/login"
                                onClick={() => setMobileOpen(false)}
                                className="rounded-md px-3 py-2 text-sm font-medium text-helper transition-colors hover:bg-light-10 hover:text-light sm:hidden"
                            >
                                Iniciar sesión
                            </Link>
                        )}
                    </div>
                </div>
            )}
        </header>
    );
};
