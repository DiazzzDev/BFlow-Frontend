import { useState } from "react"

import { PolicyHeader } from "../../components/PolicyHeader.tsx"
import { PolicySidebar } from "../../components/PolicySidebar.tsx"

export const PrivacyPage = () => {
    fetch("https://bflow-backend.onrender.com/api/auth/login")
    return (
        <div className="min-h-screen bg-[var(--bg-main)] text-[var(--text-primary)]">
            <div className="flex px-20 py-12 gap-12 max-w-[1200px] mx-auto">
                <main className="flex-1 min-w-0">

                    <div className="mb-10" />
                </main>
            </div>
        </div>
    )
}
