import { format, isSameYear, isToday, isYesterday, parseISO } from "date-fns";
import { enUS } from "date-fns/locale/en-US";
import { es } from "date-fns/locale/es";

import type { RecentActivityItem } from "../interfaces/dashboard";

import i18n, { getActiveLanguage } from "@/i18n/i18n";

export interface RecentActivityDayGroup {
    dayKey: string;
    label: string;
    activities: RecentActivityItem[];
}

const getDayLabel = (date: Date): string => {
    if (isToday(date)) {
        return i18n.t("dates.today");
    }

    if (isYesterday(date)) {
        return i18n.t("dates.yesterday");
    }

    const isSpanish = getActiveLanguage() === "es";
    const locale = isSpanish ? es : enUS;
    const pattern = isSpanish
        ? isSameYear(date, new Date())
            ? "EEEE, d 'de' MMMM"
            : "d 'de' MMMM 'de' yyyy"
        : isSameYear(date, new Date())
            ? "EEEE, MMMM d"
            : "MMMM d, yyyy";

    return format(date, pattern, { locale });
};

export const groupRecentActivityByDay = (
    activities: RecentActivityItem[],
): RecentActivityDayGroup[] => {
    const groups = new Map<string, { date: Date; activities: RecentActivityItem[] }>();

    activities.forEach((activity) => {
        const date = parseISO(activity.createdAt);
        const dayKey = format(date, "yyyy-MM-dd");
        const group = groups.get(dayKey);

        if (group) {
            group.activities.push(activity);
            return;
        }

        groups.set(dayKey, { date, activities: [activity] });
    });

    return Array.from(groups.entries())
        .map(([dayKey, group]) => ({
            dayKey,
            label: getDayLabel(group.date),
            activities: group.activities.sort(
                (left, right) => parseISO(right.createdAt).getTime() - parseISO(left.createdAt).getTime(),
            ),
        }))
        .sort((left, right) => right.dayKey.localeCompare(left.dayKey));
};
