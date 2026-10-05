import { AlignLeft } from "lucide-react";
import { useTranslation } from "react-i18next";

import type { DocsTocItem } from "../interfaces/DocsSection";

interface DocsTocProps {
    items: DocsTocItem[];
    activeId: string | undefined;
}

const scrollToSection = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
};

export const DocsToc = ({ items, activeId }: DocsTocProps) => {
    const { t } = useTranslation();

    return (
        <aside className="sticky top-16 hidden h-[calc(100vh-4rem)] overflow-y-auto py-10 xl:block">
            <p className="mb-4 flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-helper">
                <AlignLeft className="h-3.5 w-3.5" />
                {t("docs.onThisPage")}
            </p>
            <nav className="flex flex-col border-l border-light-10">
                {items.map(({ id, title }) => (
                    <button
                        key={id}
                        type="button"
                        onClick={() => scrollToSection(id)}
                        className={`-ml-px cursor-pointer border-l py-1.5 pl-4 text-left text-sm leading-snug transition-colors ${
                            activeId === id
                                ? "border-primary text-primary"
                                : "border-transparent text-helper hover:text-light"
                        }`}
                    >
                        {title}
                    </button>
                ))}
            </nav>
        </aside>
    );
};
