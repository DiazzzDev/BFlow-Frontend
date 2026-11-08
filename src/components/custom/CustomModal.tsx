import { useEffect } from "react";
import { createPortal } from "react-dom";
import { AnimatePresence, motion } from "framer-motion";
import { X } from "lucide-react";

interface CustomModalProps {
    isModalOpen: boolean;
    setIsModalOpen: (open: boolean) => void;
    title: string;
    children: React.ReactNode;
    maxWidth?: string;
}

export const CustomModal = ({
    isModalOpen,
    setIsModalOpen,
    title,
    children,
    maxWidth = "max-w-2xl",
}: CustomModalProps) => {
    useEffect(() => {
        if (!isModalOpen) {
            return;
        }

        const previousOverflow = document.body.style.overflow;
        document.body.style.overflow = "hidden";

        return () => {
            document.body.style.overflow = previousOverflow;
        };
    }, [isModalOpen]);

    return createPortal(
        <AnimatePresence>
            {isModalOpen && (
                <div className="fixed inset-0 z-50 flex items-end justify-center sm:items-center">
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={() => setIsModalOpen(false)}
                        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
                    />

                    <motion.div
                        initial={{ opacity: 0, y: "100%" }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: "100%" }}
                        transition={{ type: "spring", damping: 25, stiffness: 200 }}
                        className={`relative z-10 mb-0 max-h-[90vh] w-full overflow-y-auto rounded-t-3xl bg-surface font-sans text-light shadow-custom sm:mx-4 sm:mb-2 sm:mt-2 sm:rounded-2xl ${maxWidth}`}
                    >
                        <div className="mx-auto mt-3 h-1.5 w-12 rounded-full bg-light-25/20 sm:hidden" />

                        <header className="mt-3 flex items-center justify-between border-b border-light-10 px-5 pb-4 sm:mt-0 sm:px-6 sm:py-4">
                            <h2 className="pr-4 text-base font-semibold text-light">{title}</h2>
                            <button
                                type="button"
                                aria-label="Cerrar modal"
                                onClick={() => setIsModalOpen(false)}
                                className="-mr-1 cursor-pointer rounded-md p-1.5 text-helper transition-colors hover:bg-light-10 hover:text-light active:scale-95"
                            >
                                <X className="h-4 w-4" strokeWidth={2.25} />
                            </button>
                        </header>

                        <div className="p-5 pb-6 sm:p-6">{children}</div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>,
        document.body,
    );
};
