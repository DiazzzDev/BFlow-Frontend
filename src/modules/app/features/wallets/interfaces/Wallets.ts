export interface Wallet {
    id: string,
    name: string,
    description: string,
    currency: string,
    balance: number,
    initialValue: number,
    createdAt: string,
    updatedAt: string,
    role: string
}