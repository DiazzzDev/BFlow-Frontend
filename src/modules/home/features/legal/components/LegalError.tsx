import { AlertCircle, RefreshCw } from "lucide-react";

interface LegalErrorProps {
    onRetry: () => void;
}

export const LegalError = ({ onRetry }: LegalErrorProps) => {
    return (
        <div className="flex flex-col items-center justify-center py-24 text-center gap-4">
            <div className="w-12 h-12 rounded-full bg-danger-sweet flex items-center justify-center">
                <AlertCircle className="w-6 h-6 text-danger" />
            </div>

            <div>
                <p className="text-base font-semibold text-light mb-1">
                    No se pudo cargar el documento
                </p>

                <p className="text-sm text-helper max-w-xs">
                    Hubo un problema al obtener el contenido. Revisá tu conexión e intentá de nuevo.
                </p>
            </div>

            <button
                onClick={onRetry}
                className="flex items-center gap-2 text-sm font-medium bg-surface border border-light-10 px-4 py-2 rounded-lg hover:border-light-25 transition-colors cursor-pointer"
            >
                <RefreshCw className="w-4 h-4" />
                Reintentar
            </button>
        </div>
    );
}; 
