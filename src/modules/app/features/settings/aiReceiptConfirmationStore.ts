import { create } from "zustand";
import { persist } from "zustand/middleware";

interface AiReceiptConfirmationState {
    shouldConfirmAiReceipt: boolean;
    setShouldConfirmAiReceipt: (shouldConfirm: boolean) => void;
}

export const useAiReceiptConfirmationStore = create<AiReceiptConfirmationState>()(
    persist(
        (set) => ({
            shouldConfirmAiReceipt: true,
            setShouldConfirmAiReceipt: (shouldConfirmAiReceipt) => {
                set({ shouldConfirmAiReceipt });
            },
        }),
        { name: "bflow-ai-receipt-confirmation" },
    ),
);
