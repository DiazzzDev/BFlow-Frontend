import { Link } from "react-router";
import { useTranslation } from "react-i18next";

import { HeroPreview } from "./HeroPreview";

import { useAuth } from "@/auth/hooks/useAuth";

export const LandingHero = () => {
    const { t } = useTranslation();
    const { isAuthenticated, isChecking } = useAuth();

    return (
        <section className="relative isolate flex flex-col items-center overflow-hidden px-4 pt-8 pb-24 text-center md:px-8 md:pt-10 md:pb-32 w-full max-w-360">
            <div className="relative flex w-full flex-col items-center px-4 md:px-8">
                <div
                    aria-hidden="true"
                    className="absolute inset-x-0 top-9 -bottom-20 -z-10 rounded-[2.5rem] border border-light-5 bg-surface [mask-image:linear-gradient(to_bottom,black_35%,transparent)]"
                />

                <h1 className="max-w-4xl text-4xl md:text-5xl xl:text-6xl font-bold leading-[1.08] tracking-tight mt-12">
                    {t("home.heroTitle")}{" "}
                    <span className="bg-linear-to-r from-primary via-primary to-warning bg-clip-text text-transparent">
                        {t("home.heroFocus")}
                    </span>
                </h1>

                <p className="text-base md:text-lg text-helper max-w-xl mb-10 leading-relaxed">
                    {t("home.heroDescription")}
                </p>

                {!isChecking && (
                    <div className="flex flex-wrap items-center justify-center gap-3">
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
                                        {t("home.register")}
                                    </button>
                                </Link>
                            </>
                        )}
                    </div>
                )}
            </div>

            <HeroPreview />
        </section>
    );
};
