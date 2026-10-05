import { Link } from "react-router";
import { Undo2 } from "lucide-react";
import { useTranslation } from "react-i18next";

export interface AuthBackLinkProps {
    to: string;
    label: string;
    disabled?: boolean;
}

export const AuthBackLink = ({ to, label, disabled = false }: AuthBackLinkProps) => {
    const { t } = useTranslation();

    return (
        <Link
            to={to}
            aria-label={label}
            title={label}
            aria-disabled={disabled}
            className={`group absolute left-4 top-4 inline-flex items-center gap-1.5 rounded-lg px-2 py-1.5 text-xs font-medium text-helper transition-colors hover:bg-light-5 hover:text-light sm:left-5 sm:top-5 ${disabled ? "pointer-events-none opacity-50" : ""
                }`}
        >
            <Undo2 size={15} className="transition-transform group-hover:-translate-x-0.5" />
            {t("auth.back")}
        </Link>
    );
};
