import { useSearchParams } from "react-router";
import { useState } from "react";
import { Receipt, Users, Wallet } from "lucide-react";

import { WalletItem } from "./components/WalletItem";
import { WalletItemSkeleton } from "./components/WalletItemSkeleton";
import { HistoryItem } from "./components/HistoryItem";
import { HistoryItemSkeleton } from "./components/HistoryItemSkeleton";
import { WalletForm } from "./components/WalletForm";
import { useGetWallets } from "./hooks/useGetWallets";
import { useGetHistory } from "./hooks/useGetHistory";

import { useAuthStore } from "@/auth/authStore";
import { CustomModal } from "@/components/custom/CustomModal";
import { CustomEmptyState } from "@/components/custom/CustomEmptyState";
import { SearchInput } from "@/components/controls/SearchInput";
import { Button } from "@/components/controls/Button";
import { formatMonthYear } from "@/utils/formatters/formatMonthYear";
import { TabFilter } from "@/components/controls/TabFilter";
import { useDebounce } from "@/hooks/useDebounce";

const getEmptyTitle = (search: string, walletType: "MINE" | "SHARED") => {
    if (search.trim()) {
        return "Sin resultados";
    }
    if (walletType === "MINE") {
        return "No tienes billeteras aún";
    }
    return "No tienes billeteras compartidas";
};

const getEmptyDescription = (
    search: string,
    walletType: "MINE" | "SHARED",
) => {
    if (search.trim()) {
        return "Prueba con otro término de búsqueda";
    }
    if (walletType === "MINE") {
        return "Crea tu primera billetera para empezar a gestionar tus finanzas";
    }
    return "Cuando alguien te invite a una billetera, aparecerá aquí";
};

export const WalletsPage = () => {
    const [params] = useSearchParams();
    const query = params.get("query") || "";
    const debouncedQuery = useDebounce(query, 500);
    const walletType = (params.get("walletType") as "MINE" | "SHARED") ?? "MINE";

    const { isLoading: isLoadingWallets, data: walletData } = useGetWallets(walletType, debouncedQuery);
    const { isLoading: isLoadingHistory, data: historyData } = useGetHistory();
    const user = useAuthStore((state) => state.user);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const wallets = walletData?.data.content || [];
    const history = historyData?.data.content || [];
    const ownerLabel = user?.email || "—";
    const showCreateButton = walletType === "MINE" && !query.trim();

    return (
        <div className="flex gap-6 h-full min-h-0">
            <section className="flex-1 min-w-0 flex flex-col px-6 py-5">
                <div className="flex flex-col gap-4 mb-6">
                    <div className="flex items-center gap-3 flex-wrap justify-between">
                        <div className="flex gap-4 flex-1 justify-start">
                            <SearchInput
                                id="txtSearch"
                                placeholder="Buscar billetera..."
                                className="max-w-2xl"
                                syncToParams
                            />
                            <TabFilter
                                options={[
                                    { label: "Mis wallets", value: "MINE" },
                                    { label: "Compartidas", value: "SHARED" },
                                ]}
                                selected={walletType}
                                keyFilter="walletType"
                            />
                        </div>

                        {walletType === "MINE" && (
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

            <aside className="w-full lg:w-80 xl:w-96 shrink-0 border-t lg:border-t-0 lg:border-l border-light-10 flex flex-col px-6 py-5 min-h-0">
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

                <div className="flex-1 min-h-0 overflow-y-auto">
                    {renderHistory()}
                </div>
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

    function renderHistory() {
        if (isLoadingHistory) {
            return (
                <ul className="flex flex-col">
                    {Array.from({ length: 6 }).map((_, index) => (
                        <HistoryItemSkeleton key={index} />
                    ))}
                </ul>
            );
        }

        if (history.length > 0) {
            return (
                <ul className="flex flex-col">
                    {history.map((transaction) => (
                        <HistoryItem key={transaction.id} transaction={transaction} />
                    ))}
                </ul>
            );
        }

        return (
            <CustomEmptyState
                title="Sin historial"
                description="Cuando registres movimientos, aparecerán aquí."
                Icon={Receipt}
            />
        );
    }

    function renderWalletList() {
        if (isLoadingWallets) {
            return (
                <section className="flex flex-col gap-3">
                    {Array.from({ length: 6 }).map((_, index) => (
                        <WalletItemSkeleton key={index} />
                    ))}
                </section>
            );
        }

        if (wallets.length > 0) {
            return (
                <section className="flex flex-col gap-3">
                    {wallets.map((wallet) => (
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
                title={getEmptyTitle(query, walletType)}
                description={getEmptyDescription(query, walletType)}
                Icon={walletType === "MINE" ? Wallet : Users}
                buttonText={showCreateButton ? "Crear billetera" : undefined}
                onButtonClick={showCreateButton ? () => setIsModalOpen(true) : undefined}
            />
        );
    }
};
