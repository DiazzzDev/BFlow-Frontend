import { useEffect } from "react";
import { createPortal } from "react-dom";
import { AnimatePresence, motion } from "framer-motion";
import { Mail, X } from "lucide-react";

import { useGetWalletInvitations } from "../hooks/useGetWalletInvitations";

import { WalletInvitationItem } from "./WalletInvitationItem";

import { CustomEmptyState } from "@/components/custom/CustomEmptyState";
import { SkeletonText } from "@/components/loaders/SkeletonText";

interface WalletInvitationsSidebarProps {
    isOpen: boolean;
    onClose: () => void;
}

export const WalletInvitationsSidebar = ({
    isOpen,
    onClose,
}: WalletInvitationsSidebarProps) => {
    const { data: invitationsResponse, isLoading } = useGetWalletInvitations();
    const invitations = invitationsResponse?.data ?? [];
    const pendingInvitations = invitations.filter(
        (invitation) => invitation.status === "PENDING",
    );

    useEffect(() => {
        if (!isOpen) {
            return;
        }

        const previousOverflow = document.body.style.overflow;
        document.body.style.overflow = "hidden";

        return () => {
            document.body.style.overflow = previousOverflow;
        };
    }, [isOpen]);

    return createPortal(
        <AnimatePresence>
            {isOpen ? (
                <div className="fixed inset-0 z-50">
                    <motion.button
                        type="button"
                        aria-label="Cerrar invitaciones"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.2 }}
                        onClick={onClose}
                        className="absolute inset-0 bg-surface-hard/70 backdrop-blur-[1px]"
                    />

                    <motion.aside
                        initial={{ x: "100%" }}
                        animate={{ x: 0 }}
                        exit={{ x: "100%" }}
                        transition={{ type: "spring", damping: 28, stiffness: 260 }}
                        className="absolute right-0 top-0 flex h-full w-full max-w-sm flex-col border-l border-light-10 bg-surface shadow-custom"
                    >
                        <div className="flex items-start justify-between gap-3 border-b border-light-10 px-5 py-4">
                            <div className="flex min-w-0 items-start gap-3">
                                <div className="min-w-0">
                                    <h2 className="text-base font-semibold text-light">
                                        Invitaciones
                                    </h2>
                                    <p className="mt-0.5 text-xs text-helper">
                                        {pendingInvitations.length > 0
                                            ? `${pendingInvitations.length} ${pendingInvitations.length === 1
                                                ? "pendiente"
                                                : "pendientes"
                                            }`
                                            : "No tienes invitaciones pendientes"}
                                    </p>
                                </div>
                            </div>

                            <button
                                type="button"
                                onClick={onClose}
                                aria-label="Cerrar panel de invitaciones"
                                className="rounded-lg p-1.5 text-helper transition-colors hover:bg-light-5 hover:text-light cursor-pointer"
                            >
                                <X className="h-4 w-4" />
                            </button>
                        </div>

                        <div className="flex-1 overflow-y-auto px-4 py-4">
                            {isLoading ? (
                                <div className="space-y-3">
                                    {Array.from({ length: 3 }).map((_, index) => (
                                        <div
                                            key={index}
                                            className="rounded-2xl border border-light-10 p-4"
                                        >
                                            <div className="mb-4 flex items-center gap-3">
                                                <SkeletonText className="h-11 w-11 rounded-full" />
                                                <div className="flex-1 space-y-2">
                                                    <SkeletonText className="h-4 w-32" />
                                                    <SkeletonText className="h-3 w-44" />
                                                </div>
                                            </div>
                                            <SkeletonText className="mb-2 h-4 w-40" />
                                            <SkeletonText className="h-9 w-full rounded-lg" />
                                        </div>
                                    ))}
                                </div>
                            ) : pendingInvitations.length === 0 ? (
                                <CustomEmptyState
                                    Icon={Mail}
                                    title="Sin invitaciones"
                                    description="Cuando alguien te invite a una billetera, aparecerá aquí."
                                    className="my-0!"
                                />
                            ) : (
                                <div className="space-y-3">
                                    {pendingInvitations.map((invitation) => (
                                        <WalletInvitationItem
                                            key={invitation.id}
                                            invitation={invitation}
                                        />
                                    ))}
                                </div>
                            )}
                        </div>
                    </motion.aside>
                </div>
            ) : null}
        </AnimatePresence>,
        document.body,
    );
};
