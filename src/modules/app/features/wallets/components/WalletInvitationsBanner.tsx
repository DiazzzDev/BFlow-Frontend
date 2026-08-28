import { Mail } from "lucide-react";

interface WalletInvitationsBannerProps {
    count: number;
    onOpen: () => void;
}

export const WalletInvitationsBanner = ({
    count,
    onOpen,
}: WalletInvitationsBannerProps) => {
    if (count <= 0) {
        return null;
    }

    return (
        <button
            type="button"
            onClick={onOpen}
            className="mb-4 flex w-full cursor-pointer items-center gap-3 rounded-2xl border border-primary/30 bg-primary/10 px-4 py-3 text-left transition-colors hover:bg-primary/15"
        >
            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-primary/20 text-primary">
                <Mail className="h-4 w-4" />
            </span>
            <span className="min-w-0 flex-1">
                <span className="block text-sm font-medium text-light">
                    Tienes {count} {count === 1 ? "invitación pendiente" : "invitaciones pendientes"}
                </span>
                <span className="mt-0.5 block text-xs text-helper">
                    Revísalas para unirte a billeteras compartidas.
                </span>
            </span>
            <span className="shrink-0 text-sm font-medium text-primary">Ver</span>
        </button>
    );
};
