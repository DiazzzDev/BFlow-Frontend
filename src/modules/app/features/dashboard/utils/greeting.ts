export const getTimeGreeting = (date = new Date()) => {
    const hour = date.getHours();
    if (hour < 12) { return "morning" };
    if (hour < 18) { return "afternoon" };
    return "evening";
};

export const getFirstName = (fullName: string | null | undefined) => {
    if (!fullName?.trim()) { return "" };
    return fullName.trim().split(/\s+/)[0] ?? "";
};
