import { Cookie, FileText, ShieldCheck } from "lucide-react";
import { useTranslation } from "react-i18next";

import { SettingsContentCard } from "./SettingsContentCard";

import { Button } from "@/components/controls/Button";

const legalDocuments = [
    { id: "terms", icon: FileText, route: "/terms" },
    { id: "privacy", icon: ShieldCheck, route: "/privacy" },
    { id: "cookies", icon: Cookie, route: "/cookies" },
] as const;

export const SettingsLegalSection = () => {
    const { t } = useTranslation();

    return (
        <SettingsContentCard
            title={t("settings.legal.title")}
            description={t("settings.legal.description")}
        >
            <div className="divide-y divide-light-10">
                {legalDocuments.map(({ id, icon: Icon, route }) => (
                    <div
                        key={id}
                        className="flex flex-col gap-4 py-4 first:pt-1 last:pb-1 sm:flex-row sm:items-center sm:justify-between"
                    >
                        <div className="flex items-start gap-3">
                            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary-10 text-primary">
                                <Icon className="h-5 w-5" />
                            </span>
                            <div>
                                <h3 className="text-sm font-semibold text-light">
                                    {t(`settings.legal.${id}.title`)}
                                </h3>
                                <p className="mt-1 text-sm text-helper">
                                    {t(`settings.legal.${id}.description`)}
                                </p>
                            </div>
                        </div>
                        <Button
                            type="button"
                            variant="outline"
                            text={t("settings.legal.viewDocument")}
                            to={route}
                            className="w-full sm:w-auto"
                        />
                    </div>
                ))}
            </div>
        </SettingsContentCard>
    );
};
