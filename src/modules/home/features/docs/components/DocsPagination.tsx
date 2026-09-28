import { Link } from "react-router";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { useTranslation } from "react-i18next";

import { getDocsPath, type DocsPage } from "../utils/docsContent";

interface DocsPaginationProps {
    previous?: DocsPage;
    next?: DocsPage;
}

export const DocsPagination = ({ previous, next }: DocsPaginationProps) => {
    const { t } = useTranslation();

    return (
        <nav className="mt-16 grid gap-3 border-t border-light-5 pt-8 sm:grid-cols-2">
            {previous && (
                <Link
                    to={getDocsPath(previous.slug)}
                    className="group flex flex-col gap-1 rounded-xl border border-light-10 px-4 py-3.5 transition-colors hover:border-primary-50"
                >
                    <span className="flex items-center gap-1.5 text-xs text-helper">
                        <ArrowLeft className="h-3.5 w-3.5 transition-transform group-hover:-translate-x-0.5" />
                        {t("docs.previous")}
                    </span>
                    <span className="text-sm font-medium text-light">
                        {t(`docs.pages.${previous.id}.title`)}
                    </span>
                </Link>
            )}

            {next && (
                <Link
                    to={getDocsPath(next.slug)}
                    className="group flex flex-col items-end gap-1 rounded-xl border border-light-10 px-4 py-3.5 text-right transition-colors hover:border-primary-50 sm:col-start-2"
                >
                    <span className="flex items-center gap-1.5 text-xs text-helper">
                        {t("docs.next")}
                        <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
                    </span>
                    <span className="text-sm font-medium text-light">
                        {t(`docs.pages.${next.id}.title`)}
                    </span>
                </Link>
            )}
        </nav>
    );
};
