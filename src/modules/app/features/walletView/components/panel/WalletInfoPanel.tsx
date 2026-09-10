import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { X } from "lucide-react";

import {
    WalletViewSidebar,
    type WalletViewSidebarProps,
} from "../WalletViewSidebar";
import { ScheduleTransactionModal } from "../modal/ScheduleTransactionModal";

interface WalletInfoPanelProps {
    walletId: string;
    isDesktopOpen: boolean;
    isMobileOpen: boolean;
    onCloseMobile: () => void;
    sidebarProps: Omit<WalletViewSidebarProps, "className" | "onSchedule">;
}

export const WalletInfoPanel = ({
    walletId,
    isDesktopOpen,
    isMobileOpen,
    onCloseMobile,
    sidebarProps,
}: WalletInfoPanelProps) => {
    const [isScheduleOpen, setIsScheduleOpen] = useState(false);

    useEffect(() => {
        if (!isMobileOpen) {
            return;
        }

        const previousOverflow = document.body.style.overflow;
        document.body.style.overflow = "hidden";

        return () => {
            document.body.style.overflow = previousOverflow;
        };
    }, [isMobileOpen]);

    const handleSchedule = () => {
        onCloseMobile();
        setIsScheduleOpen(true);
    };

    return (
        <>
            <AnimatePresence initial={false}>
                {isDesktopOpen && (
                    <motion.div
                        key="wallet-info-panel"
                        initial={{ width: 0, opacity: 0, x: 16 }}
                        animate={{ width: 320, opacity: 1, x: 0 }}
                        exit={{ width: 0, opacity: 0, x: 16 }}
                        transition={{ type: "spring", stiffness: 320, damping: 32 }}
                        className="hidden min-h-0 shrink-0 overflow-hidden border-l border-light-10 @3xl:block"
                    >
                        <WalletViewSidebar
                            {...sidebarProps}
                            onSchedule={handleSchedule}
                            className="h-full w-80"
                        />
                    </motion.div>
                )}
            </AnimatePresence>

            <button
                type="button"
                aria-label="Cerrar información"
                onClick={onCloseMobile}
                className={`fixed inset-0 z-40 bg-surface-hard/70 transition-opacity @3xl:hidden ${
                    isMobileOpen ? "opacity-100" : "pointer-events-none opacity-0"
                }`}
            />
            <div
                className={`fixed inset-y-0 right-0 z-50 flex w-full max-w-sm flex-col border-l border-light-10 bg-surface transition-transform duration-300 ease-out @3xl:hidden ${
                    isMobileOpen ? "translate-x-0" : "translate-x-full"
                }`}
            >
                <div className="flex justify-end border-b border-light-10 px-4 py-3">
                    <button
                        type="button"
                        onClick={onCloseMobile}
                        aria-label="Cerrar información"
                        className="cursor-pointer rounded-lg p-1.5 text-helper transition-colors hover:bg-light-5 hover:text-light"
                    >
                        <X className="h-5 w-5" />
                    </button>
                </div>
                <div className="min-h-0 flex-1 overflow-y-auto">
                    <WalletViewSidebar
                        {...sidebarProps}
                        onSchedule={handleSchedule}
                        className="min-h-full"
                    />
                </div>
            </div>

            <ScheduleTransactionModal
                isModalOpen={isScheduleOpen}
                setIsModalOpen={setIsScheduleOpen}
                walletId={walletId}
            />
        </>
    );
};
