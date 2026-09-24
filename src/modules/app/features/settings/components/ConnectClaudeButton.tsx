import { SiClaude } from "@icons-pack/react-simple-icons";
import { useTranslation } from "react-i18next";

import { config } from "@/config/config";

export const ConnectClaudeButton = () => {
    const { t } = useTranslation();
    const mcpServerUrl = config.MCP_SERVER_URL;

    if (!mcpServerUrl) {
        return null;
    }

    const claudeConnectorUrl =
        "https://claude.ai/customize/connectors" +
        `?modal=${encodeURIComponent("add-custom-connector")}` +
        `&connectorName=${encodeURIComponent("BFlow")}` +
        `&connectorUrl=${encodeURIComponent(mcpServerUrl)}`;

    return (
        <a
            href={claudeConnectorUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex w-fit items-center justify-center gap-2 rounded-xl border border-light-25 bg-transparent px-5 py-2.5 font-sans text-sm font-semibold text-light transition-all hover:border-[#d97757] active:scale-95"
        >
            <SiClaude className="h-5 w-5 shrink-0 text-orange-600" aria-hidden="true" />
            {t("settings.connectClaude")}
        </a>
    );
};
