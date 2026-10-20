import { useEffect } from "react";
import { useParams } from "react-router";
import { useTranslation } from "react-i18next";

import type { DocsSectionContent } from "../interfaces/DocsSection";
import { DOCS_GROUPS, DOCS_PAGES } from "../utils/docsContent";

export const useDocsPage = () => {
    const { slug = "" } = useParams();
    const { t } = useTranslation();

    const page = DOCS_PAGES.find((docsPage) => docsPage.slug === slug);
    const index = page ? DOCS_PAGES.indexOf(page) : -1;
    const group = DOCS_GROUPS.find(({ pages }) => pages.some(({ id }) => id === page?.id));

    const sections: DocsSectionContent[] = page
        ? t(`docs.pages.${page.id}.sections`, { returnObjects: true })
        : [];

    useEffect(() => {
        window.scrollTo({ top: 0 });
    }, [slug]);

    return {
        page,
        group,
        sections,
        previous: index > 0 ? DOCS_PAGES[index - 1] : undefined,
        next: index >= 0 && index < DOCS_PAGES.length - 1 ? DOCS_PAGES[index + 1] : undefined,
    };
};
