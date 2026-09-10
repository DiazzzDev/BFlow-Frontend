export const getInitials = (value: string) => {
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
