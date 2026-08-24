import { useEffect } from "react";
import { createPortal } from "react-dom";
import { AnimatePresence, motion } from "framer-motion";

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
                        className={`relative z-10 mb-0 max-h-[90vh] w-full overflow-y-auto rounded-t-3xl bg-surface p-6 font-sans text-light shadow-custom sm:mx-4 sm:mb-2 sm:mt-2 sm:rounded-2xl sm:p-10 ${maxWidth}`}
                    >
                        <div className="mx-auto mb-5 h-1.5 w-12 rounded-full bg-light-25/20 sm:hidden" />

                        <button
                            type="button"
                            onClick={() => setIsModalOpen(false)}
                            className="absolute right-6 top-6 cursor-pointer rounded-lg p-1 text-helper transition-colors hover:bg-light-10 hover:text-light active:scale-95 sm:right-8 sm:top-8"
                        >
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 24 24"
                                strokeWidth={2.5}
                                stroke="currentColor"
                                className="h-6 w-6"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    d="M6 18L18 6M6 6l12 12"
                                />
                            </svg>
                        </button>

                        <h2 className="mb-6 pr-8 text-xl font-medium text-light sm:mb-8">
                            {title}
                        </h2>

                        <div className="pb-5 sm:pb-0">{children}</div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>,
        document.body,
    );
};
