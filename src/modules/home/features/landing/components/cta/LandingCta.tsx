import { Link } from "react-router";
import { useTranslation } from "react-i18next";

import { useAuth } from "@/auth/hooks/useAuth";

const RIBBON_PATH = "M0 60 C 300 60, 420 20, 720 20 S 1140 60, 1440 60";

const RIBBON_LINES = [
    { offset: 0, className: "stroke-primary-50" },
    { offset: 14, className: "stroke-primary-25" },
    { offset: 28, className: "stroke-primary-15" },
];

export const LandingCta = () => {
    const { t } = useTranslation();
    const { isAuthenticated, isChecking } = useAuth();

    return (
        <section className="w-full max-w-360 px-8 py-24 md:py-32">
            <div className="relative isolate overflow-hidden rounded-[2.5rem] border border-light-10 bg-surface px-6 py-16 text-center md:py-24">
                <svg
                    aria-hidden="true"
                    viewBox="0 0 1440 100"
                    preserveAspectRatio="none"
                    className="pointer-events-none absolute inset-x-0 bottom-0 -z-10 h-16 w-full [mask-image:linear-gradient(to_right,transparent,black_20%,black_80%,transparent)]"
                >
                    {RIBBON_LINES.map(({ offset, className }) => (
                        <path
                            key={offset}
                            d={RIBBON_PATH}
                            transform={`translate(0 ${offset})`}
                            fill="none"
                            strokeWidth={3}
                            strokeLinecap="round"
                            vectorEffect="non-scaling-stroke"
                            className={className}
                        />
                    ))}
                </svg>

                <h2 className="mx-auto max-w-2xl text-3xl font-bold tracking-tight md:text-5xl">
                    {t("home.cta.title")}
                </h2>
                <p className="mx-auto mt-4 max-w-xl text-sm leading-relaxed text-helper md:text-base">
                    {t("home.cta.description")}
                </p>

                {!isChecking && (
                    <div className="mt-10 flex flex-wrap items-center justify-center gap-3">
                        {isAuthenticated ? (
                            <Link to="/app/dashboard">
                                <button
                                    type="button"
                                    className="bg-primary text-light text-sm font-medium px-7 py-3 rounded-xl hover:bg-primary-dark transition-colors cursor-pointer"
                                >
                                    {t("home.goDashboard")}
                                </button>
                            </Link>
                        ) : (
                            <>
                                <Link to="/auth/login">
                                    <button
                                        type="button"
                                        className="border border-light-25 text-light text-sm font-medium px-7 py-3 rounded-xl hover:border-light hover:bg-light-10 transition-colors cursor-pointer"
                                    >
                                        {t("home.signIn")}
                                    </button>
                                </Link>
                                <Link to="/auth/register">
                                    <button
                                        type="button"
                                        className="bg-primary text-light text-sm font-medium px-7 py-3 rounded-xl hover:bg-primary-dark transition-colors cursor-pointer"
                                    >
                                        {t("home.startFree")}
                                    </button>
                                </Link>
                            </>
                        )}
                    </div>
                )}
            </div>
        </section>
    );
};
