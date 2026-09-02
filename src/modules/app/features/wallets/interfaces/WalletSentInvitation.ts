export type WalletSentInvitationStatus = "PENDING" | "ACCEPTED" | "DECLINED" | '';

export interface WalletSentInvitation {
    id: string;
    walletId: string;
    walletName: string;
    invitedEmail: string;
    invitedUserId: string | null;
    invitedUserName: string | null;
    status: WalletSentInvitationStatus;
    createdAt: string;
    expiresAt: string | null;
    respondedAt: string | null;
}
