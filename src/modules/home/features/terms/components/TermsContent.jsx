export const TermsContent = ({ intro, sectionTitles, sections, footerNote }) => {
    return (
        <main className="flex-1 min-w-0 flex flex-col gap-10">
            {/* Intro */}
            <div className="bg-[var(--bg-card)] border border-[var(--border-subtle)] rounded-xl p-6">
                <p className="text-sm text-[var(--text-muted)] leading-relaxed mb-3">
                    {intro.p1.split("BFlow Studio").map((part, i) =>
                        i === 0 ? (
                            <span key={i}>
                                {part}
                                <span className="text-white font-medium">BFlow Studio</span>
                            </span>
                        ) : (
                            <span key={i}>
                                {part.split("BFlow")[0]}
                                <span className="text-white font-medium">BFlow</span>
                                {part.split("BFlow")[1]?.split("bflow-studio.com")[0]}
                                <a href="https://bflow-studio.com" className="text-[var(--accent-orange)] hover:underline">
                                    bflow-studio.com
                                </a>
                                {part.split("bflow-studio.com")[1]}
                            </span>
                        )
                    )}
                </p>
                <p className="text-sm text-[var(--text-muted)] leading-relaxed">
                    {intro.p2.split(/(\bNo se conecta directamente a cuentas bancarias\b|does not connect directly to bank accounts)/i).map((part, i) =>
                        i === 1 ? <span key={i} className="text-white">{part}</span> : part
                    )}
                </p>
            </div>

            {/* Section 1 */}
            <section id="services" style={{ scrollMarginTop: "96px" }}>
                <h2 className="text-xl font-semibold mb-4 pb-3 border-b border-[var(--border-subtle)]">{sectionTitles.services}</h2>
                <p className="text-sm text-[var(--text-muted)] leading-relaxed">{sections.services.text}</p>
            </section>

            {/* Section 2 */}
            <section id="ip" style={{ scrollMarginTop: "96px" }}>
                <h2 className="text-xl font-semibold mb-4 pb-3 border-b border-[var(--border-subtle)]">{sectionTitles.ip}</h2>
                <p className="text-sm text-[var(--text-muted)] leading-relaxed mb-4">{sections.ip.intro}</p>
                <div className="bg-[var(--bg-card)] border border-[var(--border-subtle)] rounded-xl p-5 mb-4">
                    <p className="text-sm font-medium mb-2">{sections.ip.licenseTitle}</p>
                    <ul className="flex flex-col gap-2">
                        {sections.ip.licenseItems.map(item => (
                            <li key={item} className="flex items-center gap-2 text-sm text-[var(--text-muted)]">
                                <div className="w-1.5 h-1.5 rounded-full bg-[var(--color-positive)] flex-shrink-0" />
                                {item}
                            </li>
                        ))}
                    </ul>
                </div>
                <p className="text-sm text-[var(--text-muted)] leading-relaxed">{sections.ip.footer}</p>
            </section>

            {/* Section 3 */}
            <section id="representations" style={{ scrollMarginTop: "96px" }}>
                <h2 className="text-xl font-semibold mb-4 pb-3 border-b border-[var(--border-subtle)]">{sectionTitles.representations}</h2>
                <p className="text-sm text-[var(--text-muted)] leading-relaxed mb-4">{sections.representations.intro}</p>
                <div className="grid grid-cols-2 gap-3">
                    {sections.representations.items.map(item => (
                        <div key={item} className="flex items-start gap-2 bg-[var(--bg-card)] border border-[var(--border-subtle)] rounded-lg px-4 py-3 text-sm text-[var(--text-muted)]">
                            <div className="w-1.5 h-1.5 rounded-full bg-[var(--accent-orange)] flex-shrink-0 mt-1.5" />
                            {item}
                        </div>
                    ))}
                </div>
            </section>

            {/* Section 4 */}
            <section id="register" style={{ scrollMarginTop: "96px" }}>
                <h2 className="text-xl font-semibold mb-4 pb-3 border-b border-[var(--border-subtle)]">{sectionTitles.register}</h2>
                <p className="text-sm text-[var(--text-muted)] leading-relaxed">{sections.register.text}</p>
            </section>

            {/* Section 5 */}
            <section id="payments" style={{ scrollMarginTop: "96px" }}>
                <h2 className="text-xl font-semibold mb-4 pb-3 border-b border-[var(--border-subtle)]">{sectionTitles.payments}</h2>
                <p className="text-sm text-[var(--text-muted)] leading-relaxed mb-4">{sections.payments.intro}</p>
                <div className="flex gap-3 mb-4">
                    {sections.payments.methods.map(method => (
                        <div key={method} className="bg-[var(--bg-card)] border border-[var(--border-subtle)] rounded-lg px-4 py-2 text-sm font-medium">
                            {method}
                        </div>
                    ))}
                </div>
                <p className="text-sm text-[var(--text-muted)] leading-relaxed">{sections.payments.footer}</p>
            </section>

            {/* Section 6 */}
            <section id="subscriptions" style={{ scrollMarginTop: "96px" }}>
                <h2 className="text-xl font-semibold mb-4 pb-3 border-b border-[var(--border-subtle)]">{sectionTitles.subscriptions}</h2>
                <p className="text-sm text-[var(--text-muted)] leading-relaxed mb-4">{sections.subscriptions.text}</p>
                <div className="bg-[rgba(249,115,22,0.06)] border border-[rgba(249,115,22,0.15)] rounded-xl p-4">
                    <p className="text-sm text-[var(--text-muted)] leading-relaxed">
                        <span className="text-white font-medium">{sections.subscriptions.refundLabel}</span>{" "}
                        {sections.subscriptions.refundText.split("support@bflow-studio.com")[0]}
                        <a href="mailto:support@bflow-studio.com" className="text-[var(--accent-orange)] hover:underline">support@bflow-studio.com</a>
                        {sections.subscriptions.refundText.split("support@bflow-studio.com")[1]}
                    </p>
                </div>
            </section>

            {/* Section 7 */}
            <section id="prohibited" style={{ scrollMarginTop: "96px" }}>
                <h2 className="text-xl font-semibold mb-4 pb-3 border-b border-[var(--border-subtle)]">{sectionTitles.prohibited}</h2>
                <p className="text-sm text-[var(--text-muted)] leading-relaxed mb-4">{sections.prohibited.intro}</p>
                <div className="flex flex-col gap-2">
                    {sections.prohibited.items.map(item => (
                        <div key={item} className="flex items-center gap-2 text-sm text-[var(--text-muted)] py-2 border-b border-[rgba(255,255,255,0.03)] last:border-0">
                            <div className="w-1.5 h-1.5 rounded-full bg-[var(--color-negative)] flex-shrink-0" />
                            {item}
                        </div>
                    ))}
                </div>
            </section>

            {/* Section 8 */}
            <section id="ai" style={{ scrollMarginTop: "96px" }}>
                <h2 className="text-xl font-semibold mb-4 pb-3 border-b border-[var(--border-subtle)]">{sectionTitles.ai}</h2>
                <p className="text-sm text-[var(--text-muted)] leading-relaxed mb-3">{sections.ai.intro}</p>
                <div className="bg-[var(--bg-card)] border border-[var(--border-subtle)] rounded-xl p-5">
                    <p className="text-sm font-medium mb-3">{sections.ai.noteTitle}</p>
                    <ul className="flex flex-col gap-2">
                        {sections.ai.noteItems.map(item => (
                            <li key={item} className="flex items-center gap-2 text-sm text-[var(--text-muted)]">
                                <div className="w-1.5 h-1.5 rounded-full bg-[var(--accent-orange)] flex-shrink-0" />
                                {item}
                            </li>
                        ))}
                    </ul>
                </div>
            </section>

            {/* Section 9 */}
            <section id="contributions" style={{ scrollMarginTop: "96px" }}>
                <h2 className="text-xl font-semibold mb-4 pb-3 border-b border-[var(--border-subtle)]">{sectionTitles.contributions}</h2>
                <p className="text-sm text-[var(--text-muted)] leading-relaxed">{sections.contributions.text}</p>
            </section>

            {/* Section 10 */}
            <section id="yourip" style={{ scrollMarginTop: "96px" }}>
                <h2 className="text-xl font-semibold mb-4 pb-3 border-b border-[var(--border-subtle)]">{sectionTitles.yourip}</h2>
                <p className="text-sm text-[var(--text-muted)] leading-relaxed">{sections.yourip.text}</p>
            </section>

            {/* Section 11 */}
            <section id="social" style={{ scrollMarginTop: "96px" }}>
                <h2 className="text-xl font-semibold mb-4 pb-3 border-b border-[var(--border-subtle)]">{sectionTitles.social}</h2>
                <p className="text-sm text-[var(--text-muted)] leading-relaxed">{sections.social.text}</p>
            </section>

            {/* Section 12 */}
            <section id="thirdparty" style={{ scrollMarginTop: "96px" }}>
                <h2 className="text-xl font-semibold mb-4 pb-3 border-b border-[var(--border-subtle)]">{sectionTitles.thirdparty}</h2>
                <p className="text-sm text-[var(--text-muted)] leading-relaxed">{sections.thirdparty.text}</p>
            </section>

            {/* Section 13 */}
            <section id="management" style={{ scrollMarginTop: "96px" }}>
                <h2 className="text-xl font-semibold mb-4 pb-3 border-b border-[var(--border-subtle)]">{sectionTitles.management}</h2>
                <p className="text-sm text-[var(--text-muted)] leading-relaxed">{sections.management.text}</p>
            </section>

            {/* Section 14 */}
            <section id="dataroles" style={{ scrollMarginTop: "96px" }}>
                <h2 className="text-xl font-semibold mb-4 pb-3 border-b border-[var(--border-subtle)]">{sectionTitles.dataroles}</h2>
                <p className="text-sm text-[var(--text-muted)] leading-relaxed mb-3">
                    {sections.dataroles.text.split(sections.dataroles.privacyLinkText)[0]}
                    <a href="/privacy" className="text-[var(--accent-orange)] hover:underline">{sections.dataroles.privacyLinkText}</a>
                    {sections.dataroles.text.split(sections.dataroles.privacyLinkText)[1]}
                </p>
            </section>

            {/* Section 15 */}
            <section id="copyright" style={{ scrollMarginTop: "96px" }}>
                <h2 className="text-xl font-semibold mb-4 pb-3 border-b border-[var(--border-subtle)]">{sectionTitles.copyright}</h2>
                <p className="text-sm text-[var(--text-muted)] leading-relaxed">
                    {sections.copyright.text.split("legal@bflow-studio.com")[0]}
                    <a href="mailto:legal@bflow-studio.com" className="text-[var(--accent-orange)] hover:underline">legal@bflow-studio.com</a>
                    {sections.copyright.text.split("legal@bflow-studio.com")[1]}
                </p>
            </section>

            {/* Section 16 */}
            <section id="termination" style={{ scrollMarginTop: "96px" }}>
                <h2 className="text-xl font-semibold mb-4 pb-3 border-b border-[var(--border-subtle)]">{sectionTitles.termination}</h2>
                <p className="text-sm text-[var(--text-muted)] leading-relaxed mb-3">{sections.termination.para1}</p>
                <p className="text-sm text-[var(--text-muted)] leading-relaxed">{sections.termination.para2}</p>
            </section>

            {/* Section 17 */}
            <section id="modifications" style={{ scrollMarginTop: "96px" }}>
                <h2 className="text-xl font-semibold mb-4 pb-3 border-b border-[var(--border-subtle)]">{sectionTitles.modifications}</h2>
                <p className="text-sm text-[var(--text-muted)] leading-relaxed">{sections.modifications.text}</p>
            </section>

            {/* Section 18 */}
            <section id="law" style={{ scrollMarginTop: "96px" }}>
                <h2 className="text-xl font-semibold mb-4 pb-3 border-b border-[var(--border-subtle)]">{sectionTitles.law}</h2>
                <p className="text-sm text-[var(--text-muted)] leading-relaxed mb-4">{sections.law.intro}</p>
                <div className="grid grid-cols-2 gap-3">
                    {sections.law.lawItems.map(({ region, law }) => (
                        <div key={region} className="bg-[var(--bg-card)] border border-[var(--border-subtle)] rounded-xl p-4">
                            <p className="text-sm font-medium mb-1">{region}</p>
                            <p className="text-xs text-[var(--text-muted)]">{law}</p>
                        </div>
                    ))}
                </div>
            </section>

            {/* Section 19 */}
            <section id="disputes" style={{ scrollMarginTop: "96px" }}>
                <h2 className="text-xl font-semibold mb-4 pb-3 border-b border-[var(--border-subtle)]">{sectionTitles.disputes}</h2>
                <p className="text-sm text-[var(--text-muted)] leading-relaxed mb-3">
                    {sections.disputes.para1.split("support@bflow-studio.com")[0]}
                    <a href="mailto:support@bflow-studio.com" className="text-[var(--accent-orange)] hover:underline">support@bflow-studio.com</a>
                    {sections.disputes.para1.split("support@bflow-studio.com")[1]}
                </p>
                <p className="text-sm text-[var(--text-muted)] leading-relaxed">{sections.disputes.para2}</p>
            </section>

            {/* Section 20 */}
            <section id="corrections" style={{ scrollMarginTop: "96px" }}>
                <h2 className="text-xl font-semibold mb-4 pb-3 border-b border-[var(--border-subtle)]">{sectionTitles.corrections}</h2>
                <p className="text-sm text-[var(--text-muted)] leading-relaxed">{sections.corrections.text}</p>
            </section>

            {/* Section 21 */}
            <section id="warranty" style={{ scrollMarginTop: "96px" }}>
                <h2 className="text-xl font-semibold mb-4 pb-3 border-b border-[var(--border-subtle)]">{sectionTitles.warranty}</h2>
                <div className="bg-[rgba(239,68,68,0.06)] border border-[rgba(239,68,68,0.15)] rounded-xl p-5 mb-4">
                    <p className="text-sm text-[var(--text-muted)] leading-relaxed">
                        <span className="text-white font-medium">{sections.warranty.asIsLabel}</span>{" "}
                        {sections.warranty.asIsText}
                    </p>
                </div>
                <p className="text-sm text-[var(--text-muted)] leading-relaxed mb-3">
                    <span className="text-white font-medium">{sections.warranty.financialLabel}</span>{" "}
                    {sections.warranty.financialText}
                </p>
                <p className="text-sm text-[var(--text-muted)] leading-relaxed">
                    <span className="text-white font-medium">{sections.warranty.dataLossLabel}</span>{" "}
                    {sections.warranty.dataLossText}
                </p>
            </section>

            {/* Section 22 */}
            <section id="liability" style={{ scrollMarginTop: "96px" }}>
                <h2 className="text-xl font-semibold mb-4 pb-3 border-b border-[var(--border-subtle)]">{sectionTitles.liability}</h2>
                <div className="bg-[var(--bg-card)] border border-[var(--border-subtle)] rounded-xl p-5 mb-4">
                    <p className="text-sm font-medium mb-2">{sections.liability.capTitle}</p>
                    <p className="text-sm text-[var(--text-muted)] leading-relaxed">
                        {sections.liability.capText.split(sections.liability.capHighlight)[0]}
                        <span className="text-white font-medium">{sections.liability.capHighlight}</span>
                        {sections.liability.capText.split(sections.liability.capHighlight)[1]}
                    </p>
                </div>
                <p className="text-sm text-[var(--text-muted)] leading-relaxed mb-3">{sections.liability.indirect}</p>
                <p className="text-sm font-medium mb-2">{sections.liability.exceptionsTitle}</p>
                <ul className="flex flex-col gap-2">
                    {sections.liability.exceptions.map(item => (
                        <li key={item} className="flex items-center gap-2 text-sm text-[var(--text-muted)]">
                            <div className="w-1.5 h-1.5 rounded-full bg-[var(--color-negative)] flex-shrink-0" />
                            {item}
                        </li>
                    ))}
                </ul>
            </section>

            {/* Section 23 */}
            <section id="dataprotection" style={{ scrollMarginTop: "96px" }}>
                <h2 className="text-xl font-semibold mb-4 pb-3 border-b border-[var(--border-subtle)]">{sectionTitles.dataprotection}</h2>
                <p className="text-sm text-[var(--text-muted)] leading-relaxed mb-3">{sections.dataprotection.para1}</p>
                <p className="text-sm text-[var(--text-muted)] leading-relaxed">{sections.dataprotection.para2}</p>
            </section>

            {/* Section 24 */}
            <section id="indemnification" style={{ scrollMarginTop: "96px" }}>
                <h2 className="text-xl font-semibold mb-4 pb-3 border-b border-[var(--border-subtle)]">{sectionTitles.indemnification}</h2>
                <p className="text-sm text-[var(--text-muted)] leading-relaxed">{sections.indemnification.text}</p>
            </section>

            {/* Section 25 */}
            <section id="userdata" style={{ scrollMarginTop: "96px" }}>
                <h2 className="text-xl font-semibold mb-4 pb-3 border-b border-[var(--border-subtle)]">{sectionTitles.userdata}</h2>
                <p className="text-sm text-[var(--text-muted)] leading-relaxed">{sections.userdata.text}</p>
            </section>

            {/* Section 26 */}
            <section id="electronic" style={{ scrollMarginTop: "96px" }}>
                <h2 className="text-xl font-semibold mb-4 pb-3 border-b border-[var(--border-subtle)]">{sectionTitles.electronic}</h2>
                <p className="text-sm text-[var(--text-muted)] leading-relaxed">{sections.electronic.text}</p>
            </section>

            {/* Section 27 */}
            <section id="general" style={{ scrollMarginTop: "96px" }}>
                <h2 className="text-xl font-semibold mb-4 pb-3 border-b border-[var(--border-subtle)]">{sectionTitles.general}</h2>
                <p className="text-sm text-[var(--text-muted)] leading-relaxed mb-3">{sections.general.para1}</p>
                <p className="text-sm text-[var(--text-muted)] leading-relaxed">{sections.general.para2}</p>
            </section>

            {/* Section 28 */}
            <section id="contact" style={{ scrollMarginTop: "96px" }}>
                <h2 className="text-xl font-semibold mb-4 pb-3 border-b border-[var(--border-subtle)]">{sectionTitles.contact}</h2>
                <div className="bg-[var(--bg-card)] border border-[var(--border-subtle)] rounded-xl p-6 flex flex-col gap-4">
                    <div>
                        <p className="text-xs uppercase tracking-widest text-[var(--text-label)] mb-1">{sections.contact.addressLabel}</p>
                        <p className="text-sm text-[var(--text-muted)]">{sections.contact.addressValue}</p>
                    </div>
                    <div>
                        <p className="text-xs uppercase tracking-widest text-[var(--text-label)] mb-1">{sections.contact.supportLabel}</p>
                        <a href="mailto:support@bflow-studio.com" className="text-sm text-[var(--accent-orange)] hover:underline">support@bflow-studio.com</a>
                    </div>
                    <div>
                        <p className="text-xs uppercase tracking-widest text-[var(--text-label)] mb-1">{sections.contact.legalLabel}</p>
                        <a href="mailto:legal@bflow-studio.com" className="text-sm text-[var(--accent-orange)] hover:underline">legal@bflow-studio.com</a>
                    </div>
                    <div>
                        <p className="text-xs uppercase tracking-widest text-[var(--text-label)] mb-1">{sections.contact.openSourceLabel}</p>
                        <a href="https://github.com/DiazzzDev/BFlow-Backend-Open-Source" target="_blank" rel="noreferrer" className="text-sm text-[var(--accent-orange)] hover:underline">
                            github.com/DiazzzDev/BFlow-Backend-Open-Source
                        </a>
                    </div>
                </div>
            </section>

            {/* Footer note */}
            <div className="bg-[var(--bg-card)] border border-[var(--border-subtle)] rounded-xl p-5 text-center">
                <p className="text-xs text-[var(--text-label)]">{footerNote}</p>
            </div>
        </main>
    );
};