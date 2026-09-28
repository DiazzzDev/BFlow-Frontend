import { Check, Info } from "lucide-react";

import type { DocsSectionContent } from "../interfaces/DocsSection";

interface DocsSectionProps {
    section: DocsSectionContent;
}

export const DocsSection = ({ section }: DocsSectionProps) => {
    const { id, title, body, items, note } = section;

    return (
        <section id={id} className="scroll-mt-24">
            <h2 className="text-2xl font-semibold tracking-tight text-light">{title}</h2>

            {body.map((paragraph) => (
                <p key={paragraph} className="mt-4 text-sm leading-relaxed text-label md:text-base">
                    {paragraph}
                </p>
            ))}

            {items && (
                <ul className="mt-5 flex flex-col gap-2.5">
                    {items.map((item) => (
                        <li key={item} className="flex items-start gap-3 text-sm leading-relaxed text-label md:text-base">
                            <Check className="mt-1 h-4 w-4 shrink-0 text-primary" />
                            {item}
                        </li>
                    ))}
                </ul>
            )}

            {note && (
                <div className="mt-6 flex items-start gap-3 rounded-xl border border-light-10 bg-surface px-4 py-3.5 text-sm leading-relaxed text-label">
                    <Info className="mt-0.5 h-4 w-4 shrink-0 text-info" />
                    {note}
                </div>
            )}
        </section>
    );
};
