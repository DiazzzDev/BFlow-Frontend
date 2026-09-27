import { toast } from "sonner";
import { useTranslation } from "react-i18next";

import { useCancelSubscription } from "./useCancelSubscription";

import { useAuthStore } from "@/auth/authStore";
import type { SubscriptionStatus, UserSubscription } from "@/auth/InternalUser";
import { getActiveLanguage } from "@/i18n/i18n";
import { formatCurrency } from "@/utils/formatters/formatCurrency";
import { getApiErrorMessage, getApiMessage } from "@/utils/api/apiMessage";

const formatSubscriptionDate = (date: string | null, language: string): string | null => {
    if (!date) {
        return null;
    }

    const parsedDate = new Date(date);

    if (Number.isNaN(parsedDate.getTime())) {
        return null;
    }

    return new Intl.DateTimeFormat(language === "es" ? "es-SV" : "en-US", {
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

const statusTranslationKeys = {
    PENDING_ACTIVATION: "subscription.status.PENDING_ACTIVATION",
    ACTIVE: "subscription.status.ACTIVE",
    EXPIRED: "subscription.status.EXPIRED",
    CANCELED: "subscription.status.CANCELED",
    PAST_DUE: "subscription.status.PAST_DUE",
} as const satisfies Record<SubscriptionStatus, string>;

export const useSettingsSubscription = () => {
    const { t } = useTranslation();
    const activeLanguage = getActiveLanguage();
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
            loading: t("subscription.cancelLoading"),
            success: (response) => {
                setSession({
                    ...user,
                    subscription: {
                        ...subscription,
                        status: "CANCELED",
                        nextBillingAt: null,
                    },
                });

                return getApiMessage(response, t("subscription.cancelSuccess"));
            },
            error: (error) => getApiErrorMessage(error, t("subscription.cancelError")),
        });
    };

    return {
        subscription,
        statusLabel: subscription?.status
            ? t(statusTranslationKeys[subscription.status])
            : null,
        cancellationDate: formatSubscriptionDate(
            subscription?.endsAt ?? null,
            activeLanguage,
        ),
        renewalDate: formatSubscriptionDate(
            subscription?.nextBillingAt ?? null,
            activeLanguage,
        ),
        billingAmount:
            subscription?.billingAmount !== null &&
            subscription?.billingAmount !== undefined &&
            subscription.billingAmount > 0
                ? formatCurrency(
                      subscription.billingAmount,
                      "USD",
                      activeLanguage,
                  )
                : null,
        canCancel,
        isCancelling,
        cancel,
    };
};
