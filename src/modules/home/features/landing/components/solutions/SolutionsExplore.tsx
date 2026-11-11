import { Link } from "react-router";
import { ArrowRight } from "lucide-react";
import { useTranslation } from "react-i18next";

import { MODULES_PAGE_HREF, MORE_MODULES } from "../../utils/landingContent";

import { getDocsPath } from "@/modules/home/features/docs/utils/docsContent";
import { Button } from "@/components/controls/Button";

export const SolutionsExplore = () => {
    const { t } = useTranslation();

    return (
        <div className="mt-28 grid items-center gap-10 rounded-3xl border border-light-10 bg-surface p-8 md:p-12 lg:grid-cols-[1fr_auto] lg:gap-16">
            <div>
                <h3 className="mt-3 text-2xl font-semibold tracking-tight text-light md:text-3xl">
                    {t("home.solutions.more.title")}
                </h3>
                <p className="mt-3 max-w-xl text-sm leading-relaxed text-helper md:text-base">
                    {t("home.solutions.more.description")}
                </p>

                <ul className="mt-6 flex flex-wrap gap-2">
                    {MORE_MODULES.map(({ id, slug, Icon }) => (
                        <li key={id}>
                            <Link
                                to={getDocsPath(slug)}
                                className="inline-flex items-center gap-2 rounded-full border border-light-10 px-3.5 py-1.5 text-sm text-label transition-colors hover:border-primary hover:text-light"
                            >
                                <Icon className="h-4 w-4 text-primary" />
                                {t(`docs.pages.${id}.title`)}
                            </Link>
                        </li>
                    ))}
                </ul>
            </div>

            <Button
                to={MODULES_PAGE_HREF}
                text={t("home.solutions.more.cta")}
                icon={<ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />}
                className="group w-fit rounded-xl px-6 py-3"
            />
        </div>
    );
};
