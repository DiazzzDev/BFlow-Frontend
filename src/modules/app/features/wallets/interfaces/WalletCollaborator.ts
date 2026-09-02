export type WalletCollaboratorStatus = string;

export interface WalletCollaborator {
    id: string;
    name: string;
    email: string;
    pictureUrl: string | null;
    status: WalletCollaboratorStatus;
}
