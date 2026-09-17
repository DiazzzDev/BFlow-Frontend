import { toast } from "sonner";

import { useCancelSubscription } from "./useCancelSubscription";

import { useAuthStore } from "@/auth/authStore";
import type { SubscriptionStatus, UserSubscription } from "@/auth/InternalUser";
import { formatCurrency } from "@/utils/formatters/formatCurrency";

const statusLabels: Record<SubscriptionStatus, string> = {
    PENDING_ACTIVATION: "Pendiente de activación",
    ACTIVE: "Activa",
    EXPIRED: "Vencida",
    CANCELED: "Cancelada",
    PAST_DUE: "Pago pendiente",
};

const formatSubscriptionDate = (date: string | null): string | null => {
    if (!date) {
        return null;
    }

    const parsedDate = new Date(date);

    if (Number.isNaN(parsedDate.getTime())) {
        return null;
    }

    return new Intl.DateTimeFormat("es-SV", {
        day: "numeric",
        month: "long",
        year: "numeric",
    }).format(parsedDate);
};

const isFreePlan = (subscription: UserSubscription): boolean => {
    const planCode = subscription.planCode.trim().toUpperCase();
    const planName = subscription.planName.trim().toUpperCase();

    return planCode === "FREE" || planName === "FREE";
};

export const useSettingsSubscription = () => {
    const user = useAuthStore((state) => state.user);
    const setSession = useAuthStore((state) => state.setSession);
    const { mutateAsync: cancelSubscription, isPending: isCancelling } =
        useCancelSubscription();
    const subscription = user?.subscription ?? null;
    const freePlan = subscription ? isFreePlan(subscription) : true;
    const canCancel =
        Boolean(subscription?.id) && !freePlan && subscription?.status !== "CANCELED";

    const cancel = (): void => {
        if (!user || !subscription?.id) {
            return;
        }

        const promise = cancelSubscription(subscription.id);

        toast.promise(promise, {
            loading: "Cancelando suscripción...",
            success: () => {
                setSession({
                    ...user,
                    subscription: {
                        ...subscription,
                        status: "CANCELED",
                        nextBillingAt: null,
                    },
                });

                return "Suscripción cancelada correctamente";
            },
            error: "No se pudo cancelar la suscripción",
        });
    };

    return {
        subscription,
        statusLabel: subscription?.status ? statusLabels[subscription.status] : null,
        cancellationDate: formatSubscriptionDate(subscription?.endsAt ?? null),
        renewalDate: formatSubscriptionDate(subscription?.nextBillingAt ?? null),
        billingAmount:
            subscription?.billingAmount !== null && subscription?.billingAmount !== undefined
                ? formatCurrency(subscription.billingAmount)
                : null,
        canCancel,
        isCancelling,
        cancel,
    };
};
