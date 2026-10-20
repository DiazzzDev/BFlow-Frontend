import { LegalPage } from "../legal/LegalPage";
import { useTranslation } from "react-i18next";

export const CookiesPage = () => {
    const { t } = useTranslation();
    return <LegalPage documentType="cookies" title={t("home.cookiesTitle")} description={t("home.cookiesDescription")} />;
};
