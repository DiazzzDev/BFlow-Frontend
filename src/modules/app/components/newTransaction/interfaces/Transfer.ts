export type TransferDirection = "outgoing" | "incoming";

export interface CreateTransferData {
    fromWalletId: string;
    toWalletId: string;
    amount: number;
    description: string;
}

export interface Transfer extends CreateTransferData {
    id: string;
}
