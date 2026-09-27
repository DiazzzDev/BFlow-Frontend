import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

interface StepPreviewProps {
    src: string;
    alt: string;
    label: string;
    active: boolean;
}

export const StepPreview = ({ src, alt, label, active }: StepPreviewProps) => {
    const [imageState, setImageState] = useState<{
        src: string;
        status: "loaded" | "failed";
    } | null>(null);
    const { t } = useTranslation();

    // Preload the image so the fallback does not depend on events from a non-interactive element.
    useEffect(() => {
        let cancelled = false;
        const image = new Image();

        image.onload = () => {
            if (!cancelled) {
                setImageState({ src, status: "loaded" });
            }
        };
        image.onerror = () => {
            if (!cancelled) {
                setImageState({ src, status: "failed" });
            }
        };
        image.src = src;

        return () => {
            cancelled = true;
        };
    }, [src]);

    const currentImageState = imageState?.src === src ? imageState.status : "loading";

    return (
        <div
            className={`absolute inset-3 md:inset-4 transition-all duration-500 ease-out ${
                active
                    ? "opacity-100 translate-y-0 scale-100 z-10"
                    : "opacity-0 translate-y-3 scale-[0.98] pointer-events-none z-0"
            }`}
        >
            {currentImageState === "loaded" ? (
                <img
                    src={src}
                    alt={alt}
                    className="h-full w-full rounded-2xl object-cover object-top border border-light-10 bg-surface"
                />
            ) : currentImageState === "loading" ? (
                <div
                    aria-hidden="true"
                    className="h-full w-full animate-pulse rounded-2xl border border-light-10 bg-surface"
                />
            ) : (
                <div className="flex h-full w-full flex-col items-center justify-center gap-2 rounded-2xl border border-dashed border-light-25 bg-surface px-6 text-center">
                    <p className="text-sm font-medium text-helper">{label}</p>
                    <p className="text-xs text-label">{t("home.stepImageFallback", { path: src })}</p>
                </div>
            )}
        </div>
    );
};
