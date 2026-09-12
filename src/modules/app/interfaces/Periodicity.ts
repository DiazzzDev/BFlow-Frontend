export const PERIODICITY_VALUES = [
    "DAILY",
    "WEEKLY",
    "MONTHLY",
    "YEARLY",
] as const;

export type Periodicity = (typeof PERIODICITY_VALUES)[number];

export const PERIODICITY_LABELS: Record<Periodicity, string> = {
    DAILY: "Diario",
    WEEKLY: "Semanal",
    MONTHLY: "Mensual",
    YEARLY: "Anual",
};

export const PERIODICITY_FORM_OPTIONS: Array<{
    value: Periodicity;
    label: string;
}> = PERIODICITY_VALUES.map((value) => ({
    value,
    label: PERIODICITY_LABELS[value],
}));
