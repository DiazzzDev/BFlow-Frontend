/** Returns a safe URL for <img src>, or null if the value is not renderable. */
export const sanitizeImageUrl = (url: string | null | undefined): string | null => {
    if (!url) {
        return null;
    }

    try {
        const parsed = new URL(url, window.location.origin);
        if (["http:", "https:", "blob:"].includes(parsed.protocol)) {
            return parsed.href;
        }
    } catch {
        // Invalid URL structure
    }

    return null;
};
