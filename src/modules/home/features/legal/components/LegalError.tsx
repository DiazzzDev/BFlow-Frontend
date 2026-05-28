import { AlertCircle, RefreshCw } from "lucide-react";

interface LegalErrorProps {
    onRetry: () => void;
}

export const LegalError = ({ onRetry }: LegalErrorProps) => {
    return (
        <div className="flex flex-col items-center justify-center py-24 text-center gap-4">
            <div className="w-12 h-12 rounded-full bg-(--error)/10 flex items-center justify-center">
                <AlertCircle className="w-6 h-6 text-(--error)" />
            </div>

            <div>
                <p className="text-base font-semibold text-(--text-foreground) mb-1">
                    No se pudo cargar el documento
                </p>

                <p className="text-sm text-(--text-muted) max-w-xs">
                    Hubo un problema al obtener el contenido. Revisá tu conexión e intentá de nuevo.
                </p>
            </div>

            <button
                onClick={onRetry}
                className="flex items-center gap-2 text-sm font-medium bg-(--card) border border-border px-4 py-2 rounded-lg hover:border-white/20 transition-colors cursor-pointer"
            >
                <RefreshCw className="w-4 h-4" />
                Reintentar
            </button>
        </div>
    );
}; 
