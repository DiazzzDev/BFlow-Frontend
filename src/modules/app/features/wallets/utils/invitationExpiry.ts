import { parseISO } from "date-fns";

import { formatterDynamicDate } from "@/utils/formatters/formatDynamicDate";

export const isInvitationExpired = (expiresAt?: string | null) => {
    if (!expiresAt) {
        return false;
    }

    const date = parseISO(expiresAt);
    return !Number.isNaN(date.getTime()) && date.getTime() < Date.now();
};

export const getInvitationExpiryLabel = (expiresAt?: string | null) => {
    if (!expiresAt) {
        return null;
    }

    if (isInvitationExpired(expiresAt)) {
        return "Expiró";
    }

    const relative = formatterDynamicDate(expiresAt);
    return relative ? `Caduca ${relative}` : null;
};
