import { useMemo, useState } from "react";
import { Users, Wallet } from "lucide-react";

import { WalletItem } from "./components/WalletItem";
import { WalletItemSkeleton } from "./components/WalletItemSkeleton";
import { WalletForm } from "./components/WalletForm";
import { useGetWallets } from "./hooks/useGetWallets";

import { useAuthStore } from "@/auth/authStore";
import { CustomModal } from "@/components/custom/CustomModal";
import { CustomEmptyState } from "@/components/custom/CustomEmptyState";
import { SearchInput } from "@/components/controls/SearchInput";
import { Button } from "@/components/controls/Button";
import { formatMonthYear } from "@/utils/formatters/formatMonthYear";

const getEmptyTitle = (search: string, activeTab: "wallets" | "sharedWallets") => {
    if (search.trim()) {
        return "Sin resultados";
    }
    if (activeTab === "wallets") {
        return "No tienes billeteras aún";
    }
    return "No tienes billeteras compartidas";
};

const getEmptyDescription = (
    search: string,
    activeTab: "wallets" | "sharedWallets",
) => {
    if (search.trim()) {
        return "Prueba con otro término de búsqueda";
    }
    if (activeTab === "wallets") {
        return "Crea tu primera billetera para empezar a gestionar tus finanzas";
    }
    return "Cuando alguien te invite a una billetera, aparecerá aquí";
};

export const WalletsPage = () => {
    const { isLoading, data } = useGetWallets();
    const user = useAuthStore((state) => state.user);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [activeTab, setActiveTab] = useState<"wallets" | "sharedWallets">("wallets");
    const [search, setSearch] = useState("");

    const walletsToShow = activeTab === "wallets" ? data?.myWallets : data?.sharedWallets;
    const ownerLabel = user?.email || "—";

    const filteredWallets = useMemo(() => {
        const query = search.trim().toLowerCase();
        if (!query) {
            return walletsToShow || [];
        }

        return (walletsToShow || []).filter((wallet) => {
            const name = wallet.name.toLowerCase();
            const description = (wallet.description || "").toLowerCase();
            const currency = wallet.currency.toLowerCase();
            return (
                name.includes(query)
                || description.includes(query)
                || currency.includes(query)
            );
        });
    }, [walletsToShow, search]);

    const showCreateButton = activeTab === "wallets" && !search.trim();

    return (
        <div className="flex gap-6 h-full min-h-0">
            <section className="flex-1 min-w-0 flex flex-col px-6 py-5">
                <div className="flex flex-col gap-4 mb-6">
                    <div className="flex items-center justify-end">
                        <div className="flex items-center gap-1 text-sm">
                            <button
                                type="button"
                                onClick={() => setActiveTab("wallets")}
                                className={`cursor-pointer transition-colors ${
                                    activeTab === "wallets"
                                        ? "text-light font-medium"
                                        : "text-helper hover:text-light"
                                }`}
                            >
                                Mis wallets
                            </button>
                            <span className="text-helper">/</span>
                            <button
                                type="button"
                                onClick={() => setActiveTab("sharedWallets")}
                                className={`cursor-pointer transition-colors ${
                                    activeTab === "sharedWallets"
                                        ? "text-light font-medium"
                                        : "text-helper hover:text-light"
                                }`}
                            >
                                Compartidas
                            </button>
                        </div>
                    </div>

                    <div className="flex items-center gap-3 flex-wrap">
                        <SearchInput
                            id="txtSearch"
                            placeholder="Buscar billetera..."
                            className="max-w-xl"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                        />

                        {activeTab === "wallets" && (
                            <Button
                                type="button"
                                onClick={() => setIsModalOpen(true)}
                                text="Crear billetera"
                            />
                        )}
                    </div>
                </div>

                <div className="flex-1 flex flex-col">{renderWalletList()}</div>
            </section>

            <aside className="w-full lg:w-80 xl:w-96 shrink-0 border-t lg:border-t-0 lg:border-l border-light-10 flex flex-col px-6 py-5">
                <div className="flex items-center justify-between mb-6">
                    <h2 className="text-2xl font-semibold text-light tracking-tight">
                        History
                    </h2>
                    <button
                        type="button"
                        className="text-sm text-primary hover:text-primary-dark transition-colors cursor-pointer"
                    >
                        View all
                    </button>
                </div>

                <ul className="flex flex-col flex-1">
                    {Array.from({ length: 6 }).map((_, i) => (
                        <li
                            key={i}
                            className="min-h-16 border-b border-light-10 last:border-b-0"
                        />
                    ))}
                </ul>
            </aside>

            <CustomModal
                isModalOpen={isModalOpen}
                setIsModalOpen={setIsModalOpen}
                title="Nueva billetera"
                maxWidth="max-w-md"
                variant="center"
            >
                <WalletForm
                    key={isModalOpen ? "open" : "closed"}
                    onSuccess={() => setIsModalOpen(false)}
                />
            </CustomModal>
        </div>
    );

    function renderWalletList() {
        if (isLoading) {
            return (
                <section className="flex flex-col gap-3">
                    {Array.from({ length: 6 }).map((_, index) => (
                        <WalletItemSkeleton key={index} />
                    ))}
                </section>
            );
        }

        if (filteredWallets.length > 0) {
            return (
                <section className="flex flex-col gap-3">
                    {filteredWallets.map((wallet) => (
                        <WalletItem
                            key={wallet.id}
                            title={wallet.name}
                            subtitle={wallet.description || ownerLabel}
                            meta={wallet.currency}
                            dateLabel={formatMonthYear(wallet.createdAt)}
                            amount={wallet.balance}
                            currency={wallet.currency}
                            to={`/app/wallets/${wallet.id}`}
                            showChevron
                            positiveAmountClassName="text-info"
                        />
                    ))}
                </section>
            );
        }

        return (
            <CustomEmptyState
                title={getEmptyTitle(search, activeTab)}
                description={getEmptyDescription(search, activeTab)}
                Icon={activeTab === "wallets" ? Wallet : Users}
                buttonText={showCreateButton ? "Crear billetera" : undefined}
                onButtonClick={showCreateButton ? () => setIsModalOpen(true) : undefined}
            />
        );
    }
};
