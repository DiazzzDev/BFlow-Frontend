import type { ConfirmReceiptPayload, Receipt } from "../dashboard.service";

export const getReceiptConfirmationPayload = (
    receipt: Receipt,
    fallbackTitle: string,
): ConfirmReceiptPayload => ({
    type: receipt.suggestedType === "INCOME" ? "INCOME" : "EXPENSE",
    title: receipt.suggestedTitle?.trim() || fallbackTitle,
    description: "",
    amount: receipt.suggestedAmount ?? 0,
    categoryId: receipt.suggestedCategoryId ?? "",
    date: receipt.suggestedDate ?? new Date().toISOString().slice(0, 10),
});
