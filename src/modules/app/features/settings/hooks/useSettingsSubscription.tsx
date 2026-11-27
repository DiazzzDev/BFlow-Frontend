import { useTranslation } from "react-i18next";
import { useQuery } from "@tanstack/react-query";

import { getMySubscriptions } from "../settings.service";

import { useAuthStore } from "@/auth/authStore";
import type { SubscriptionStatus, UserSubscription } from "@/auth/InternalUser";
import { getActiveLanguage } from "@/i18n/i18n";
import { formatCurrency } from "@/utils/formatters/formatCurrency";

const formatSubscriptionDate = (date: string | null | undefined, language: string): string | null => {
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

const getDaysRemaining = (date: string | null | undefined): number | null => {
    if (!date) {
        return null;
    }

    const targetDate = new Date(date);

    if (Number.isNaN(targetDate.getTime())) {
        return null;
    }

    return Math.max(0, Math.ceil((targetDate.getTime() - Date.now()) / 86_400_000));
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
    const userSubscription = user?.subscription ?? null;
    const subscriptionsQuery = useQuery({
        queryKey: ["my-subscriptions"],
        queryFn: getMySubscriptions,
        enabled: Boolean(user),
        staleTime: 60_000,
    });
    const subscriptions = (subscriptionsQuery.data?.data ?? []).map((item) => ({
        ...item,
        // /subscriptions returns billing history and does not include planCode;
        // reuse the synchronized current-plan code when the records match.
        planCode: item.planCode ?? (item.id === userSubscription?.id
            ? userSubscription.planCode
            : item.planName),
    }));
    const subscription = subscriptions.find((item) => item.id === userSubscription?.id)
        ?? subscriptions.find((item) => item.status === "ACTIVE" || item.status === "PENDING_ACTIVATION")
        ?? userSubscription
        ?? null;
    const freePlan = subscription ? isFreePlan(subscription) : true;
    const canCancel =
        Boolean(subscription?.id) && !freePlan && subscription?.status !== "CANCELED";
    const history = subscriptions.map((item) => ({
        id: item.id,
        planCode: item.planCode,
        planName: item.planName,
        status: item.status,
        billingAmount: item.billingAmount === null
            ? null
            : formatCurrency(item.billingAmount, "USD", activeLanguage),
        startsAt: formatSubscriptionDate(item.startsAt, activeLanguage),
        endsAt: formatSubscriptionDate(item.endsAt, activeLanguage),
    }));

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
        endDate: formatSubscriptionDate(
            subscription?.endsAt ?? subscription?.nextBillingAt,
            activeLanguage,
        ),
        daysRemaining: getDaysRemaining(
            subscription?.endsAt ?? subscription?.nextBillingAt,
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
        history,
        isLoading: subscriptionsQuery.isLoading,
        isError: subscriptionsQuery.isError,
        refetch: subscriptionsQuery.refetch,
    };
};
