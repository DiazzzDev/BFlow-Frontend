import { useTranslation } from "react-i18next";

import { HeroPreview } from "./HeroPreview";

import { useAuth } from "@/auth/hooks/useAuth";
import { Button } from "@/components/controls/Button";

export const LandingHero = () => {
    const { t } = useTranslation();
    const { isAuthenticated, isChecking } = useAuth();

    return (
        <section className="relative flex flex-col items-center overflow-hidden px-4 pt-8 pb-24 text-center md:px-8 md:pt-10 md:pb-32 w-full max-w-360">
            <div className="relative flex w-full flex-col items-center px-4 md:px-8">
                <div
                    aria-hidden="true"
                    className="absolute inset-x-0 top-9 -bottom-20 -z-10 rounded-[2.5rem] border border-light-5 bg-surface [mask-image:linear-gradient(to_bottom,black_35%,transparent)]"
                />

                <h1 className="max-w-4xl text-4xl md:text-5xl xl:text-6xl font-bold leading-[1.08] tracking-tight mt-12">
                    {t("home.heroTitle")}{" "}
                    {t("home.heroFocus")}
                </h1>

                <p className="text-base md:text-lg text-helper max-w-xl mb-10 leading-relaxed">
                    {t("home.heroDescription")}
                </p>

                {!isChecking && (
                    <div className="flex flex-wrap items-center justify-center gap-3">
                        {isAuthenticated ? (
                            <Button to="/app/dashboard" text={t("home.goDashboard")} className="rounded-xl px-7 py-3" />
                        ) : (
                            <>
                                <Button to="/auth/login" variant="outline" text={t("home.signIn")} className="rounded-xl border-light-25 px-7 py-3 hover:border-light" />
                                <Button to="/auth/register" text={t("home.register")} className="rounded-xl px-7 py-3" />
                            </>
                        )}
                    </div>
                )}
            </div>

            <HeroPreview />
        </section>
    );
};
