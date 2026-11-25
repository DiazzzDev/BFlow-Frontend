import { SiGithub } from "@icons-pack/react-simple-icons";
import { ArrowUpRight } from "lucide-react";
import { useTranslation } from "react-i18next";

const REPOSITORY_URL = "https://github.com/DiazzzDev/BFlow-Financial-Engine";
export const LandingOpenSource = () => {
  const { t } = useTranslation();

  return (
    <section
      className="w-full max-w-7xl px-4 pb-12 sm:px-8 md:pb-16"
      aria-labelledby="open-source-title"
    >
      <div className="relative isolate overflow-hidden rounded-[2rem] border border-light-10 bg-surface-hard px-7 py-12 sm:px-12 md:py-16">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 -z-10 opacity-45 [background-image:radial-gradient(rgba(105,92,255,0.34)_1px,transparent_1px)] [background-size:1.05rem_1.05rem] [mask-image:radial-gradient(ellipse_at_center,black,transparent_72%)]"
        />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -left-36 top-1/2 -z-10 h-80 w-80 -translate-y-1/2 rounded-full bg-primary/20 blur-[110px]"
        />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -right-24 bottom-0 -z-10 h-56 w-56 rounded-full bg-success/10 blur-[90px]"
        />

        <div className="relative max-w-3xl text-left">
          <h2
            id="open-source-title"
            className="text-3xl font-bold tracking-tight text-light md:text-5xl"
          >
            {t("home.openSource.title")}
          </h2>
          <p className="mt-4 max-w-2xl text-sm leading-relaxed text-helper md:text-base">
            {t("home.openSource.description")}
          </p>
          <a
            href={REPOSITORY_URL}
            target="_blank"
            rel="noreferrer"
            className="mt-6 inline-flex items-center gap-2 rounded-xl border border-light-10 bg-light px-5 py-3 text-sm font-semibold text-surface-hard shadow-custom transition-transform duration-200 ease-out hover:-translate-y-0.5"
          >
            <SiGithub className="h-4 w-4" aria-hidden="true" />
            {t("home.openSource.action")}
            <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
          </a>
        </div>
      </div>
    </section>
  );
};
