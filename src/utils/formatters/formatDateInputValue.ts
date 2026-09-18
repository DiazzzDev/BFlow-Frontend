export const formatDateInputValue = (date: string) => date.slice(0, 10);

export const formatTodayDateInputValue = () =>
    new Date().toISOString().slice(0, 10);
