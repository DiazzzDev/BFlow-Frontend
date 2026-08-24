export interface CreateWalletData {
    name: string;
    description?: string;
    initialValue: number;
    currency: string;
}

export interface UpdateWalletData {
    name: string;
    description: string;
}

export interface Wallet extends CreateWalletData {
    id: string;
    balance: number;
    createdAt: string;
    updatedAt: string;
    role: string;
    memberCount?: number;
}
