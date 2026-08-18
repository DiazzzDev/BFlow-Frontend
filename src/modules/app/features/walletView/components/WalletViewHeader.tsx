import { motion } from "framer-motion";
import { PanelRightClose, PanelRightOpen } from "lucide-react";

import { SkeletonText } from "@/components/loaders/SkeletonText";
import { formatCurrency } from "@/utils/formatters/formatCurrency";

interface WalletViewHeaderProps {
    name?: string;
    balance?: number;
    currency?: string;
    isLoading: boolean;
    isInfoPanelOpen: boolean;
    showInfoControls?: boolean;
    onOpenMobileInfo: () => void;
    onToggleDesktopInfo: () => void;
}

export const WalletViewHeader = ({
    name,
    balance = 0,
    currency,
    isLoading,
    isInfoPanelOpen,
    showInfoControls = true,
    onOpenMobileInfo,
    onToggleDesktopInfo,
}: WalletViewHeaderProps) => {
    return (
        <div className="mb-6 flex flex-col gap-3 px-4 sm:px-7 @md:flex-row @md:items-center @md:justify-between">
            <div className="min-w-0">
                {isLoading ? (
                    <div className="space-y-2">
                        <SkeletonText className="h-8 w-48" />
                        <SkeletonText className="h-4 w-56" />
                    </div>
                ) : (
                    <>
                        <h1 className="truncate text-2xl font-semibold tracking-tight text-light sm:text-3xl">
                            {name ?? "Wallet"}
                        </h1>
                        <p className="mt-1 text-sm text-helper">
                            {formatCurrency(balance, currency)} current balance
                        </p>
                    </>
                )}
            </div>

            {showInfoControls ? (
                <>
                    <button
                        type="button"
                        onClick={onOpenMobileInfo}
                        className="inline-flex items-center justify-center gap-2 rounded-lg border border-light-10 bg-surface px-4 py-2 text-sm font-medium text-light transition-colors hover:bg-light-5 cursor-pointer @3xl:hidden"
                    >
                        <PanelRightOpen className="h-4 w-4" />
                        Ver info
                    </button>

                    <button
                        type="button"
                        onClick={onToggleDesktopInfo}
                        className="hidden items-center justify-center gap-2 rounded-lg border border-light-10 bg-surface px-4 py-2 text-sm font-medium text-light transition-colors hover:bg-light-5 cursor-pointer @3xl:inline-flex"
                    >
                        <motion.span
                            key={isInfoPanelOpen ? "close" : "open"}
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ duration: 0.15 }}
                            className="flex items-center gap-2"
                        >
                            {isInfoPanelOpen ? (
                                <>
                                    <PanelRightClose className="h-4 w-4" />
                                    Ocultar info
                                </>
                            ) : (
                                <>
                                    <PanelRightOpen className="h-4 w-4" />
                                    Ver info
                                </>
                            )}
                        </motion.span>
                    </button>
                </>
            ) : null}
        </div>
    );
};
