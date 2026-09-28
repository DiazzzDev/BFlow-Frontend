import { Navigate } from "react-router";
import { useTranslation } from "react-i18next";

import { DocsHub } from "./components/DocsHub";
import { DocsMobileNav } from "./components/DocsMobileNav";
import { DocsPagination } from "./components/DocsPagination";
import { DocsSection } from "./components/DocsSection";
import { DocsSidebar } from "./components/DocsSidebar";
import { DocsToc } from "./components/DocsToc";
import { useActiveSection } from "./hooks/useActiveSection";
import { useDocsPage } from "./hooks/useDocsPage";
import type { DocsTocItem } from "./interfaces/DocsSection";
import { DOCS_BASE_PATH, DOCS_HUB_ID } from "./utils/docsContent";

export const DocsPage = () => {
    const { t } = useTranslation();
    const { page, group, sections, previous, next } = useDocsPage();
    const isIntroduction = page?.id === "introduction";

    const tocItems: DocsTocItem[] = sections.map(({ id, title }) => ({ id, title }));
    if (isIntroduction) {
        tocItems.push({ id: DOCS_HUB_ID, title: t("docs.hub.title") });
    }

    const activeId = useActiveSection(tocItems.map(({ id }) => id));

    if (!page) {
        return <Navigate to={DOCS_BASE_PATH} replace />;
    }

    return (
        <div className="mx-auto grid w-full max-w-360 gap-10 px-8 lg:grid-cols-[15rem_minmax(0,1fr)] xl:grid-cols-[15rem_minmax(0,1fr)_13rem]">
            <DocsSidebar />

            <main className="min-w-0 max-w-3xl py-10 md:py-14">
                <DocsMobileNav page={page} />

                <header className="border-b border-light-5 pb-8">
                    {group && (
                        <p className="text-xs font-semibold uppercase tracking-widest text-primary">
                            {t(`docs.groups.${group.id}`)}
                        </p>
                    )}
                    <h1 className="mt-3 text-3xl font-bold tracking-tight text-light md:text-4xl">
                        {t(`docs.pages.${page.id}.title`)}
                    </h1>
                    <p className="mt-3 text-base leading-relaxed text-helper">
                        {t(`docs.pages.${page.id}.description`)}
                    </p>
                </header>

                <div className="mt-10 flex flex-col gap-12">
                    {sections.map((section) => (
                        <DocsSection key={section.id} section={section} />
                    ))}
                    {isIntroduction && <DocsHub />}
                </div>

                <DocsPagination previous={previous} next={next} />
            </main>

            <DocsToc items={tocItems} activeId={activeId} />
        </div>
    );
};
