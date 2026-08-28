import { Mail } from "lucide-react";

interface WalletInvitationsButtonProps {
    count: number;
    onClick: () => void;
    className?: string;
}

export const WalletInvitationsButton = ({
    count,
    onClick,
    className = "",
}: WalletInvitationsButtonProps) => {
    const hasPending = count > 0;

    return (
        <button
            type="button"
            onClick={onClick}
            className={`relative inline-flex shrink-0 cursor-pointer items-center justify-center gap-2 rounded-lg border px-4 py-2 text-sm font-medium transition-colors ${
                hasPending
                    ? "border-primary/40 bg-primary/10 text-light hover:bg-primary/15"
                    : "border-light-10 text-light hover:bg-light-5"
            } ${className}`}
        >
            <Mail className="h-4 w-4 shrink-0" />
            <span>Invitaciones</span>
            {hasPending ? (
                <span className="inline-flex min-w-5 items-center justify-center rounded-full bg-primary px-1.5 py-0.5 text-[11px] font-semibold leading-none text-light">
                    {count > 99 ? "99+" : count}
                </span>
            ) : null}
        </button>
    );
};
