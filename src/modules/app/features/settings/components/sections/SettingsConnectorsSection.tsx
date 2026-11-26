import { Check, Copy, Info, RefreshCw, Unplug } from "lucide-react";
import { SiClaude } from "@icons-pack/react-simple-icons";
import { useTranslation } from "react-i18next";
import { toast } from "sonner";

import { SettingsContentCard } from "./SettingsContentCard";
import { useGmailIntegration } from "../../hooks/useGmailIntegration";

import chatGptIcon from "@/assets/openai-monoblossom.svg";
import gmailLogo from "@/modules/home/features/landing/assets/integrations/gmail.svg";
import { Button } from "@/components/controls/Button";
import { getClaudeConnectorUrl, getMcpServerUrl } from "@/utils/claudeConnector";

export const SettingsConnectorsSection = () => {
    const { t } = useTranslation();
    const claudeConnectorUrl = getClaudeConnectorUrl();
    const mcpServerUrl = getMcpServerUrl();
    const { status: gmailStatus, isStatusLoading, connect, sync, disconnect } = useGmailIntegration();
    const isGmailConnected = gmailStatus?.connected === true;

    const handleGmailConnect = () => {
        const promise = connect.mutateAsync().then(({ data }) => {
            window.location.assign(data);
        });

        toast.promise(promise, {
            loading: t("settings.integrations.gmailConnecting"),
            success: t("settings.integrations.gmailRedirecting"),
            error: (error: Error) => error.message,
        });
    };

    const handleGmailSync = () => {
        const promise = sync.mutateAsync({ lookbackDays: 30, maxMessages: 50 });

        toast.promise(promise, {
            loading: t("settings.integrations.gmailSyncing"),
            success: ({ data }) => t("settings.integrations.gmailSyncSuccess", {
                count: data.queuedForProcessing,
            }),
            error: (error: Error) => error.message,
        });
    };

    const handleGmailDisconnect = () => {
        const promise = disconnect.mutateAsync();

        toast.promise(promise, {
            loading: t("settings.integrations.gmailDisconnecting"),
            success: t("settings.integrations.gmailDisconnected"),
            error: (error: Error) => error.message,
        });
    };

    const handleCopyMcpUrl = async () => {
        if (!mcpServerUrl) {
            return;
        }

        try {
            await navigator.clipboard.writeText(mcpServerUrl);
            toast.success(t("settings.integrations.mcpUrlCopied"));
        } catch {
            toast.error(t("settings.integrations.mcpUrlCopyError"));
        }
    };

    return (
        <SettingsContentCard
            title={t("settings.integrations.title")}
            description={t("settings.integrations.description")}
        >
            <div className="divide-y divide-light-10">
                <div className="flex flex-col gap-4 py-1 sm:flex-row sm:items-center sm:justify-between">
                    <div className="flex gap-3 sm:w-[70%]">
                        <span className="flex h-10 w-10 shrink-0 items-center justify-center" aria-hidden="true">
                            <SiClaude className="h-7 w-7 text-orange-500" />
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
                        <span className="flex h-10 w-10 shrink-0 items-center justify-center" aria-hidden="true">
                            <img src={chatGptIcon} alt="" className="h-7 w-7 object-contain" />
                        </span>
                        <div>
                            <h3 className="text-sm font-semibold text-light">{t("settings.integrations.chatGptTitle")}</h3>
                            <p className="mt-1 text-sm text-helper">{t("settings.integrations.chatGptDescription")}</p>
                            {mcpServerUrl ? (
                                <div className="mt-3">
                                    <p className="mb-1.5 text-xs text-helper">
                                        {t("settings.integrations.chatGptManualSetup")}
                                    </p>
                                    <div className="flex max-w-full items-center gap-2 rounded-lg border border-light-10 bg-surface-hard/40 p-1.5">
                                        <code className="min-w-0 flex-1 truncate px-1.5 text-xs text-light">
                                            {mcpServerUrl}
                                        </code>
                                        <Button
                                            type="button"
                                            variant="ghost"
                                            text={t("settings.integrations.copyMcpUrl")}
                                            icon={<Copy className="h-3.5 w-3.5" />}
                                            onClick={() => { void handleCopyMcpUrl(); }}
                                            className="shrink-0 px-2 py-1.5 text-xs"
                                        />
                                    </div>
                                </div>
                            ) : null}
                            <span className="mt-2 inline-flex items-center gap-1 rounded-lg bg-light-5 px-2 py-1 text-xs font-medium text-helper">
                                <Info className="h-3.5 w-3.5" />
                                {t("settings.integrations.chatGptRequirement")}
                            </span>
                        </div>
                    </div>
                    {mcpServerUrl ? (
                        <Button
                            type="button"
                            variant="outline"
                            text={t("settings.integrations.connectChatGpt")}
                            href="https://chatgpt.com/plugins"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="w-full sm:w-auto"
                        />
                    ) : (
                        <span className="text-sm text-helper">{t("settings.connectors.unavailable")}</span>
                    )}
                </div>

                <div className="flex flex-col gap-4 pt-5 sm:flex-row sm:items-center sm:justify-between">
                    <div className="flex gap-3 sm:w-[70%]">
                        <span className="flex h-10 w-10 shrink-0 items-center justify-center" aria-hidden="true">
                            <img src={gmailLogo} alt="" className="h-7 w-7 object-contain" />
                        </span>
                        <div>
                            <div className="flex flex-wrap items-center gap-2">
                                <h3 className="text-sm font-semibold text-light">
                                    {t("settings.integrations.gmailTitle")}
                                </h3>
                                {isGmailConnected ? (
                                    <span className="inline-flex items-center gap-1 rounded-full bg-success-10 px-2 py-0.5 text-xs font-medium text-success">
                                        <Check className="h-3.5 w-3.5" />
                                        {t("settings.integrations.gmailConnected")}
                                    </span>
                                ) : null}
                            </div>
                            <p className="mt-1 text-sm text-helper">
                                {t("settings.integrations.gmailDescription")}
                            </p>
                        </div>
                    </div>

                    {isStatusLoading ? (
                        <div className="h-9 w-32 animate-pulse rounded-lg bg-light-10" />
                    ) : isGmailConnected ? (
                        <div className="flex w-full flex-col gap-2 sm:w-auto sm:flex-row">
                            <Button
                                type="button"
                                variant="outline"
                                text={sync.isPending
                                    ? t("settings.integrations.gmailSyncing")
                                    : t("settings.integrations.gmailSync")}
                                icon={<RefreshCw className={sync.isPending ? "animate-spin" : ""} />}
                                disabled={sync.isPending || disconnect.isPending}
                                onClick={handleGmailSync}
                                className="w-full sm:w-auto"
                            />
                            <Button
                                type="button"
                                variant="outline"
                                text={t("settings.integrations.gmailDisconnect")}
                                icon={<Unplug />}
                                disabled={sync.isPending || disconnect.isPending}
                                onClick={handleGmailDisconnect}
                                className="w-full sm:w-auto"
                            />
                        </div>
                    ) : (
                        <Button
                            type="button"
                            variant="outline"
                            text={connect.isPending
                                ? t("settings.integrations.gmailConnecting")
                                : t("settings.integrations.gmailConnect")}
                            disabled={connect.isPending}
                            onClick={handleGmailConnect}
                            className="w-full sm:w-auto"
                        />
                    )}
                </div>
            </div>
        </SettingsContentCard>
    );
};
