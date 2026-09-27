import { toast } from "sonner";
import { useTranslation } from "react-i18next";

import { useAuthStore } from "@/auth/authStore";
import { SettingsSectionCard } from "@/modules/app/features/settings/components/SettingsSectionCard";
import { usePatchProfileData } from "@/modules/app/features/settings/hooks/useMutateProfile";
import { getActiveLanguage, setActiveLanguage } from "@/i18n/i18n";
import { LANGUAGE_LABELS, SUPPORTED_LANGUAGES, type LanguageCode } from "@/i18n/types";
import { getApiErrorMessage, getApiMessage } from "@/utils/api/apiMessage";

export const LanguageSettingsSection = () => {
    const { t } = useTranslation();
    const user = useAuthStore((state) => state.user);
    const setSession = useAuthStore((state) => state.setSession);
    const { mutateAsync: saveProfile, isPending } = usePatchProfileData();
    const activeLanguage = getActiveLanguage();

    const handleLanguageChange = async (language: LanguageCode) => {
        if (language === activeLanguage) {
            return;
        }

        const previousLanguage = activeLanguage;
        setActiveLanguage(language);

        if (!user) {
            return;
        }

        try {
            const response = await saveProfile({
                email: user.email,
                name: user.name ?? "",
                language: language.toUpperCase(),
            });
            setSession({
                ...user,
                language,
                name: response.data.name,
                pictureUrl: response.data.pictureUrl,
            });
            toast.success(getApiMessage(response, t("language.saved")));
        } catch (error) {
            setActiveLanguage(previousLanguage);
            toast.error(getApiErrorMessage(error, t("language.error")));
        }
    };

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
                            void handleLanguageChange(event.target.value as LanguageCode);
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
