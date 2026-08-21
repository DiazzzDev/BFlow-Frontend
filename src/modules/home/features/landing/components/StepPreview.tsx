/* eslint-disable */

import { useState } from "react";

interface StepPreviewProps {
    src: string;
    alt: string;
    label: string;
    active: boolean;
}

export const StepPreview = ({ src, alt, label, active }: StepPreviewProps) => {
    const [failed, setFailed] = useState(false);

    return (
        <div
            className={`absolute inset-3 md:inset-4 transition-all duration-500 ease-out ${
                active
                    ? "opacity-100 translate-y-0 scale-100 z-10"
                    : "opacity-0 translate-y-3 scale-[0.98] pointer-events-none z-0"
            }`}
        >
            {!failed ? (
                <img
                    src={src}
                    alt={alt}
                    onError={() => setFailed(true)}
                    className="h-full w-full rounded-2xl object-cover object-top border border-light-10 bg-surface"
                />
            ) : (
                <div className="flex h-full w-full flex-col items-center justify-center gap-2 rounded-2xl border border-dashed border-light-25 bg-surface px-6 text-center">
                    <p className="text-sm font-medium text-helper">{label}</p>
                    <p className="text-xs text-label">Pega la imagen en {src}</p>
                </div>
            )}
        </div>
    );
};
