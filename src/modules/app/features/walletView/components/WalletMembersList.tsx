import { UserMinus, Users } from "lucide-react";
import { useTranslation } from "react-i18next";

import type { WalletMember } from "../interfaces/WalletMember";
import { roleLabel } from "../utils/walletRole";

import { getInitials } from "@/utils/getInitials";
import { useAuthStore } from "@/auth/authStore";
import { CustomEmptyState } from "@/components/custom/CustomEmptyState";
import { SkeletonText } from "@/components/loaders/SkeletonText";
import { formatterDynamicDate } from "@/utils/formatters/formatDynamicDate";

interface WalletMembersListProps {
    members: WalletMember[];
    isLoading: boolean;
    canManage?: boolean;
    onRemoveMember?: (member: WalletMember) => void;
}

export const WalletMembersList = ({
    members,
    isLoading,
    canManage = false,
    onRemoveMember,
}: WalletMembersListProps) => {
    const { t } = useTranslation();
    const user = useAuthStore((state) => state.user);

    if (isLoading) {
        return (
            <ul>
                {Array.from({ length: 3 }).map((_, index) => (
                    <li
                        key={index}
                        className="flex items-center justify-between gap-3 border-b border-light-10 py-4"
                    >
                        <div className="flex min-w-0 items-center gap-3">
                            <SkeletonText className="h-10 w-10 rounded-full" />
                            <div className="space-y-2">
                                <SkeletonText className="h-4 w-32" />
                                <SkeletonText className="h-3 w-24" />
                            </div>
                        </div>
                        <SkeletonText className="h-6 w-20 rounded-full" />
                    </li>
                ))}
            </ul>
        );
    }

    if (members.length === 0) {
        return (
            <div className="flex h-full min-h-40 items-center justify-center">
                <CustomEmptyState
                    Icon={Users}
                    title={t("walletView.noMembers")}
                    description={t("walletView.membersHint")}
                    className="my-0!"
                />
            </div>
        );
    }

    return (
        <ul>
            {members.map((member) => {
                const isCurrentUser =
                    !!user?.email &&
                    user.email.toLowerCase() === member.email.toLowerCase();
                const isOwner = member.role.trim().toUpperCase() === "OWNER";
                const canRemove =
                    canManage && !isOwner && !isCurrentUser && !!onRemoveMember;
                const displayName = member.name.trim() || member.email;
                const subtitle = isCurrentUser ? t("walletView.you") : member.email;

                return (
                    <li
                        key={member.id}
                        className="group flex items-center justify-between gap-3 border-b border-light-10 py-4 last:border-b-0"
                    >
                        <div className="flex min-w-0 items-center gap-3">
                            {member.pictureUrl ? (
                                <img
                                    src={member.pictureUrl}
                                    alt={displayName}
                                    className="h-10 w-10 shrink-0 rounded-full object-cover"
                                    referrerPolicy="no-referrer"
                                />
                            ) : (
                                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-secondary text-xs font-semibold text-light">
                                    {getInitials(displayName)}
                                </div>
                            )}
                            <div className="min-w-0">
                                <div className="flex min-w-0 items-center gap-2">
                                    <p className="truncate text-sm font-medium text-light">
                                        {displayName}
                                    </p>
                                    {isCurrentUser ? (
                                        <span className="shrink-0 rounded-full bg-light-5 px-2 py-0.5 text-[10px] font-medium text-helper">
                                            {t("walletView.you")}
                                        </span>
                                    ) : null}
                                </div>
                                <p className="truncate text-xs text-helper">
                                    {isCurrentUser ? member.email : subtitle}
                                </p>
                                <p className="mt-0.5 text-[11px] text-label">
                                    {t("walletView.joined", { date: formatterDynamicDate(member.joinedAt) })}
                                </p>
                            </div>
                        </div>

                        <div className="flex shrink-0 items-center gap-2">
                            <span className="rounded-full border border-light-10 px-2.5 py-1 text-xs text-helper">
                                {roleLabel(member.role)}
                            </span>
                            {canRemove ? (
                                <button
                                    type="button"
                                    title={t("walletView.removeMember")}
                                    aria-label={`${t("walletView.removeMember")} ${displayName}`}
                                    onClick={() => onRemoveMember(member)}
                                    className="inline-flex cursor-pointer items-center justify-center rounded-lg p-2 text-helper opacity-70 transition-all hover:bg-danger-sweet hover:text-danger group-hover:opacity-100"
                                >
                                    <UserMinus className="h-4 w-4" />
                                </button>
                            ) : null}
                        </div>
                    </li>
                );
            })}
        </ul>
    );
};
