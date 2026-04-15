import { useState } from "react";

import { PolicySidebar } from "../../components/PolicySidebar.jsx";
import { PolicyHeader } from "../../components/PolicyHeader.jsx";

import { TermsContent } from "./components/TermsContent.jsx";
import { getTermsData } from "./constants/termsData.js";

export const TermsPage = () => {
    const [locale, setLocale] = useState("es");
    const { header, sidebarItems, intro, sectionTitles, sections, footerNote } = getTermsData(locale)
    return (
        <div className="min-h-screen bg-[var(--bg-main)] text-[var(--text-primary)]">
            <PolicyHeader setLocale={setLocale} header={header} />
            <div className="flex px-20 py-12 gap-12 max-w-[1200px] mx-auto">
                <PolicySidebar sidebarItems={sidebarItems} />
                <TermsContent intro={intro} sectionTitles={sectionTitles} sections={sections} footerNote={footerNote} />
            </div>
        </div>
    );
};