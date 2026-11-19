import { ExternalLink } from "lucide-react";
import { NavLink } from "react-router";
import { useTranslation } from "react-i18next";

import { DOCS_GROUPS, getDocsPath } from "../utils/docsContent";

export const DocsSidebar = () => {
    const { t } = useTranslation();

    return (
        <aside className="sticky top-16 hidden h-[calc(100vh-4rem)] overflow-y-auto border-r border-light-5 py-10 pr-4 lg:block">
            <nav aria-label={t("docs.label")} className="flex flex-col gap-8">
                {DOCS_GROUPS.map(({ id: groupId, pages }) => (
                    <div key={groupId}>
                        <p className="mb-3 px-3 text-xs font-semibold uppercase tracking-widest text-helper">
                            {t(`docs.groups.${groupId}`)}
                        </p>
                        <ul className="flex flex-col gap-0.5">
                            {pages.map(({ id, slug, Icon }) => (
                                <li key={id}>
                                    <NavLink
                                        to={getDocsPath(slug)}
                                        end
                                        className={({ isActive }) =>
                                            `flex items-center gap-2.5 rounded-lg px-3 py-2 text-sm transition-colors ${
                                                isActive
                                                    ? "bg-primary-15 font-medium text-primary"
                                                    : "text-label hover:bg-light-5 hover:text-light"
                                            }`
                                        }
                                    >
                                        <Icon className="h-4 w-4 shrink-0" />
                                        {t(`docs.pages.${id}.title`)}
                                    </NavLink>
                                </li>
                            ))}
                        </ul>
                    </div>
                ))}
                <div>
                    <p className="mb-3 px-3 text-xs font-semibold uppercase tracking-widest text-helper">
                        {t("home.apiReference")}
                    </p>
                    <a
                        href="https://api.bflow-studio.com/swagger-ui/index.html"
                        target="_blank"
                        rel="noreferrer"
                        className="flex items-center justify-between gap-2 rounded-lg px-3 py-2 text-sm text-label transition-colors hover:bg-light-5 hover:text-light"
                    >
                        Swagger
                        <ExternalLink className="h-3.5 w-3.5" aria-hidden="true" />
                    </a>
                </div>
            </nav>
        </aside>
    );
};
