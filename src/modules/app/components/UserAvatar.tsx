import { User } from "lucide-react";

import type { InternalUser } from "@/auth/InternalUser";

interface UserAvatarProps {
    user: InternalUser | null;
    className?: string;
}

export const UserAvatar = ({ user, className = "h-9 w-9" }: UserAvatarProps) => {
    if (user?.pictureUrl) {
        return (
            <img
                src={user.pictureUrl}
                alt=""
                className={`${className} rounded-full object-cover`}
                referrerPolicy="no-referrer"
            />
        );
    }

    return (
        <span className={`${className} flex items-center justify-center rounded-full bg-secondary`}>
            <User className="h-5 w-5" />
        </span>
    );
};
