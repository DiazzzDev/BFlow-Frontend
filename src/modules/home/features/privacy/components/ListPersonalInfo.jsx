import { getPrivacyData } from "../constants/privacyData.js"

export const ListPersonalInfo = ({ locale }) => {
    const { personalInfo } = getPrivacyData(locale);
    return (
        <ul className="flex flex-col gap-2 mb-5">
            {personalInfo.map(item => (
                <li key={item} className="flex items-center gap-2 text-sm text-[var(--text-muted)]">
                    <div className="w-1.5 h-1.5 rounded-full bg-[var(--accent-orange)] flex-shrink-0" />
                    {item}
                </li>
            ))}
        </ul>
    )
}