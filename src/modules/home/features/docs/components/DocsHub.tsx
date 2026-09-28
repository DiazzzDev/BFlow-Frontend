import { Link } from "react-router";
import { ChevronRight } from "lucide-react";
import { useTranslation } from "react-i18next";

import { DOCS_HUB_ID, DOCS_PAGES, getDocsPath } from "../utils/docsContent";

export const DocsHub = () => {
    const { t } = useTranslation();
    const pages = DOCS_PAGES.filter(({ id }) => id !== "introduction");

    return (
        <section id={DOCS_HUB_ID} className="scroll-mt-24">
            <h2 className="text-2xl font-semibold tracking-tight text-light">
                {t("docs.hub.title")}
            </h2>
            <p className="mt-4 text-sm leading-relaxed text-label md:text-base">
                {t("docs.hub.description")}
            </p>

            <div className="mt-6 grid gap-3 sm:grid-cols-2">
                {pages.map(({ id, slug, Icon }) => (
                    <Link
                        key={id}
                        to={getDocsPath(slug)}
                        className="group flex items-start gap-3 rounded-xl border border-light-10 bg-surface p-4 transition-colors hover:border-primary-50"
                    >
                        <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary-15 text-primary">
                            <Icon className="h-4 w-4" />
                        </span>
                        <span className="min-w-0 flex-1">
                            <span className="block text-sm font-semibold text-light">
                                {t(`docs.pages.${id}.title`)}
                            </span>
                            <span className="mt-1 block text-xs leading-relaxed text-helper">
                                {t(`docs.pages.${id}.description`)}
                            </span>
                        </span>
                        <ChevronRight className="mt-0.5 h-4 w-4 shrink-0 text-helper transition-transform group-hover:translate-x-0.5 group-hover:text-primary" />
                    </Link>
                ))}
            </div>
        </section>
    );
};
