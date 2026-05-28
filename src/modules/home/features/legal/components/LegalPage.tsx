import { useEffect, useMemo } from "react";
import { Calendar, Mail, Globe } from "lucide-react";
import type { LegalDocumentType } from "../../legal.service.ts";
import { useGetLegalDocument } from "../hooks/useGetLegalDocument.ts";

import { LegalMarkdown } from "./LegalMarkdown.tsx";
import { LegalSkeleton } from "./LegalSkeleton.tsx";
import { LegalError } from "./LegalError.tsx";
import { LegalScrollProgress } from "./LegalScrollProgress.tsx";

interface LegalPageProps {
    documentType: LegalDocumentType;
    title: string;
    description: string;
}

const LANG_LABELS: Record<string, string> = {
    es: "Español",
    en: "English",
};

function extractHeadings(markdown: string): Array<{ id: string; label: string }> {

    const lines = markdown.split("\n");
    const headings: Array<{ id: string; label: string }> = [];
    const pattern = /^#{1,2}\s+(.+)$/;

    for (const line of lines) {

        const match = pattern.exec(line);

        if (match) {
            const label = match[1].replace(/[*_`]/g, "").trim();

            const id = label
                .toLowerCase()
                .replace(/[^a-z0-9\s]/g, "")
                .replace(/\s+/g, "-");
            headings.push({ id, label });
        }
    }
    return headings;
}

export const LegalPage = ({ documentType, title, description }: LegalPageProps) => {

    const { data, isLoading, isError, refetch, lang, setLang } =
        useGetLegalDocument(documentType);

    const headings = useMemo(
        () => (data?.content ? extractHeadings(data.content) : []),
        [data]
    );

    useEffect(() => {
        window.scrollTo({ top: 0 });
    }, [documentType, lang]);

    const scrollTo = (id: string) => {
        const el = document.getElementById(id);
        if (el) {
            el.scrollIntoView({ behavior: "smooth", block: "start" });
        }
    };

    return (
        <>
            <LegalScrollProgress />

            <div className="min-h-screen bg-background text-(--text-foreground)">

                {/* Header */}
                <div className="border-b border-border px-6 md:px-20 py-10 md:py-14">
                    <div className="max-w-300 mx-auto flex flex-col md:flex-row md:items-start md:justify-between gap-6">
                        <div className="flex-1 min-w-0">
                            <p className="text-xs tracking-widest uppercase text-(--tertiary) mb-3">
                                Legal
                            </p>

                            <h1 className="text-3xl md:text-4xl font-bold tracking-tight mb-3">
                                {title}
                            </h1>

                            <p className="text-sm text-(--text-muted) max-w-lg">{description}</p>

                            {data && (
                                <div className="flex flex-wrap items-center gap-4 mt-5">
                                    <span className="flex items-center gap-1.5 text-xs text-text-label">
                                        <Calendar className="w-3.5 h-3.5" />
                                        Actualizado el {data.lastUpdated}
                                    </span>
                                    <span className="flex items-center gap-1.5 text-xs text-text-label">
                                        <Mail className="w-3.5 h-3.5" />
                                        {data.contactEmail}
                                    </span>
                                    <span className="flex items-center gap-1.5 text-xs text-text-label">
                                        <Globe className="w-3.5 h-3.5" />
                                        {LANG_LABELS[data.language] ?? data.language}
                                    </span>
                                </div>
                            )}
                        </div>

                        {/* Language selector */}
                        <div className="shrink-0">
                            <select
                                className="bg-(--card) border border-border text-(--text-foreground) rounded-lg px-3 py-2 text-sm cursor-pointer hover:border-white/20 transition-colors outline-none"
                                value={lang}
                                onChange={(e) => setLang(e.target.value as "es" | "en")}
                            >
                                <option value="es">Español</option>
                                <option value="en">English</option>
                            </select>
                        </div>
                    </div>
                </div>

                {/* Body */}
                <div className="max-w-300 mx-auto px-6 md:px-20 py-10 md:py-12 flex gap-12">

                    {/* Sidebar – hidden on mobile */}

                    {!isLoading && !isError && headings.length > 0 && (
                        <aside className="hidden lg:block w-56 shrink-0">
                            <div className="sticky top-28">
                                <p className="text-xs tracking-widest uppercase text-text-label mb-4">
                                    Contenido
                                </p>

                                <nav className="flex flex-col gap-0.5">
                                    {headings.map(({ id, label }) => (
                                        <button
                                            key={id}
                                            onClick={() => scrollTo(id)}
                                            className="text-xs text-(--text-muted) hover:text-(--text-foreground) transition-colors py-1.5 px-3 rounded-lg hover:bg-(--card) leading-snug cursor-pointer text-left"
                                        >
                                            {label}
                                        </button>
                                    ))}
                                </nav>
                            </div>
                        </aside>
                    )}

                    {/* Main content */}
                    <main className="flex-1 min-w-0 max-w-3xl">
                        {isLoading && <LegalSkeleton />}
                        {isError && <LegalError onRetry={refetch} />}
                        {data && !isLoading && <LegalMarkdown content={data.content} />}
                    </main>
                </div>
            </div>
        </>
    );
}; 
