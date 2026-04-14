import { useState } from "react"

import { PolicyHeader } from "../../components/PolicyHeader.jsx"
import { PolicySidebar } from "../../components/PolicySidebar.jsx"

import { KeyPoints } from "./components/KeyPoints.jsx"
import { PrivacyIntro } from "./components/PrivacyIntro.jsx"
import { PrivacyContent } from "./components/PrivacyContent.jsx"
import { getPrivacyData } from "./constants/privacyData.js"


export const PrivacyPage = () => {
    const [locale, setLocale] = useState("es");
    const { keyPointsTitle, header, sidebarItems } = getPrivacyData(locale);
    return (
        <div className="min-h-screen bg-[var(--bg-main)] text-[var(--text-primary)]">
            <PolicyHeader locale={locale} setLocale={setLocale} header={header} />
            <div className="flex px-20 py-12 gap-12 max-w-[1200px] mx-auto">
                <PolicySidebar sidebarItems={sidebarItems} />
                <main className="flex-1 min-w-0">
                    <PrivacyIntro locale={locale} />

                    <div className="mb-10">
                        <h2 className="text-xl font-semibold mb-4">{keyPointsTitle}</h2>
                        <KeyPoints locale={locale} />
                    </div>

                    <PrivacyContent locale={locale} />
                </main>
            </div>
        </div>
    )
}
