import { format, parseISO } from "date-fns";
import { es } from "date-fns/locale";
import { Repeat } from "lucide-react";

import type { EnrichedRecurring } from "../interfaces/Calendar";

import { CustomModal } from "@/components/custom/CustomModal";
import { CategoryIcon } from "@/components/icons/CategoryIcon";
import { formatCurrency } from "@/utils/formatters/formatCurrency";


interface RecurringDetailsPanelProps {
    recurring: EnrichedRecurring | null;
    onClose: () => void;
    currency?: string;
}

const FREQUENCY_LABELS: Record<EnrichedRecurring["frequency"], string> = {
    DAILY: "Diaria",
    WEEKLY: "Semanal",
    MONTHLY: "Mensual",
};

const DetailRow = ({ label, value }: { label: string; value: React.ReactNode }) => (
    <div className="flex items-center justify-between border-b border-light-10 py-2.5 last:border-none">
        <span className="text-sm text-helper">{label}</span>
        <span className="text-sm font-medium text-light">{value}</span>
    </div>
);

export const RecurringDetailsPanel = ({ recurring, onClose, currency = "USD" }: RecurringDetailsPanelProps) => {
    return (
        <CustomModal
            isModalOpen={Boolean(recurring)}
            setIsModalOpen={(open) => !open && onClose()}
            title="Recurrencia"
            maxWidth="max-w-md"
        >
            {recurring && (
                <div className="flex flex-col gap-4">
                    <div className="flex items-center gap-3">
                        <div
                            className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border"
                            style={{
                                backgroundColor: `${recurring.categoryColor ?? "#f97316"}14`,
                                borderColor: `${recurring.categoryColor ?? "#f97316"}33`,
                                color: recurring.categoryColor ?? "#f97316",
                            }}
                        >
                            <CategoryIcon icon={recurring.categoryIcon} className="h-5 w-5" />
                        </div>
                        <div className="flex flex-col">
                            <span className="text-base font-semibold text-light">{recurring.title}</span>
                            <span className="flex items-center gap-1 text-xs text-primary">
                                <Repeat className="h-3 w-3" /> Recurrencia {recurring.active ? "activa" : "inactiva"}
                            </span>
                        </div>
                    </div>

                    <div className="flex flex-col">
                        <DetailRow
                            label="Monto"
                            value={
                                <span className={recurring.type === "INCOME" ? "text-info" : "text-danger"}>
                                    {recurring.type === "INCOME" ? "+" : "-"}
                                    {formatCurrency(Math.abs(recurring.amount), currency)}
                                </span>
                            }
                        />
                        <DetailRow label="Categoría" value={recurring.categoryName ?? "—"} />
                        <DetailRow label="Wallet" value={recurring.walletName ?? "—"} />
                        <DetailRow
                            label="Frecuencia"
                            value={`${FREQUENCY_LABELS[recurring.frequency]}${
                                recurring.intervalValue > 1 ? ` (cada ${recurring.intervalValue})` : ""
                            }`}
                        />
                        <DetailRow
                            label="Próxima ocurrencia"
                            value={format(parseISO(recurring.nextExecutionDate), "d 'de' MMMM, yyyy", {
                                locale: es,
                            })}
                        />
                    </div>
                </div>
            )}
        </CustomModal>
    );
};
