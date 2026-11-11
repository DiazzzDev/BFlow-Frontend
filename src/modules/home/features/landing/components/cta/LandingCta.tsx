import { useTranslation } from "react-i18next";

import { useAuth } from "@/auth/hooks/useAuth";
import { Button } from "@/components/controls/Button";

export const LandingCta = () => {
    const { t } = useTranslation();
    const { isAuthenticated, isChecking } = useAuth();

    return (
        <section className="w-full max-w-360 px-8 py-24 md:py-32">
            <div className="relative isolate overflow-hidden rounded-[2.5rem] border border-light-10 bg-surface px-6 py-16 text-center md:py-24">
                <h2 className="mx-auto max-w-2xl text-3xl font-bold tracking-tight md:text-5xl">
                    {t("home.cta.title")}
                </h2>
                <p className="mx-auto mt-4 max-w-xl text-sm leading-relaxed text-helper md:text-base">
                    {t("home.cta.description")}
                </p>

                {!isChecking && (
                    <div className="mt-10 flex flex-wrap items-center justify-center gap-3">
                        {isAuthenticated ? (
                            <Button to="/app/dashboard" text={t("home.goDashboard")} className="rounded-xl px-7 py-3" />
                        ) : (
                            <>
                                <Button to="/auth/login" variant="outline" text={t("home.signIn")} className="rounded-xl border-light-25 px-7 py-3 hover:border-light" />
                                <Button to="/auth/register" text={t("home.plans.startFree")} className="rounded-xl px-7 py-3" />
                            </>
                        )}
                    </div>
                )}
            </div>
        </section>
    );
};
