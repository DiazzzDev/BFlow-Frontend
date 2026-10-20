import type { LanguageCode } from "@/i18n/types";
import type { Wallet } from "@/modules/app/interfaces/Wallet";

export type SubscriptionStatus =
    | "PENDING_ACTIVATION"
    | "ACTIVE"
    | "EXPIRED"
    | "CANCELED"
    | "PAST_DUE";

export type AccountStatus = "ACTIVE" | "PENDING_DELETION" | "DELETED";

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

export interface UserPlanFeatures {
    WALLETS: boolean;
    SHARED_WALLETS: boolean;
    WALLET_MEMBERS: boolean;
    BUDGETS: boolean;
    EXPORT: boolean;
    RECURRING_TRANSACTIONS: boolean;
    DASHBOARD_CUSTOMIZATION: boolean;
    CAN_CREATE_SHARED_WALLETS: boolean;
}

export interface UserPlanLimits {
    WALLETS: number;
    SHARED_WALLETS: number;
    WALLET_MEMBERS: number;
    BUDGETS: number;
    RECURRING_TRANSACTIONS: number;
}

export interface UserPlan {
    planCode: string;
    planName: string;
    status: SubscriptionStatus;
    features: UserPlanFeatures;
    limits: UserPlanLimits;
}

export interface UserProfile {
    id: string;
    email: string;
    name: string;
    pictureUrl: string | null;
    roles: string[];
    status: AccountStatus;
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
    plan: UserPlan | null;
    wallets: Wallet[];
    profile: UserProfile | null;
    accountPendingDeletion: boolean;
    deletionDaysRemaining: number | null;
    status: AccountStatus;
    deletionScheduledAt: string | null;
}
