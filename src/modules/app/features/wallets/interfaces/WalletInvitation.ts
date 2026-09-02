export type WalletInvitationStatus = "PENDING" | "ACCEPTED" | "DECLINED";

export interface WalletInvitation {
    id: string;
    walletId: string;
    walletName: string;
    invitedEmail: string;
    invitedByName: string;
    invitedByEmail: string;
    invitedByPictureUrl: string | null;
    status: WalletInvitationStatus;
    expiresAt: string | null;
}

export interface CreateWalletInvitationData {
    invitedEmail: string;
}
