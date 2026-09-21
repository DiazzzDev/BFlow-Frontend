import { useTranslation } from "react-i18next";

interface SubscriptionCancelButtonProps {
    isCancelling: boolean;
    onCancel: () => void;
}

export const SubscriptionCancelButton = ({
    isCancelling,
    onCancel,
}: SubscriptionCancelButtonProps) => {
    const { t } = useTranslation();

    return (
        <button
            type="button"
            disabled={isCancelling}
            onClick={onCancel}
            className="cursor-pointer rounded-lg border border-danger/40 px-5 py-2 text-sm font-medium text-danger transition-colors hover:bg-danger-sweet disabled:cursor-not-allowed disabled:opacity-50"
        >
            {isCancelling
                ? t("subscription.cancelling")
                : t("subscription.cancel")}
        </button>
    );
};
