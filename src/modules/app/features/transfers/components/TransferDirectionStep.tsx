import { ArrowLeft, ArrowRight } from "lucide-react";

import type { TransferDirection } from "../interfaces/Transfer";

interface TransferDirectionStepProps {
    onSelect: (direction: TransferDirection) => void;
}

const directionOptions: Array<{
    direction: TransferDirection;
    title: string;
    description: string;
    Icon: typeof ArrowRight;
}> = [
    {
        direction: "outgoing",
        title: "Transferir a otra billetera",
        description: "Sale dinero de esta billetera hacia otra.",
        Icon: ArrowRight,
    },
    {
        direction: "incoming",
        title: "Recibir de otra billetera",
        description: "Entra dinero a esta billetera desde otra.",
        Icon: ArrowLeft,
    },
];

export const TransferDirectionStep = ({ onSelect }: TransferDirectionStepProps) => {
    return (
        <div className="flex flex-col gap-3">
            <p className="mb-1 text-sm text-helper">
                ¿Cómo quieres mover el dinero?
            </p>

            {directionOptions.map(({ direction, title, description, Icon }) => (
                <button
                    key={direction}
                    type="button"
                    onClick={() => onSelect(direction)}
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
    );
};
