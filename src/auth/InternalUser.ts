import type { LanguageCode } from "@/i18n/types";

export type SubscriptionStatus =
    | "PENDING_ACTIVATION"
    | "ACTIVE"
    | "EXPIRED"
    | "CANCELED"
    | "PAST_DUE";

export interface UserSubscription {
    id: string | null;
    planCode: string;
    planName: string;
    status: SubscriptionStatus | null;
    billingAmount: number | null;
    startsAt: string | null;
    endsAt: string | null;
    nextBillingAt: string | null;
}

export interface UserProfile {
    id: string;
    email: string;
    name: string;
    pictureUrl: string | null;
    roles: string[];
    status: string;
    language?: string | null;
    preferredLanguage?: string | null;
}

export interface InternalUser {
    id: string;
    email: string;
    roles: string[];
    isNewUser: boolean;
    name: string | null;
    pictureUrl: string | null;
    language: LanguageCode;
    serverMessage?: string;
    subscription: UserSubscription;
}
