import { getPrivacyData } from "../constants/privacyData.js";

import { ListPersonalInfo } from "./ListPersonalInfo.jsx"

const Section = ({ id, title, children }) => (
    <section id={id} className="mb-10" style={{ scrollMarginTop: "96px" }}>
        <h2 className="text-xl font-semibold mb-4 pb-3 border-b border-[var(--border-subtle)]">{title}</h2>
        {children}
    </section>
)

export const PrivacyContent = ({ locale }) => {
    const { processRows, shareItems, securityMeasures, rights, lawItems, sections, sectionTitles, footerNote } = getPrivacyData(locale);
    return (
        <div className="space-y-10">
            <Section id="info" title={sectionTitles.info}>
                <p className="text-sm text-[var(--text-muted)] leading-relaxed mb-4">{sections.info.intro}</p>
                <h3 className="text-sm font-semibold mb-2">{sections.info.personalInfoTitle}</h3>
                <ListPersonalInfo locale={locale} />
                <h3 className="text-sm font-semibold mb-2">{sections.info.socialTitle}</h3>
                <p className="text-sm text-[var(--text-muted)] leading-relaxed mb-4">{sections.info.socialDesc}</p>
                <div className="bg-[rgba(249,115,22,0.06)] border border-[rgba(249,115,22,0.15)] rounded-xl p-4">
                    <p className="text-sm text-[var(--text-muted)] leading-relaxed">
                        <span className="text-white font-medium">{sections.info.sensitiveNoteLabel}</span>{sections.info.sensitiveNoteDesc}</p>
                </div>
            </Section>
            <Section id="process" title={sectionTitles.process}>
                <p className="text-sm text-[var(--text-muted)] leading-relaxed mb-4">{sections.process.intro}</p>
                <div className="overflow-x-auto">
                    <table className="w-full text-sm border-collapse">
                        <thead>
                            <tr className="border-b border-[var(--border-subtle)]">
                                {sections.process.tableHeaders.map(header => (
                                    <th key={header} className="text-left py-3 pr-4 text-xs uppercase tracking-widest text-[var(--text-label)] font-medium">
                                        {header}
                                    </th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {processRows.map(([type, purpose, legal, retention]) => (
                                <tr key={type} className="border-b border-[rgba(255,255,255,0.03)]">
                                    <td className="py-3 pr-4 text-[var(--text-muted)]">{type}</td>
                                    <td className="py-3 pr-4 text-[var(--text-muted)]">{purpose}</td>
                                    <td className="py-3 pr-4 text-[var(--text-muted)]">{legal}</td>
                                    <td className="py-3 text-[var(--text-muted)]">{retention}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </Section>

            <Section id="share" title={sectionTitles.share}>
                <p className="text-sm text-[var(--text-muted)] leading-relaxed mb-4">{sections.share.intro}</p>
                {shareItems.map(({ name, desc }) => (
                    <div key={name} className="flex items-start gap-3 py-3 border-b border-[rgba(255,255,255,0.03)] last:border-0">
                        <div className="bg-[rgba(249,115,22,0.1)] text-[var(--accent-orange)] text-xs font-semibold px-2.5 py-1 rounded-md flex-shrink-0">
                            {name}
                        </div>
                        <p className="text-sm text-[var(--text-muted)] leading-relaxed">{desc}</p>
                    </div>
                ))}
                <p className="text-sm text-[var(--text-muted)] leading-relaxed mt-4">{sections.share.footer}</p>
            </Section>

            <Section id="cookies" title={sectionTitles.cookies}>
                <p className="text-sm text-[var(--text-muted)] leading-relaxed">{sections.cookies.text}</p>
            </Section>

            <Section id="social" title={sectionTitles.social}>
                <p className="text-sm text-[var(--text-muted)] leading-relaxed">{sections.social.text}</p>
            </Section>

            <Section id="retention" title={sectionTitles.retention}>
                <p className="text-sm text-[var(--text-muted)] leading-relaxed mb-3">{sections.retention.para1}</p>
                <p className="text-sm text-[var(--text-muted)] leading-relaxed">{sections.retention.para2}</p>
            </Section>

            <Section id="security" title={sectionTitles.security}>
                <p className="text-sm text-[var(--text-muted)] leading-relaxed mb-4">{sections.security.intro}</p>
                <ul className="flex flex-col gap-2">
                    {securityMeasures.map(measure => (
                        <li key={measure} className="flex items-center gap-2 text-sm text-[var(--text-muted)]">
                            <div className="w-1.5 h-1.5 rounded-full bg-[var(--color-positive)] flex-shrink-0" />
                            {measure}
                        </li>
                    ))}
                </ul>
                <p className="text-sm text-[var(--text-muted)] leading-relaxed mt-4">{sections.security.footer}</p>
            </Section>

            <Section id="minors" title={sectionTitles.minors}>
                <p className="text-sm text-[var(--text-muted)] leading-relaxed">
                    {sections.minors.text}
                    <a href="mailto:privacy@bflow-studio.com" className="text-[var(--accent-orange)] hover:underline">privacy@bflow-studio.com</a>.
                </p>
            </Section>

            <Section id="rights" title={sectionTitles.rights}>
                <p className="text-sm text-[var(--text-muted)] leading-relaxed mb-4">{sections.rights.intro}</p>
                <div className="grid grid-cols-2 gap-3">
                    {rights.map(right => (
                        <div key={right} className="bg-[var(--bg-card)] border border-[var(--border-subtle)] rounded-lg px-4 py-3 text-sm text-[var(--text-muted)]">
                            {right}
                        </div>
                    ))}
                </div>
                <p className="text-sm text-[var(--text-muted)] leading-relaxed mt-4">
                    {sections.rights.footer}
                    <a href="mailto:privacy@bflow-studio.com" className="text-[var(--accent-orange)] hover:underline">privacy@bflow-studio.com</a>.
                </p>
            </Section>

            <Section id="dnt" title={sectionTitles.dnt}>
                <p className="text-sm text-[var(--text-muted)] leading-relaxed mb-4">{sections.dnt.para1}</p>
                <h3 className="text-sm font-semibold mb-2">{sections.dnt.gdprTitle}</h3>
                <p className="text-sm text-[var(--text-muted)] leading-relaxed">{sections.dnt.gdprDesc}</p>
            </Section>

            <Section id="updates" title={sectionTitles.updates}>
                <p className="text-sm text-[var(--text-muted)] leading-relaxed">{sections.updates.texts}</p>
            </Section>

            <Section id="contact" title={sectionTitles.contact}>
                <div className="bg-[var(--bg-card)] border border-[var(--border-subtle)] rounded-xl p-6 flex flex-col gap-3">
                    <div>
                        <p className="text-xs uppercase tracking-widest text-[var(--text-label)] mb-1">{sections.contact.postalLabel}</p>
                        <p className="text-sm text-[var(--text-muted)]">{sections.contact.postalValue}</p>
                    </div>
                    <div>
                        <p className="text-xs uppercase tracking-widest text-[var(--text-label)] mb-1">{sections.contact.supportLabel}</p>
                        <a href="mailto:support@bflow-studio.com" className="text-sm text-[var(--accent-orange)] hover:underline">support@bflow-studio.com</a>
                    </div>
                    <div>
                        <p className="text-xs uppercase tracking-widest text-[var(--text-label)] mb-1">{sections.contact.privacyLabel}</p>
                        <a href="mailto:privacy@bflow-studio.com" className="text-sm text-[var(--accent-orange)] hover:underline">privacy@bflow-studio.com</a>
                    </div>
                </div>
            </Section>

            <Section id="delete" title={sectionTitles.delete}>
                <p className="text-sm text-[var(--text-muted)] leading-relaxed mb-4">{sections.delete.text}</p>
                <a
                    href="https://bflow-studio.com/contact"
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-2 bg-[var(--accent-orange)] text-white text-sm font-medium px-5 py-2.5 rounded-lg hover:opacity-90 transition-opacity"
                >
                    {sections.delete.btnText}
                </a>
            </Section>

            <Section id="law" title={sectionTitles.law}>
                <p className="text-sm text-[var(--text-muted)] leading-relaxed mb-4">{sections.law.intro}</p>
                <div className="grid grid-cols-2 gap-3">
                    {lawItems.map(({ region, law }) => (
                        <div key={region} className="bg-[var(--bg-card)] border border-[var(--border-subtle)] rounded-xl p-4">
                            <p className="text-sm font-medium mb-1">{region}</p>
                            <p className="text-xs text-[var(--text-muted)]">{law}</p>
                        </div>
                    ))}
                </div>
            </Section>

            <div className="bg-[var(--bg-card)] border border-[var(--border-subtle)] rounded-xl p-5 text-center">
                <p className="text-xs text-[var(--text-label)]">{footerNote}</p>
            </div>
        </div>
    )
}
