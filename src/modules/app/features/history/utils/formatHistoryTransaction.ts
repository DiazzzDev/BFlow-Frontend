export const formatTransactionSource = (source?: string | null) => {
    const normalized = source?.trim().toLowerCase() ?? "";

    if (!normalized || normalized === "manual") {
        return "Manual";
    }

    if (normalized === "recurring") {
        return "Recurrente";
    }

    return source?.trim() || null;
};
