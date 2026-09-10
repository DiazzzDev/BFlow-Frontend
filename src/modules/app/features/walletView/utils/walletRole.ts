export const isOwnerRole = (role?: string | null) =>
    role?.trim().toUpperCase() === "OWNER";

export const roleLabel = (role?: string | null) => {
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
