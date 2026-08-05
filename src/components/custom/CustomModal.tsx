import { motion, AnimatePresence } from "framer-motion";
import React from 'react';

interface CustomModalProps {
    isModalOpen: boolean,
    setIsModalOpen: (param: boolean) => void,
    title: string,
    children: React.ReactNode, 
    maxWidth?: string,
    variant?: "bottom-sheet" | "center"
}

export const CustomModal = ({
    isModalOpen,
    setIsModalOpen,
    title,
    children,
    maxWidth = "max-w-2xl",
    variant = "bottom-sheet"
}: CustomModalProps) => {

    // Configuración de animaciones dinámicas según la variante elegida
    const isBottomSheet = variant === "bottom-sheet";

    const modalVariants = {
        initial: isBottomSheet
            ? { opacity: 0, y: "100%", scale: 1 } // Emerge desde abajo en móviles
            : { opacity: 0, scale: 0.95, y: 20 },  // Centrado clásico
        animate: {
            opacity: 1,
            y: 0,
            scale: 1
        },
        exit: isBottomSheet
            ? { opacity: 0, y: "100%", scale: 1 } // Se desliza hacia abajo al cerrar
            : { opacity: 0, scale: 0.95, y: 20 }
    };

    return (
        <AnimatePresence>
            {isModalOpen && (
                // Cambiado: Justify-end en móvil para pegarlo abajo, justify-center en pantallas grandes si aplica
                <div className={`fixed inset-0 z-50 flex ${isBottomSheet ? "items-end sm:items-center" : "items-center"} justify-center`}>

                    {/* Fondo Oscurecido (Backdrop) */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={() => setIsModalOpen(false)}
                        className="absolute inset-0 bg-dark-25/40 backdrop-blur-sm"
                    />

                    {/* Contenedor del Modal / Bottom Sheet */}
                    <motion.div
                        initial="initial"
                        animate="animate"
                        exit="exit"
                        variants={modalVariants}
                        transition={{ type: "spring", damping: 25, stiffness: 200 }}
                        // Cambiado: Clases responsivas para redondear solo esquinas superiores en móvil si es bottom-sheet
                        className={`bg-surface w-full relative z-10 font-sans text-light shadow-custom overflow-hidden
                            ${isBottomSheet
                                ? "rounded-t-3xl sm:rounded-2xl p-6 sm:p-10 max-h-[90vh] overflow-y-auto mb-0 sm:mb-2 sm:mt-2 sm:mx-4"
                                : "rounded-2xl p-10 mb-2 mt-2 mx-4"
                            } ${maxWidth}`}
                    >
                        {/* Indicador de arrastre visual (La pequeña barra superior típica de las Bottom Sheets) */}
                        {isBottomSheet && (
                            <div className="w-12 h-1.5 bg-light-25/20 rounded-full mx-auto mb-5 sm:hidden" />
                        )}

                        {/* Botón Cerrar (X) */}
                        <button
                            onClick={() => setIsModalOpen(false)}
                            className="absolute cursor-pointer right-6 top-6 sm:right-8 sm:top-8 text-helper hover:text-light transition-colors p-1 rounded-lg hover:bg-light-10 active:scale-95"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-6 h-6">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>

                        {/* Título */}
                        <h2 className="text-xl font-medium text-light mb-6 sm:mb-8 pr-8">{title}</h2>

                        {/* Cuerpo de filtros / contenido inyectado */}
                        <div className="pb-5 sm:pb-0">
                            {children}
                        </div>

                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
};