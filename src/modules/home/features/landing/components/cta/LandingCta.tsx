import { ArrowRight, ArrowUpRight } from "lucide-react";
import { Link } from "react-router";
import { useTranslation } from "react-i18next";

import { useAuth } from "@/auth/hooks/useAuth";
import { useStartProCheckout } from "@/modules/home/features/landing/hooks/useStartProCheckout";
import SpotlightCard from "@/components/SpotlightCard";
import { useTheme } from "@/theme/ThemeProvider";

export const LandingCta = () => {
  const { t } = useTranslation();
  const { isAuthenticated } = useAuth();
  const { theme } = useTheme();
  const handleProClick = useStartProCheckout();

  return (
    <section
      className="w-full max-w-7xl px-4 pt-6 pb-12 sm:px-8 md:pt-8 md:pb-16"
      aria-labelledby="landing-cta-title"
    >
      <div className="grid gap-5 lg:min-h-[32rem] lg:grid-cols-[2fr_1fr]">
        <Link
          to={isAuthenticated ? "/app/dashboard" : "/auth/login"}
          className="group relative flex min-h-[30rem] flex-col justify-between overflow-hidden rounded-[2rem] border border-light-10 bg-[radial-gradient(ellipse_at_75%_18%,rgba(105,92,255,0.13),transparent_42%),linear-gradient(145deg,var(--color-surface),var(--color-surface-hard))] p-8 transition-colors hover:bg-[radial-gradient(ellipse_at_75%_18%,rgba(105,92,255,0.16),transparent_42%),linear-gradient(145deg,var(--color-surface),var(--color-surface-hard))] focus-visible:outline-2 focus-visible:outline-offset-3 focus-visible:outline-primary sm:p-11 lg:p-14"
        >
          <div className="max-w-2xl">
            <h2
              id="landing-cta-title"
              className="text-3xl font-bold tracking-tight text-light sm:text-4xl md:text-5xl"
            >
              {t("home.cta.title")}
            </h2>
            <p className="mt-4 max-w-xl text-sm leading-relaxed text-helper md:text-base">
              {t("home.cta.description")}
            </p>
          </div>
          <span className="mt-10 inline-flex w-fit items-center gap-3 rounded-full border border-light-10 bg-surface-30 px-4 py-2.5 text-sm font-semibold text-light">
            {t(isAuthenticated ? "home.goDashboard" : "home.cta.enterApp")}
            <ArrowRight className="h-4 w-4" aria-hidden="true" />
          </span>
        </Link>

        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-1 lg:grid-rows-2">
          <SpotlightCard
            theme={theme}
            spotlightColor="rgba(155,145,255,0.75)"
            intensity={0.025}
            borderGlow={0.04}
            proximity={56}
            className="min-h-52 border border-light-10 bg-[linear-gradient(140deg,rgba(118,108,178,0.11),rgba(82,78,103,0.045)_52%,var(--color-surface-hard)_100%)] p-0 sm:min-h-56 lg:min-h-0"
          >
            <button
              type="button"
              onClick={() => {
                void handleProClick();
              }}
              className="group flex h-full min-h-52 w-full flex-col justify-between rounded-[inherit] bg-transparent p-7 text-left focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-primary sm:min-h-56 lg:min-h-0"
            >
              <span className="flex items-start justify-between gap-4">
                <span className="text-xl font-semibold leading-tight text-light">
                  {t("home.cta.proTitle")}
                </span>
                <ArrowUpRight
                  className="h-5 w-5 shrink-0 text-helper transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                  aria-hidden="true"
                />
              </span>
              <span className="text-sm leading-snug text-helper">
                {t("home.cta.proDescription")}
              </span>
            </button>
          </SpotlightCard>

          <SpotlightCard
            theme={theme}
            spotlightColor="rgba(210,215,225,0.8)"
            intensity={0.02}
            borderGlow={0.035}
            proximity={56}
            className="min-h-52 border border-light-10 bg-[linear-gradient(140deg,rgba(180,188,202,0.11),rgba(126,134,148,0.045)_52%,var(--color-surface-hard)_100%)] p-0 sm:min-h-56 lg:min-h-0"
          >
            <Link
              to="/contact"
              className="group flex h-full min-h-52 w-full flex-col justify-between rounded-[inherit] bg-transparent p-7 focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-primary sm:min-h-56 lg:min-h-0"
            >
              <span className="flex items-start justify-between gap-4">
                <span className="text-xl font-semibold leading-tight text-light">
                  {t("home.cta.supportTitle")}
                </span>
                <ArrowRight
                  className="h-5 w-5 shrink-0 text-helper transition-transform group-hover:translate-x-1"
                  aria-hidden="true"
                />
              </span>
              <span className="text-sm leading-snug text-helper">
                {t("home.cta.supportDescription")}
              </span>
            </Link>
          </SpotlightCard>
        </div>
      </div>
    </section>
  );
};
