export type WalletInvitationStatus = "PENDING" | "ACCEPTED" | "DECLINED";

export interface WalletInvitation {
    id: string;
    walletId: string;
    invitedEmail: string;
    status: WalletInvitationStatus;
    expiresAt: string | null;
    walletName?: string | null;
    walletCurrency?: string | null;
    invitedByName?: string | null;
    invitedByEmail?: string | null;
    role?: string | null;
    createdAt?: string | null;
}

export interface CreateWalletInvitationData {
    invitedEmail: string;
}
