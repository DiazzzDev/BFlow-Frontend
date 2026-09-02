export type WalletMemberRole = string;

export interface WalletMember {
    id: string;
    email: string;
    role: WalletMemberRole;
    name: string;
    pictureUrl: string | null;
    joinedAt: string;
}
