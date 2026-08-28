export const getTimeGreeting = (date = new Date()) => {
    const hour = date.getHours();
    if (hour < 12) { return "Buenos días" };
    if (hour < 18) { return "Buenas tardes" };
    return "Buenas noches";
};

export const getFirstName = (fullName: string | null | undefined) => {
    if (!fullName?.trim()) { return "" };
    return fullName.trim().split(/\s+/)[0] ?? "";
};
