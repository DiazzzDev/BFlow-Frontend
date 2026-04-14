import { getPrivacyData } from "../constants/privacyData.js"

export const KeyPoints = ({ locale }) => {
    const { keyPoints } = getPrivacyData(locale);
    return (
        <div className="flex flex-col gap-3">
            {keyPoints.map(({ q, a }) => (
                <div key={q} className="bg-[var(--bg-card)] border border-[var(--border-subtle)] rounded-xl p-5">
                    <p className="text-sm font-medium mb-1">{q}</p>
                    <p className="text-sm text-[var(--text-muted)] leading-relaxed">{a}</p>
                </div>
            ))}
        </div>
    )
}