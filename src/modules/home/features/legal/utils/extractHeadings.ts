export const extractHeadings = (
    markdown: string,
): Array<{ id: string; label: string }> => {
    const lines = markdown.split("\n");
    const headings: Array<{ id: string; label: string }> = [];
    const pattern = /^#{1,2}\s+(.+)$/;

    for (const line of lines) {
        const match = pattern.exec(line);

        if (match) {
            const label = match[1].replace(/[*_`]/g, "").trim();
            const id = label
                .toLowerCase()
                .replace(/[^a-z0-9\s]/g, "")
                .replace(/\s+/g, "-");
            headings.push({ id, label });
        }
    }

    return headings;
};
