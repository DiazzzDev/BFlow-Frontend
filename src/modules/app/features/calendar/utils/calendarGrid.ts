import {
    addMonths,
    eachDayOfInterval,
    endOfMonth,
    endOfWeek,
    format,
    isSameMonth,
    isToday,
    parseISO,
    startOfMonth,
    startOfWeek,
    subMonths,
} from "date-fns";

/** yyyy-MM-dd, used as the stable key for bucketing data by day. */
export const toDateKey = (date: Date): string => format(date, "yyyy-MM-dd");

export const parseDateKey = (dateKey: string): Date => parseISO(dateKey);

export interface CalendarDayCellMeta {
    date: Date;
    dateKey: string;
    isCurrentMonth: boolean;
    isToday: boolean;
}

/** Full 6-week (42 day) grid for the month containing `anchor`, starting on Monday. */
export const buildMonthWeeks = (anchor: Date): CalendarDayCellMeta[][] => {
    const monthStart = startOfMonth(anchor);
    const monthEnd = endOfMonth(anchor);
    const gridStart = startOfWeek(monthStart, { weekStartsOn: 1 });
    const gridEnd = endOfWeek(monthEnd, { weekStartsOn: 1 });

    const days = eachDayOfInterval({ start: gridStart, end: gridEnd }).map((date) => ({
        date,
        dateKey: toDateKey(date),
        isCurrentMonth: isSameMonth(date, anchor),
        isToday: isToday(date),
    }));

    const weeks: CalendarDayCellMeta[][] = [];
    for (let i = 0; i < days.length; i += 7) {
        weeks.push(days.slice(i, i + 7));
    }

    return weeks;
};

export const WEEKDAY_LABELS = ["Lun", "Mar", "Mié", "Jue", "Vie", "Sáb", "Dom"];

export const goToPreviousMonth = (anchor: Date): Date => subMonths(anchor, 1);
export const goToNextMonth = (anchor: Date): Date => addMonths(anchor, 1);
