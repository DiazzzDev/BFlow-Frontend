import { BookOpen } from "lucide-react";
import { useTranslation } from "react-i18next";

import { SettingsContentCard } from "./SettingsContentCard";

import { Button } from "@/components/controls/Button";

export const SettingsDocumentationSection = () => {
    const { t } = useTranslation();

    return (
        <SettingsContentCard
            title={t("settings.documentation.title")}
            description={t("settings.documentation.description")}
        >
            <div className="flex flex-col gap-4 rounded-xl border border-light-10 bg-surface-hard/40 p-4 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex items-start gap-3">
                    <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary-10 text-primary">
                        <BookOpen className="h-5 w-5" />
                    </span>
                    <div>
                        <h3 className="text-sm font-semibold text-light">
                            {t("settings.documentation.manualTitle")}
                        </h3>
                        <p className="mt-1 text-sm text-helper">
                            {t("settings.documentation.manualDescription")}
                        </p>
                    </div>
                </div>
                <Button
                    type="button"
                    variant="outline"
                    text={t("settings.documentation.openManual")}
                    to="/docs"
                    className="w-full sm:w-auto"
                />
            </div>
        </SettingsContentCard>
    );
};
