import { useTranslation } from "react-i18next";

import { SettingsContentCard } from "./SettingsContentCard";

import { TabFilter } from "@/components/controls/TabFilter";
import { ToggleSwitch } from "@/components/controls/ToggleSwitch";
import { useChangeLanguage } from "@/modules/app/hooks/useChangeLanguage";
import { SUPPORTED_LANGUAGES, type LanguageCode } from "@/i18n/types";
import { useTheme, type ThemePreference } from "@/theme/ThemeProvider";
import { useAiReceiptConfirmationStore } from "../../aiReceiptConfirmationStore";

export const SettingsPreferencesSection = () => {
    const { t } = useTranslation();
    const { activeLanguage, changeLanguage, isPending } = useChangeLanguage();
    const { preference, setTheme } = useTheme();
    const shouldConfirmAiReceipt = useAiReceiptConfirmationStore(
        (state) => state.shouldConfirmAiReceipt,
    );
    const setShouldConfirmAiReceipt = useAiReceiptConfirmationStore(
        (state) => state.setShouldConfirmAiReceipt,
    );

    return (
        <div className="flex flex-col gap-5">
            <SettingsContentCard title={t("settings.preferences.title")}>
                <div className="divide-y divide-light-10">
                    <div className="flex flex-col gap-4 py-1 sm:flex-row sm:items-center sm:justify-between">
                        <div>
                            <h3 className="text-sm font-semibold text-light">{t("language.title")}</h3>
                            <p className="mt-1 text-sm text-helper">{t("language.description")}</p>
                        </div>
                        <TabFilter
                            options={SUPPORTED_LANGUAGES.map((language) => ({
                                value: language,
                                label: language === "es"
                                    ? t("language.spanish")
                                    : t("language.english"),
                            }))}
                            selected={activeLanguage}
                            keyFilter="settings-language"
                            layoutId="settings-language-filter"
                            onChange={(language) => {
                                if (!isPending) {
                                    void changeLanguage(language as LanguageCode);
                                }
                            }}
                        />
                    </div>

                    <div className="flex flex-col gap-4 pt-5 sm:flex-row sm:items-center sm:justify-between">
                        <div>
                            <h3 className="text-sm font-semibold text-light">{t("theme.title")}</h3>
                            <p className="mt-1 text-sm text-helper">{t("settings.preferences.themeDescription")}</p>
                        </div>
                        <select
                            aria-label={t("theme.title")}
                            value={preference}
                            onChange={(event) => setTheme(event.target.value as ThemePreference)}
                            className="h-10 min-w-35 cursor-pointer rounded-lg border border-light-10 bg-surface-hard px-3 text-sm font-medium text-light outline-none transition-colors focus:border-primary focus:ring-2 focus:ring-primary/30"
                        >
                            <option value="system">{t("theme.system")}</option>
                            <option value="light">{t("theme.light")}</option>
                            <option value="dark">{t("theme.dark")}</option>
                        </select>
                    </div>
                </div>
            </SettingsContentCard>

            <SettingsContentCard title={t("settings.preferences.aiConfirmationTitle")}>
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <p className="max-w-130 text-sm text-helper">
                        {t("settings.preferences.aiConfirmationDescription")}
                    </p>
                    <ToggleSwitch
                        checked={shouldConfirmAiReceipt}
                        onChange={setShouldConfirmAiReceipt}
                        aria-label={t("settings.preferences.aiConfirmationTitle")}
                    />
                </div>
            </SettingsContentCard>
        </div>
    );
};
