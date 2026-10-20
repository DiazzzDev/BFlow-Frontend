import { useNavigate } from "react-router";
import { useTranslation } from "react-i18next";

import { DOCS_GROUPS, getDocsPath, type DocsPage } from "../utils/docsContent";

interface DocsMobileNavProps {
    page: DocsPage;
}

export const DocsMobileNav = ({ page }: DocsMobileNavProps) => {
    const { t } = useTranslation();
    const navigate = useNavigate();

    return (
        <div className="mb-8 lg:hidden">
            <label htmlFor="docsNavigation" className="mb-2 block text-xs font-medium text-helper">
                {t("docs.navigate")}
            </label>
            <select
                id="docsNavigation"
                value={page.slug}
                onChange={(event) => {
                    void navigate(getDocsPath(event.target.value));
                }}
                className="w-full cursor-pointer rounded-lg border border-light-10 bg-surface px-3 py-2.5 text-sm text-light outline-none transition-colors hover:border-light-25"
            >
                {DOCS_GROUPS.map(({ id: groupId, pages }) => (
                    <optgroup key={groupId} label={t(`docs.groups.${groupId}`)}>
                        {pages.map(({ id, slug }) => (
                            <option key={id} value={slug}>
                                {t(`docs.pages.${id}.title`)}
                            </option>
                        ))}
                    </optgroup>
                ))}
            </select>
        </div>
    );
};
