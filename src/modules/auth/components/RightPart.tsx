import type { ReactElement } from "react";
import { Link } from "react-router";
import { ArrowLeft } from "lucide-react";

import { useGoogleLogin } from "@/modules/auth/features/login/hooks/useGoogleLogin";

interface RightPartProps {
    Body: ReactElement;
    isLoading: boolean;
    separatorText: string;
    title: string;
    subtitle: string;
    /** Set to false to hide the Google button and separator (e.g., password recovery pages) */
    showGoogleAuth?: boolean;
}

export const RightPart = ({
    Body,
    isLoading,
    separatorText,
    title,
    subtitle,
    showGoogleAuth = true,
}: RightPartProps) => {
    const {
        mutateAsync: loginWithGoogle,
        isPending: isGoogleLoading,
    } = useGoogleLogin();

    const busy = isLoading || isGoogleLoading;

    return (
        <section className="flex flex-1 items-center justify-center bg-surface-hard px-6 py-10 lg:px-14">
            <div className="w-full max-w-md">
                {/* Back button */}
                <Link
                    to="/"
                    className={`mb-10 inline-flex items-center gap-2 text-sm transition-colors hover:text-light ${
                        busy
                            ? "pointer-events-none text-helper/50"
                            : "text-helper"
                    }`}
                >
                    <ArrowLeft size={15} />
                    Volver al inicio
                </Link>

                {/* Header */}
                <div className="space-y-1.5 mb-8">
                    <h2 className="text-3xl font-semibold tracking-tight">
                        {title}
                    </h2>
                    <p className="text-sm text-helper">
                        {subtitle}
                    </p>
                </div>

                {/* Google button + separator (optional) */}
                {showGoogleAuth && (
                    <div className="space-y-5 mb-6">
                        <button
                            type="button"
                            onClick={() => {
                                void loginWithGoogle();
                            }}
                            className="h-11 w-full rounded-xl border border-light-10 bg-surface text-light hover:bg-secondary hover:border-light-25 inline-flex items-center justify-center gap-2.5 disabled:opacity-40 cursor-pointer transition-all duration-200 text-sm font-medium"
                            disabled={busy}
                        >
                            <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="size-4.5 shrink-0">
                                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05" />
                                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
                            </svg>
                            Continuar con Google
                        </button>

                        {/* Separator */}
                        <div className="relative flex items-center gap-3">
                            <div className="h-px flex-1 bg-light-10" />
                            <span className="text-xs text-helper/70 shrink-0">
                                {separatorText}
                            </span>
                            <div className="h-px flex-1 bg-light-10" />
                        </div>
                    </div>
                )}

                {Body}
            </div>
        </section>
    );
};
