import type { BudgetHealthStatus } from "../interfaces/dashboard";

const STATUS_STYLES: Record<BudgetHealthStatus, string> = {
    OK: "bg-info-25 text-info",
    WARNING: "bg-warning-sweet text-warning",
    CRITICAL: "bg-primary-15 text-primary",
    EXCEEDED: "bg-danger-sweet text-danger",
};

export const getBudgetHealthStatusStyle = (status: BudgetHealthStatus) =>
    STATUS_STYLES[status];
