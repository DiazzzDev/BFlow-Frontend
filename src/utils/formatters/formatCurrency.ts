import { getActiveLanguage } from "@/i18n/i18n";

export const formatCurrency = (
    amount: number,
    currency: string | null = "USD",
    language = getActiveLanguage(),
): string => {
    const normalizedCurrency = currency ?? "USD";

    return new Intl.NumberFormat(language === "es" ? "es-SV" : "en-US", {
        style: "currency",
        currency: normalizedCurrency,
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
    }).format(amount);
};
