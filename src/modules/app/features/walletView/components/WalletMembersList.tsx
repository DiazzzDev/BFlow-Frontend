import { Users } from "lucide-react";

import type { WalletMember } from "../interfaces/WalletMember";

import { useAuthStore } from "@/auth/authStore";
import { CustomEmptyState } from "@/components/custom/CustomEmptyState";
import { SkeletonText } from "@/components/loaders/SkeletonText";
import { formatterDynamicDate } from "@/utils/formatters/formatDynamicDate";

interface WalletMembersListProps {
    members: WalletMember[];
    isLoading: boolean;
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

const getDisplayName = (email: string) => {
    const localPart = email.split("@")[0]?.trim();
    return localPart || email;
};

export const WalletMembersList = ({
    members,
    isLoading,
}: WalletMembersListProps) => {
    const user = useAuthStore((state) => state.user);

    if (isLoading) {
        return (
            <ul className="min-h-0 flex-1 overflow-y-auto px-4 sm:px-7">
                {Array.from({ length: 3 }).map((_, index) => (
                    <li
                        key={index}
                        className="flex items-center justify-between gap-3 border-b border-light-10 py-4"
                    >
                        <div className="flex min-w-0 items-center gap-3">
                            <SkeletonText className="h-9 w-9 rounded-full" />
                            <div className="space-y-2">
                                <SkeletonText className="h-4 w-32" />
                                <SkeletonText className="h-3 w-20" />
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
            <div className="flex min-h-0 flex-1 items-center px-4 sm:px-7">
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
        <ul className="min-h-0 flex-1 overflow-y-auto px-4 sm:px-7">
            {members.map((member) => {
                const isCurrentUser =
                    !!user?.email &&
                    user.email.toLowerCase() === member.email.toLowerCase();
                const subtitle = isCurrentUser
                    ? "Tú"
                    : member.email;

                return (
                    <li
                        key={member.id}
                        className="flex items-center justify-between gap-3 border-b border-light-10 py-4 last:border-b-0"
                    >
                        <div className="flex min-w-0 items-center gap-3">
                            {member.pictureUrl && (
                                <img
                                    src={member.pictureUrl}
                                    alt={member.name}
                                    className="h-9 w-9 rounded-full object-cover"
                                    referrerPolicy="no-referrer"
                                />
                            )}
                            <div className="min-w-0">
                                <p className="truncate text-sm font-medium text-light">
                                    {member.name}
                                </p>
                                <p className="truncate text-xs text-helper">{subtitle}</p>
                            </div>
                        </div>
                        <div className="flex flex-col items-end gap-2">
                            <span className="shrink-0 rounded-full border border-light-10 px-2.5 py-1 text-xs text-helper">
                                {roleLabel(member.role)}
                            </span>
                            <span className="truncate text-xs text-helper">
                                Se unió: {formatterDynamicDate(member.joinedAt)}
                            </span>
                        </div>
                    </li>
                );
            })}
        </ul>
    );
};
