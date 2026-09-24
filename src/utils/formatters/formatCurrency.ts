import { getActiveLanguage } from "@/i18n/i18n";

export const formatCurrency = (
    amount: number,
    currency = "USD",
    language = getActiveLanguage(),
): string => {
    if(currency === null){ currency = 'USD'}
    return new Intl.NumberFormat(language === "es" ? "es-SV" : "en-US", {
        style: "currency",
        currency: currency,
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
    }).format(amount);
};
