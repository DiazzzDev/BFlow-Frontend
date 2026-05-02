import { create } from "zustand";
import { toast } from "react-toastify";

import { Wallet } from "./interfaces/Wallets.ts";
import { getWallets, postWallet } from "./wallet.services.ts";

import { APIError } from "@/utils/api.ts";

export type WalletCreationPayload = Omit<Wallet, 'id' | 'createdAt' | 'updatedAt' | 'role' | 'balance'>;

export interface WalletStoreState {
    wallets: Wallet[];
    sharedWallets: Wallet[];
    selectedWallet: Wallet | null;
    isLoading: boolean;
    isCreating: boolean;
    isOpenModal: boolean;
    error: string | null;
}

export interface WalletStoreActions {
    fetchWallets: () => Promise<void>;
    createWallet: (walletData: WalletCreationPayload) => Promise<Wallet | undefined>;
    selectWallet: (walletId: string) => void;
    resetError: () => void;
    openModal: () => void;
    closeModal: () => void;
}

export type WalletStore = WalletStoreState & WalletStoreActions;

export const useWalletStore = create<WalletStore>((set, get) => ({
    wallets: [],
    sharedWallets: [],
    selectedWallet: null,
    isLoading: false,
    isCreating: false,
    isOpenModal: false,
    error: null,
    fetchWallets: async () => {
        set({ error: null, isLoading: true });
        try {
            const response = await toast.promise(
                getWallets(),
                {
                    pending: 'Cargando billeteras...',
                    success: 'Billeteras cargadas',
                    error: {
                        render({ data }: { data: APIError }) {
                            return data?.message || 'No se pudieron obtener las billeteras';
                        }
                    }
                }
            );
            const myWallets: Wallet[] = [];
            const shared: Wallet[] = [];
            response.data.content.forEach(wallet => {
                if (wallet.role === "OWNER") {
                    myWallets.push(wallet);
                } else {
                    shared.push(wallet);
                }
            });
            set({ wallets: myWallets, sharedWallets: shared });
        } catch (err: unknown) {
            if (err instanceof APIError) {
                set({ error: err.message });
            } else {
                set({ error: 'Error al obtener las billeteras' });
            }
        } finally {
            set({ isLoading: false });
        }
    },
    createWallet: async (walletData: WalletCreationPayload) => {
        set({ error: null, isCreating: true });

        try {
            const response = await toast.promise(
                postWallet(walletData),
                {
                    pending: 'Creando billetera...',
                    success: 'Billetera creada',
                    error: {
                        render({ data }: { data: APIError }) {
                            return data?.message || 'Error al crear la billetera';
                        }
                    }
                }
            );

            set(state => ({
                wallets: response.role === "OWNER" ? [...state.wallets, response] : state.wallets,
                sharedWallets: response.role === "OWNER" ? state.sharedWallets : [...state.sharedWallets, response],
            }));
            set({ isOpenModal: false });
            return response;
        } catch (err: unknown) {
            if (err instanceof APIError) {
                set({ error: err.message });
            } else {
                set({ error: 'Error al crear la billetera' });
            }
        } finally {
            set({ isCreating: false });
        }
    },
    selectWallet: (walletId: string) => {
        const { wallets } = get();
        set({ selectedWallet: wallets.find(wallet => wallet.id === walletId) ?? null });
    },
    resetError: () => set({ error: null }),
    openModal: () => set({ isOpenModal: true }),
    closeModal: () => set({ isOpenModal: false }),
}));
