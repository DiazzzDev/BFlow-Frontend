export const formatAxisMoney = (value: number, currency = "USD") =>
    new Intl.NumberFormat("en-US", {
        style: "currency",
        currency,
        notation: "compact",
        maximumFractionDigits: 1,
    }).format(value);
