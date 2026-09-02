import { UserMinus, Users } from "lucide-react";

import type { WalletMember } from "../interfaces/WalletMember";

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

const roleLabel = (role?: string | null) => {
    const normalized = role?.trim().toUpperCase() ?? "";

    if (normalized === "OWNER") {
        return "Propietario";
    }
    if (normalized === "EDITOR" || normalized === "MEMBER") {
        return "Miembro";
    }
    if (normalized === "VIEWER") {
        return "Solo lectura";
    }

    return role?.trim() || "Miembro";
};

const getInitials = (value: string) => {
    const trimmed = value.trim();

    if (!trimmed) {
        return "?";
    }

    if (trimmed.includes("@")) {
        return trimmed.slice(0, 2).toUpperCase();
    }

    const parts = trimmed.split(/\s+/).filter(Boolean);

    if (parts.length === 1) {
        return parts[0].slice(0, 2).toUpperCase();
    }

    return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
};

export const WalletMembersList = ({
    members,
    isLoading,
    canManage = false,
    onRemoveMember,
}: WalletMembersListProps) => {
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
                    title="Sin miembros"
                    description="Cuando invites a alguien y acepte, aparecerá aquí."
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
                const isOwner = member.role?.trim().toUpperCase() === "OWNER";
                const canRemove =
                    canManage && !isOwner && !isCurrentUser && !!onRemoveMember;
                const displayName = member.name?.trim() || member.email;
                const subtitle = isCurrentUser ? "Tú" : member.email;

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
                                            Tú
                                        </span>
                                    ) : null}
                                </div>
                                <p className="truncate text-xs text-helper">
                                    {isCurrentUser ? member.email : subtitle}
                                </p>
                                <p className="mt-0.5 text-[11px] text-label">
                                    Se unió {formatterDynamicDate(member.joinedAt)}
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
                                    title="Eliminar miembro"
                                    aria-label={`Eliminar a ${displayName}`}
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
