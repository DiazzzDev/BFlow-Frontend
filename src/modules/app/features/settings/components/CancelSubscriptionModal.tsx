import { AlertTriangle } from "lucide-react";
import { toast } from "sonner";
import { useTranslation } from "react-i18next";

import { useCancelSubscription } from "../hooks/useCancelSubscription";

import { useAuthStore } from "@/auth/authStore";
import { Button } from "@/components/controls/Button";
import { CustomModal } from "@/components/custom/CustomModal";
import { ModalActionFooter } from "@/components/custom/ModalActionFooter";
import { getApiErrorMessage, getApiMessage } from "@/utils/api/apiMessage";

interface CancelSubscriptionModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export const CancelSubscriptionModal = ({
    isOpen,
    onClose,
}: CancelSubscriptionModalProps) => {
    const { t } = useTranslation();
    const user = useAuthStore((state) => state.user);
    const setSession = useAuthStore((state) => state.setSession);
    const subscription = user?.subscription ?? null;
    const { mutateAsync: cancelSubscription, isPending } = useCancelSubscription();

    const handleClose = () => {
        if (!isPending) {
            onClose();
        }
    };

    const handleConfirm = async () => {
        if (!user || !subscription?.id) {
            return;
        }

        const promise = cancelSubscription(subscription.id);

        toast.promise(promise, {
            loading: t("subscription.cancelLoading"),
            success: (response) => getApiMessage(response, t("subscription.cancelSuccess")),
            error: (error) => getApiErrorMessage(error, t("subscription.cancelError")),
        });

        try {
            await promise;
        } catch {
            return;
        }

        setSession({
            ...user,
            subscription: {
                ...subscription,
                status: "CANCELED",
                nextBillingAt: null,
            },
        });
        onClose();
    };

    return (
        <CustomModal
            isModalOpen={isOpen}
            setIsModalOpen={(open) => {
                if (!open) {
                    handleClose();
                }
            }}
            title={t("subscription.cancelModalTitle")}
            maxWidth="max-w-md"
        >
            <div className="flex flex-col gap-5">
                <div className="flex items-start gap-3 rounded-lg border border-warning/30 bg-warning/10 p-3.5 text-sm text-light">
                    <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-warning" aria-hidden="true" />
                    <p>{t("subscription.cancelModalDescription", { planName: subscription?.planName ?? "" })}</p>
                </div>
                <p className="text-sm text-helper">
                    {t("subscription.cancelModalHint")}
                </p>
                <ModalActionFooter>
                    <div className="flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
                        <Button
                            type="button"
                            variant="outline"
                            text={t("common.cancel")}
                            disabled={isPending}
                            onClick={handleClose}
                        />
                        <Button
                            type="button"
                            variant="danger"
                            text={isPending ? t("subscription.cancelling") : t("subscription.cancel")}
                            disabled={isPending || !subscription?.id}
                            onClick={() => {
                                void handleConfirm();
                            }}
                        />
                    </div>
                </ModalActionFooter>
            </div>
        </CustomModal>
    );
};
