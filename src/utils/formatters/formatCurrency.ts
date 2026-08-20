export const formatCurrency = (amount: number, currency = "USD"): string => {
    console.log(currency)
    return new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: currency,
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
    }).format(amount);
};