import { useEffect, useState } from "react";
import { ArrowLeftRight, ArrowDownLeft, ArrowUpRight } from "lucide-react";

import type { TransactionType } from "../interfaces/Transaction";
import { ExpenseForm } from "../../expenses/components/ExpenseForm";
import { IncomeForm } from "../../incomes/components/IncomeForm";
import { TransferDirectionStep } from "../../transfers/components/TransferDirectionStep";
import { TransferForm } from "../../transfers/components/TransferForm";
import type { TransferDirection } from "../../transfers/interfaces/Transfer";

import { CustomModal } from "@/components/custom/CustomModal";

interface NewTransactionModalProps {
    isModalOpen: boolean;
    setIsModalOpen: (open: boolean) => void;
    walletId: string;
    initialType?: TransactionType | null;
}

type ModalStep = "type" | "INCOME" | "EXPENSE" | "TRANSFER_DIRECTION" | "TRANSFER_FORM";

const transactionOptions: Array<{
    type: TransactionType;
    title: string;
    description: string;
    Icon: typeof ArrowUpRight;
}> = [
        {
            type: "INCOME",
            title: "Ingreso",
            description: "Registra dinero que entra a esta billetera.",
            Icon: ArrowDownLeft,
        },
        {
            type: "EXPENSE",
            title: "Gasto",
            description: "Registra un egreso o pago desde esta billetera.",
            Icon: ArrowUpRight,
        },
        {
            type: "TRANSFER",
            title: "Transferencia",
            description: "Mueve dinero entre billeteras.",
            Icon: ArrowLeftRight,
        },
    ];

const getModalTitle = (
    step: ModalStep,
    direction: TransferDirection | null,
): string => {
    if (step === "INCOME") { return "Nuevo ingreso" };
    if (step === "EXPENSE") { return "Nuevo gasto" };
    if (step === "TRANSFER_DIRECTION") { return "Nueva transferencia" };
    if (step === "TRANSFER_FORM") {
        return direction === "incoming"
            ? "Recibir de otra billetera"
            : "Transferir a otra billetera";
    }
    return "Nueva transacción";
};

export const NewTransactionModal = ({
    isModalOpen,
    setIsModalOpen,
    walletId,
    initialType = null,
}: NewTransactionModalProps) => {
    const [step, setStep] = useState<ModalStep>("type");
    const [transferDirection, setTransferDirection] =
        useState<TransferDirection | null>(null);

    useEffect(() => {
        const f = () => {
            if (!isModalOpen) { return };

            if (initialType === "INCOME") {
                setStep("INCOME");
                return;
            }
            if (initialType === "EXPENSE") {
                setStep("EXPENSE");
                return;
            }
            if (initialType === "TRANSFER") {
                setStep("TRANSFER_DIRECTION");
                setTransferDirection(null);
                return;
            }

            setStep("type");
            setTransferDirection(null);
        }
        f();
    }, [isModalOpen, initialType]);

    const handleClose = (open: boolean) => {
        if (!open) {
            setStep("type");
            setTransferDirection(null);
        }
        setIsModalOpen(open);
    };

    const handleSelectType = (type: TransactionType) => {
        if (type === "INCOME") {
            setStep("INCOME");
            return;
        }
        if (type === "EXPENSE") {
            setStep("EXPENSE");
            return;
        }
        setStep("TRANSFER_DIRECTION");
    };

    const handleSelectDirection = (direction: TransferDirection) => {
        setTransferDirection(direction);
        setStep("TRANSFER_FORM");
    };

    const showWideModal =
        step === "INCOME" ||
        step === "EXPENSE" ||
        step === "TRANSFER_FORM";

    return (
        <CustomModal
            isModalOpen={isModalOpen}
            setIsModalOpen={handleClose}
            title={getModalTitle(step, transferDirection)}
            maxWidth={step === "TRANSFER_FORM" ? "max-w-3xl" : showWideModal ? "max-w-lg" : "max-w-md"}
            variant="center"
        >
            {step === "EXPENSE" ? (
                <ExpenseForm
                    walletId={walletId}
                    onSuccess={() => handleClose(false)}
                />
            ) : step === "INCOME" ? (
                <IncomeForm
                    walletId={walletId}
                    onSuccess={() => handleClose(false)}
                />
            ) : step === "TRANSFER_DIRECTION" ? (
                <TransferDirectionStep onSelect={handleSelectDirection} />
            ) : step === "TRANSFER_FORM" && transferDirection ? (
                <TransferForm
                    walletId={walletId}
                    direction={transferDirection}
                    onDirectionChange={setTransferDirection}
                    onSuccess={() => handleClose(false)}
                />
            ) : (
                <div className="flex flex-col gap-3">
                    <p className="mb-1 text-sm text-helper">
                        ¿Qué tipo de movimiento quieres registrar?
                    </p>

                    {transactionOptions.map(({ type, title, description, Icon }) => (
                        <button
                            key={type}
                            type="button"
                            onClick={() => handleSelectType(type)}
                            className="group flex w-full items-start gap-4 rounded-2xl border border-light-10 bg-surface-hard/40 px-4 py-4 text-left transition-all hover:border-primary-25 hover:bg-primary-15/40 cursor-pointer"
                        >
                            <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-primary-15 text-primary transition-transform group-hover:scale-105">
                                <Icon className="h-5 w-5" />
                            </span>
                            <span className="min-w-0">
                                <span className="block text-sm font-semibold text-light">
                                    {title}
                                </span>
                                <span className="mt-1 block text-sm leading-relaxed text-helper">
                                    {description}
                                </span>
                            </span>
                        </button>
                    ))}
                </div>
            )}
        </CustomModal>
    );
};
