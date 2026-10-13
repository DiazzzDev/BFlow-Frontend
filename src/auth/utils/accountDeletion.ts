import { addDays, differenceInCalendarDays, isValid, parseISO } from "date-fns";

export const ACCOUNT_DELETION_GRACE_DAYS = 30;

// Falls back to the deletion request date when the API does not send the final date
export const getDeletionScheduledAt = (
    scheduledAt?: string | null,
    deletedAt?: string | null,
): string | null => {
    if (scheduledAt) {
        return scheduledAt;
    }
    if (!deletedAt) {
        return null;
    }

    const requestedAt = parseISO(deletedAt);
    return isValid(requestedAt) ? addDays(requestedAt, ACCOUNT_DELETION_GRACE_DAYS).toISOString() : null;
};

export const getDaysUntilDeletion = (scheduledAt: string) =>
    Math.max(differenceInCalendarDays(parseISO(scheduledAt), new Date()), 0);
