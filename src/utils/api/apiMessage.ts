export const getApiMessage = (response: unknown, fallback: string): string => {
    if (typeof response === "string" && response.trim()) {
        return response;
    }

    if (typeof response !== "object" || response === null) {
        return fallback;
    }

    const responseRecord = response as Record<string, unknown>;
    const {
        data,
        message: responseMessage,
        serverMessage,
    } = responseRecord;
    const dataMessage =
        typeof data === "object" && data !== null
            ? (data as Record<string, unknown>).message
            : undefined;
    const message = responseMessage ?? serverMessage ?? dataMessage;

    return typeof message === "string" && message.trim() ? message : fallback;
};

export const getApiErrorMessage = (error: unknown, fallback: string): string =>
    error instanceof Error && error.message.trim() ? error.message : fallback;
