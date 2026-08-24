import { RecurringForm } from "./RecurringForm";

import { CustomModal } from "@/components/custom/CustomModal";

interface ScheduleTransactionModalProps {
    isModalOpen: boolean;
    setIsModalOpen: (open: boolean) => void;
    walletId: string;
}

export const ScheduleTransactionModal = ({
    isModalOpen,
    setIsModalOpen,
    walletId,
}: ScheduleTransactionModalProps) => {
    return (
        <CustomModal
            isModalOpen={isModalOpen}
            setIsModalOpen={setIsModalOpen}
            title="Programar transacción"
            maxWidth="max-w-lg"
        >
            {walletId ? (
                <RecurringForm
                    walletId={walletId}
                    onSuccess={() => setIsModalOpen(false)}
                />
            ) : null}
        </CustomModal>
    );
};
