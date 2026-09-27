export type TimeGreeting = "morning" | "afternoon" | "evening";

export type DashboardGreetingKey = `dashboard.${TimeGreeting}`;

const GREETING_KEYS = {
    morning: "dashboard.morning",
    afternoon: "dashboard.afternoon",
    evening: "dashboard.evening",
} as const satisfies Record<TimeGreeting, DashboardGreetingKey>;

// Time-of-day greeting key for i18n
export const getTimeGreeting = (date = new Date()): TimeGreeting => {
    const hour = date.getHours();

    if (hour < 12) {
        return "morning";
    }

    if (hour < 18) {
        return "afternoon";
    }

    return "evening";
};

export const getDashboardGreetingKey = (
    date = new Date(),
): DashboardGreetingKey => GREETING_KEYS[getTimeGreeting(date)];

export const getFirstName = (fullName: string | null | undefined) => {
    if (!fullName?.trim()) {
        return "";
    }

    return fullName.trim().split(/\s+/)[0] ?? "";
};
