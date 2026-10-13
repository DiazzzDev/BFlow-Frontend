import { useTranslation } from "react-i18next";

import { useChangeLanguage } from "@/modules/app/hooks/useChangeLanguage";
import { SettingsSectionCard } from "@/modules/app/features/settings/components/SettingsSectionCard";
import { LANGUAGE_LABELS, SUPPORTED_LANGUAGES, type LanguageCode } from "@/i18n/types";

export const LanguageSettingsSection = () => {
    const { t } = useTranslation();
    const { activeLanguage, changeLanguage, isPending } = useChangeLanguage();

    return (
        <SettingsSectionCard
            title={t("language.title")}
            description={t("language.description")}
            action={
                <label className="flex items-center gap-3 text-sm text-light">
                    <span className="sr-only">{t("language.label")}</span>
                    <select
                        value={activeLanguage}
                        disabled={isPending}
                        onChange={(event) => {
                            void changeLanguage(event.target.value as LanguageCode);
                        }}
                        className="rounded-lg border border-light-10 bg-surface-hard px-3 py-2 text-sm text-light outline-none focus:ring-2 focus:ring-primary disabled:opacity-50"
                        aria-label={t("language.label")}
                    >
                        {SUPPORTED_LANGUAGES.map((language) => (
                            <option key={language} value={language}>
                                {LANGUAGE_LABELS[language]}
                            </option>
                        ))}
                    </select>
                </label>
            }
        />
    );
};
