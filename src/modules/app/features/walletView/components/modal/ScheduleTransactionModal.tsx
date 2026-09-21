import { RecurringForm } from "../RecurringForm";
import { useTranslation } from "react-i18next";

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
    const { t } = useTranslation();
    return (
        <CustomModal
            isModalOpen={isModalOpen}
            setIsModalOpen={setIsModalOpen}
            title={t("walletView.schedule")}
            maxWidth="max-w-lg"
        >
            {walletId ? (
                <RecurringForm
                    key={isModalOpen ? "open" : "closed"}
                    walletId={walletId}
                    onSuccess={() => setIsModalOpen(false)}
                />
            ) : null}
        </CustomModal>
    );
};
