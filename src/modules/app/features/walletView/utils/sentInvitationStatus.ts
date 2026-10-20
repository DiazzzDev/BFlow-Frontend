import type { WalletSentInvitation } from "../../wallets/interfaces/WalletSentInvitation";

export const getSentInvitationStatusLabel = (
    status: WalletSentInvitation["status"],
    expired: boolean,
) => {
    if (expired && status === "PENDING") {
        return "Expirada";
    }
    if (status === "PENDING") {
        return "Pendiente";
    }
    if (status === "ACCEPTED") {
        return "Aceptada";
    }
    if (status === "DECLINED") {
        return "Rechazada";
    }
    return status;
};

export const getSentInvitationStatusDotClass = (
    status: WalletSentInvitation["status"],
    expired: boolean,
) => {
    if (expired && status === "PENDING") {
        return "bg-helper";
    }
    if (status === "PENDING") {
        return "bg-primary";
    }
    if (status === "ACCEPTED") {
        return "bg-success";
    }
    if (status === "DECLINED") {
        return "bg-danger";
    }
    return "bg-helper";
};

export const getSentInvitationStatusBadgeClass = (
    status: WalletSentInvitation["status"],
    expired: boolean,
) => {
    if (expired && status === "PENDING") {
        return "border-light-10 text-helper";
    }
    if (status === "PENDING") {
        return "border-primary/30 bg-primary/10 text-primary";
    }
    if (status === "ACCEPTED") {
        return "border-success-50 bg-success-sweet text-success";
    }
    if (status === "DECLINED") {
        return "border-danger-50/50 bg-danger-sweet text-danger";
    }
    return "border-light-10 text-helper";
};

export const getSentInvitationDisplayName = (
    invitation: WalletSentInvitation,
) => {
    const name = invitation.invitedUserName?.trim();
    if (name) {
        return name;
    }

    const localPart = invitation.invitedEmail.split("@")[0]?.trim();
    return localPart || invitation.invitedEmail;
};
