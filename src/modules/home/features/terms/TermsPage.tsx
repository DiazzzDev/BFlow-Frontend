import { LegalPage } from "../legal/LegalPage";
import { useTranslation } from "react-i18next";

export const TermsPage = () => {
    const { t } = useTranslation();
    return <LegalPage documentType="terms" title={t("home.termsTitle")} description={t("home.termsDescription")} />;
};
