import { config } from "@/config/config";

export const getClaudeConnectorUrl = () => {
    const mcpServerUrl = config.MCP_SERVER_URL;

    if (!mcpServerUrl) {
        return null;
    }

    return (
        "https://claude.ai/customize/connectors" +
        `?modal=${encodeURIComponent("add-custom-connector")}` +
        `&connectorName=${encodeURIComponent("BFlow")}` +
        `&connectorUrl=${encodeURIComponent(mcpServerUrl)}`
    );
};
