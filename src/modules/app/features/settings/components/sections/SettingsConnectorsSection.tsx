import { Info, Link2 } from "lucide-react";
import { SiClaude } from "@icons-pack/react-simple-icons";
import { useTranslation } from "react-i18next";

import { SettingsContentCard } from "./SettingsContentCard";

import { Button } from "@/components/controls/Button";
import { getClaudeConnectorUrl } from "@/utils/claudeConnector";

export const SettingsConnectorsSection = () => {
    const { t } = useTranslation();
    const claudeConnectorUrl = getClaudeConnectorUrl();

    return (
        <SettingsContentCard
            title={t("settings.integrations.title")}
            description={t("settings.integrations.description")}
        >
            <div className="divide-y divide-light-10">
                <div className="flex flex-col gap-4 py-1 sm:flex-row sm:items-center sm:justify-between">
                    <div className="flex gap-3">
                        <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary-10 text-primary">
                            <SiClaude className="h-5 w-5 text-orange-500" />
                        </span>
                        <div>
                            <h3 className="text-sm font-semibold text-light">{t("settings.integrations.claudeTitle")}</h3>
                            <p className="mt-1 text-sm text-helper">{t("settings.integrations.claudeDescription")}</p>
                        </div>
                    </div>
                    {claudeConnectorUrl ? (
                        <Button
                            type="button"
                            variant="outline"
                            text={t("settings.connectClaude")}
                            href={claudeConnectorUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="w-full sm:w-auto"
                        />
                    ) : (
                        <span className="text-sm text-helper">{t("settings.connectors.unavailable")}</span>
                    )}
                </div>

                <div className="flex flex-col gap-4 pt-5 sm:flex-row sm:items-center sm:justify-between">
                    <div className="flex gap-3">
                        <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-secondary text-helper">
                            <Link2 className="h-5 w-5" />
                        </span>
                        <div>
                            <h3 className="text-sm font-semibold text-light">{t("settings.integrations.chatGptTitle")}</h3>
                            <p className="mt-1 text-sm text-helper">{t("settings.integrations.chatGptDescription")}</p>
                            <span className="mt-2 inline-flex items-center gap-1 rounded-lg bg-light-5 px-2 py-1 text-xs font-medium text-helper">
                                <Info className="h-3.5 w-3.5" />
                                {t("settings.integrations.chatGptRequirement")}
                            </span>
                        </div>
                    </div>
                    <Button
                        type="button"
                        variant="outline"
                        text={t("settings.integrations.connectChatGpt")}
                        className="w-full sm:w-auto"
                    />
                </div>
            </div>
        </SettingsContentCard>
    );
};
