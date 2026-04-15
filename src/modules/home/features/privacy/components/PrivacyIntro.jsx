import { getPrivacyData } from "../constants/privacyData.js"

export const PrivacyIntro = ({ locale }) => {
    const { introParagraphs, introContact } = getPrivacyData(locale);
    return (
        <div className="bg-[var(--bg-card)] border border-[var(--border-subtle)] rounded-xl p-6 mb-8">
            {introParagraphs.map(paragraph => (
                <p key={paragraph} className="text-sm text-[var(--text-muted)] leading-relaxed mb-4">
                    {paragraph}
                </p>
            ))}
            <p className="text-sm text-[var(--text-muted)] leading-relaxed">{introContact}
                <a href="mailto:support@bflow-studio.com" className="text-[var(--accent-orange)] hover:underline">support@bflow-studio.com</a>.
            </p>
        </div>
    )
}
