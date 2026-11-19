import { Link } from "react-router";
import { ArrowRight } from "lucide-react";
import { useTranslation } from "react-i18next";

import { SolutionScreen } from "./SolutionScreen";
import { SolutionsExplore } from "./SolutionsExplore";
import { SOLUTION_STEPS } from "../../utils/landingContent";

export const LandingSolutions = () => {
    const { t } = useTranslation();

    return (
        <section id="modules" className="w-full max-w-7xl px-4 pb-20 sm:px-8 md:pb-28" aria-labelledby="solutions-title">
            <div className="mb-10 flex flex-col justify-between gap-5 border-t border-light-10 pt-10 md:mb-12 md:flex-row md:items-end">
                <div className="max-w-2xl">
                    <h2 id="solutions-title" className="text-3xl font-bold tracking-tight text-light md:text-5xl">
                        {t("home.solutions.title")}
                    </h2>
                    <p className="mt-4 text-sm leading-relaxed text-helper md:text-base">
                        {t("home.solutions.description")}
                    </p>
                </div>
                <Link to="/docs" className="inline-flex w-fit items-center gap-2 text-sm font-medium text-light transition-colors hover:text-primary focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-primary">
                    {t("home.solutions.more.cta")}
                    <ArrowRight className="h-4 w-4" aria-hidden="true" />
                </Link>
            </div>

            <div className="grid gap-4 lg:grid-cols-3">
                {SOLUTION_STEPS.map(({ id, Icon, path, docsPath, image, focus }) => (
                    <article key={id} className="group min-w-0 overflow-hidden rounded-[1.6rem] border border-light-10 bg-surface-hard transition-colors hover:border-light-25">
                        <div className="relative px-4 pt-4 sm:px-5 sm:pt-5">
                            <SolutionScreen
                                step={{ id, Icon, path, docsPath, image, focus }}
                                className="[&>div:first-child]:p-1 [&>div:nth-child(2)]:h-4 [&>div:nth-child(3)]:h-1.5"
                            />
                        </div>
                        <div className="p-5 sm:p-6">
                            <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.12em] text-primary">
                                <Icon className="h-4 w-4" aria-hidden="true" />
                                {t(`home.solutions.items.${id}.label`)}
                            </div>
                            <h3 className="mt-3 text-xl font-semibold tracking-tight text-light">
                                {t(`home.solutions.items.${id}.title`)}
                            </h3>
                            <p className="mt-2 min-h-12 text-sm leading-relaxed text-helper">
                                {t(`home.solutions.items.${id}.description`)}
                            </p>
                            <Link to={docsPath} className="mt-5 inline-flex items-center gap-2 text-sm font-medium text-light transition-colors hover:text-primary focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-primary">
                                {t("home.solutions.learnMore", { module: t(`home.solutions.items.${id}.label`) })}
                                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" aria-hidden="true" />
                            </Link>
                        </div>
                    </article>
                ))}
            </div>

            <div className="mt-5">
                <SolutionsExplore />
            </div>
        </section>
    );
};
