import { useTranslation } from "react-i18next";

import { CategoriesManager } from "./CategoriesManager";
import { SettingsContentCard } from "./SettingsContentCard";

export const SettingsCategoriesSection = () => {
    const { t } = useTranslation();

    return (
        <SettingsContentCard
            title={t("settings.categoriesTitle")}
            description={t("settings.categoriesDescription")}
        >
            <CategoriesManager />
        </SettingsContentCard>
    );
};
