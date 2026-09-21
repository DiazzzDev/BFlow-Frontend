import { Pencil, User } from "lucide-react";
import { useTranslation } from "react-i18next";

import { useAuthStore } from "@/auth/authStore";
import { getInitials } from "@/utils/getInitials";

interface SettingsProfileSectionProps {
    onEdit: () => void;
}

export const SettingsProfileSection = ({ onEdit }: SettingsProfileSectionProps) => {
    const { t } = useTranslation();
    const user = useAuthStore((state) => state.user);
    const displayName = user?.name?.trim() || t("settings.profile");
    const email = user?.email ?? "";

    return (
        <section className="p-8">
            <div className="flex flex-col items-center text-center">
                <div className="relative mb-4">
                    {user?.pictureUrl ? (
                        <img
                            src={user.pictureUrl}
                            alt={displayName}
                            className="h-28 w-28 rounded-full border-2 border-light-10 object-cover"
                            referrerPolicy="no-referrer"
                        />
                    ) : (
                        <div className="flex h-28 w-28 items-center justify-center rounded-full border-2 border-light-10 bg-secondary text-2xl font-semibold text-light">
                            {user?.name ? getInitials(user.name) : <User className="h-10 w-10 text-helper" />}
                        </div>
                    )}

                    <button
                        type="button"
                        onClick={onEdit}
                        className="absolute bottom-0 right-0 cursor-pointer rounded-full border border-light-10 bg-surface-hard p-2 text-light transition-colors hover:bg-secondary active:scale-95"
                        title={t("a11y.editProfile")}
                        aria-label={t("a11y.editProfile")}
                    >
                        <Pencil className="h-4 w-4" />
                    </button>
                </div>

                <h2 className="text-xl font-semibold tracking-tight text-light">{displayName}</h2>
                {email ? <p className="mt-1 text-sm text-helper">{email}</p> : null}
            </div>
        </section>
    );
};
