import { addDays, addMonths, addWeeks, parseISO } from "date-fns";

import type { EnrichedRecurring, RecurringOccurrence } from "../interfaces/Calendar";

import { toDateKey } from "./calendarGrid";


const stepDate = (date: Date, recurring: EnrichedRecurring, direction: 1 | -1): Date => {
    const amount = Math.max(1, recurring.intervalValue) * direction;

    switch (recurring.frequency) {
        case "DAILY":
            return addDays(date, amount);
        case "WEEKLY":
            return addWeeks(date, amount);
        case "MONTHLY":
        default:
            return addMonths(date, amount);
    }
};

/**
 * `GET /api/v1/recurring` only returns `nextExecutionDate` (the single next
 * occurrence), not the full schedule or a `startDate`. To show past and
 * future occurrences on a given month ("Netflix on the 5th", "Salario on
 * the 15th") we project forward/backward from that anchor using the
 * recurring's frequency + interval, stopping once we leave the visible
 * range. This is a client-side approximation: a recurring item created
 * recently can appear to "occur" on months before it actually started,
 * since the API doesn't expose a start date. If the backend later adds one,
 * this projection should be bounded by it.
 */
export const projectRecurringOccurrences = (
    recurringItems: EnrichedRecurring[],
    rangeStartKey: string,
    rangeEndKey: string,
): RecurringOccurrence[] => {
    const occurrences: RecurringOccurrence[] = [];
    const MAX_STEPS = 400; // safety guard against DAILY recurrences over a wide range

    for (const recurring of recurringItems) {
        if (!recurring.active) {continue;}

        const anchor = parseISO(recurring.nextExecutionDate);
        const anchorKey = toDateKey(anchor);

        if (anchorKey >= rangeStartKey && anchorKey <= rangeEndKey) {
            occurrences.push({ recurring, date: anchorKey });
        }

        // Walk backwards from the anchor
        let cursor = anchor;
        for (let i = 0; i < MAX_STEPS; i += 1) {
            cursor = stepDate(cursor, recurring, -1);
            const key = toDateKey(cursor);
            if (key < rangeStartKey) {break;}
            if (key <= rangeEndKey) {
                occurrences.push({ recurring, date: key });
            }
        }

        // Walk forwards from the anchor
        cursor = anchor;
        for (let i = 0; i < MAX_STEPS; i += 1) {
            cursor = stepDate(cursor, recurring, 1);
            const key = toDateKey(cursor);
            if (key > rangeEndKey) {break;}
            if (key >= rangeStartKey) {
                occurrences.push({ recurring, date: key });
            }
        }
    }

    return occurrences;
};
