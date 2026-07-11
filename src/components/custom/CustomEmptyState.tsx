import { motion } from "framer-motion";
import { LucideIcon } from 'lucide-react';

import { Button } from "../controls/Button";



interface CustomEmptyStateProps {
    title: string,
    description: string,
    Icon?: LucideIcon,
    buttonText?: string,
    onButtonClick?: () => void,
    secondaryButtonText?: string,
    onSecondaryButtonClick?: () => void,
    steps?: [string],
    className?: string
}

export const CustomEmptyState = ({
    title,
    description,
    Icon,
    buttonText,
    onButtonClick,
    secondaryButtonText,
    onSecondaryButtonClick,
    steps,
    className
}: CustomEmptyStateProps) => {
    return (
        <motion.div
            className={`flex flex-col items-center justify-center text-center p-8 border border-dashed border-dark-25 rounded-2xl gap-2 w-full my-4 h-full flex-1 ${className || ''}`}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, ease: "easeOut" }}
        >
            {/* Icono */}
            {Icon && (
                <div className="relative flex items-center justify-center w-28 h-28">
                    <motion.div
                        className="absolute inset-0 rounded-full border border-primary/20"
                        animate={{ scale: [0.9, 1.05, 0.9], opacity: [0.5, 0.15, 0.5] }}
                        transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                    />
                    <motion.div
                        className="absolute inset-4 rounded-full border border-primary/15"
                        animate={{ scale: [0.9, 1.05, 0.9], opacity: [0.5, 0.15, 0.5] }}
                        transition={{ duration: 3, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
                    />
                    <motion.div
                        className="relative z-10 bg-primary/8 rounded-full p-5 text-primary"
                        animate={{ y: [0, -8, 0] }}
                        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                    >
                        <Icon size={36} strokeWidth={1.5} />
                    </motion.div>
                </div>
            )}

            {/* Steps opcionales */}
            {steps && (
                <motion.div
                    className="flex items-center gap-2 text-xs text-dark-50"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.2, duration: 0.4 }}
                >
                    {steps.map((step, i) => (
                        <div key={i} className="flex items-center gap-2">
                            <motion.span
                                className="flex items-center gap-1.5 bg-dark-5 border border-dark-10 rounded-full px-3 py-1"
                                initial={{ opacity: 0, y: 6 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.3 + i * 0.1, duration: 0.3 }}
                            >
                                {step}
                            </motion.span>
                            {i < steps.length - 1 && <span className="text-dark-25">›</span>}
                        </div>
                    ))}
                </motion.div>
            )}

            {/* Textos */}
            <motion.div
                className="flex flex-col gap-1 max-w-sm"
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.25, duration: 0.35 }}
            >
                <h3 className="text-dark font-semibold text-lg">{title}</h3>
                {description && <p className="text-dark-75 text-sm">{description}</p>}
            </motion.div>

            {/* Botones */}
            {(buttonText || secondaryButtonText) && (
                <motion.div
                    className="flex items-center gap-3 mt-2"
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.35, duration: 0.35 }}
                >
                    {buttonText && onButtonClick && (
                        <Button
                            text={buttonText}
                            onClick={() => void onButtonClick()}
                            className="px-6 py-2.5 text-sm"
                        />
                    )}
                    {secondaryButtonText && (
                        <button
                            onClick={onSecondaryButtonClick}
                            className="text-sm text-primary border border-primary/30 rounded-lg px-4 py-2.5 hover:bg-primary/5 transition-colors"
                        >
                            {secondaryButtonText}
                        </button>
                    )}
                </motion.div>
            )}
        </motion.div>
    );
};