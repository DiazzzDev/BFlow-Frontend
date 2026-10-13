import { toast } from "sonner";
import { useTranslation } from "react-i18next";

import { useAuthStore } from "@/auth/authStore";
import { usePatchProfileData } from "@/modules/app/features/settings/hooks/useMutateProfile";
import { getActiveLanguage, setActiveLanguage } from "@/i18n/i18n";
import type { LanguageCode } from "@/i18n/types";
import { getApiErrorMessage, getApiMessage } from "@/utils/api/apiMessage";

export const useChangeLanguage = () => {
    const { t } = useTranslation();
    const user = useAuthStore((state) => state.user);
    const setSession = useAuthStore((state) => state.setSession);
    const { mutateAsync: saveProfile, isPending } = usePatchProfileData();
    const activeLanguage = getActiveLanguage();

    const changeLanguage = async (language: LanguageCode) => {
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

    return { activeLanguage, changeLanguage, isPending };
};
