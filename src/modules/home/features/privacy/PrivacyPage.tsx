import { LegalPage } from "../legal/LegalPage";
import { useTranslation } from "react-i18next";

export const PrivacyPage = () => {
    const { t } = useTranslation();
    return <LegalPage documentType="privacy" title={t("home.privacyTitle")} description={t("home.privacyDescription")} />;
};
