export const collaboratorStatusLabel = (status: string) => {
    const normalized = status.trim().toUpperCase();

    if (normalized === "ALREADY_MEMBER") {
        return "Ya es miembro";
    }
    if (normalized === "PENDING") {
        return "Invitación pendiente";
    }
    if (normalized === "INVITABLE") {
        return "Disponible";
    }

    return status;
};
