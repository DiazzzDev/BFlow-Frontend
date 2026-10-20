/** Tailwind text class for signed transaction amounts (income / expense / transfer). */
export const getTransactionAmountClassName = (
    type: string,
    amount: number,
) => {
    const normalized = type.trim().toUpperCase();

    if (normalized === "EXPENSE" || amount < 0) {
        return "text-danger";
    }
    if (normalized === "INCOME" || amount > 0) {
        return "text-info";
    }

    return "text-light";
};
