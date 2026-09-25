import { useState } from "react";

type Illustration = "register" | "wallet" | "dashboard";

interface StepPreviewProps {
    src: string;
    alt: string;
    label: string;
    active: boolean;
    illustration: Illustration;
}

const RegisterMockup = () => (
    <div className="flex h-full w-full items-center justify-center p-8">
        <div className="w-full max-w-[260px] rounded-xl border border-light-10 bg-surface p-6">
            <div className="mb-5 h-8 w-8 rounded-lg bg-primary/20" />
            <div className="mb-2 h-2.5 w-24 rounded-full bg-light-10" />
            <div className="mb-6 h-2 w-36 rounded-full bg-light-10/60" />
            <div className="mb-3 h-10 rounded-lg border border-light-10" />
            <div className="mb-5 h-10 rounded-lg border border-light-10" />
            <div className="h-10 rounded-lg bg-primary" />
        </div>
    </div>
);

const WalletMockup = () => (
    <div className="flex h-full w-full flex-col items-center justify-center gap-3 p-8">
        <div className="w-full max-w-[260px] rounded-xl bg-primary p-5">
            <div className="mb-8 h-2 w-16 rounded-full bg-light/40" />
            <div className="h-2.5 w-32 rounded-full bg-light/80" />
        </div>
        <div className="flex w-full max-w-[260px] items-center justify-between rounded-lg border border-light-10 bg-surface px-4 py-3">
            <div className="h-2 w-20 rounded-full bg-light-10" />
            <div className="h-2 w-10 rounded-full bg-light-10" />
        </div>
        <div className="flex w-full max-w-[260px] items-center justify-center rounded-lg border border-dashed border-light-25 px-4 py-3 text-xs text-helper">
            + Agregar billetera
        </div>
    </div>
);

const DashboardMockup = () => (
    <div className="flex h-full w-full flex-col justify-center gap-3 p-8">
        <div className="mx-auto grid w-full max-w-[280px] grid-cols-2 gap-3">
            <div className="rounded-lg border border-light-10 bg-surface p-4">
                <div className="mb-2 h-2 w-14 rounded-full bg-light-10" />
                <div className="h-4 w-20 rounded-full bg-primary/30" />
            </div>
            <div className="rounded-lg border border-light-10 bg-surface p-4">
                <div className="mb-2 h-2 w-14 rounded-full bg-light-10" />
                <div className="h-4 w-20 rounded-full bg-light-10" />
            </div>
        </div>
        <div className="mx-auto flex h-24 w-full max-w-[280px] items-end gap-2 rounded-lg border border-light-10 bg-surface p-4">
            {[40, 65, 30, 80, 55, 90, 45].map((h, i) => (
                <div
                    key={i}
                    className="flex-1 rounded-t-sm bg-primary/70"
                    style={{ height: `${h}%` }}
                />
            ))}
        </div>
    </div>
);

const MOCKUPS: Record<Illustration, () => React.JSX.Element> = {
    register: RegisterMockup,
    wallet: WalletMockup,
    dashboard: DashboardMockup,
};

export const StepPreview = ({
    src,
    alt,
    label,
    active,
    illustration,
}: StepPreviewProps) => {
    const [failed, setFailed] = useState(false);
    const Mockup = MOCKUPS[illustration];

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
                <div className="flex h-full w-full flex-col overflow-hidden rounded-2xl border border-light-10 bg-surface">
                    <div className="flex items-center gap-1.5 border-b border-light-10 px-4 py-3">
                        <span className="h-2 w-2 rounded-full bg-light-10" />
                        <span className="h-2 w-2 rounded-full bg-light-10" />
                        <span className="h-2 w-2 rounded-full bg-light-10" />
                        <span className="ml-2 text-xs text-helper">{label}</span>
                    </div>
                    <div className="flex-1">
                        <Mockup />
                    </div>
                </div>
            )}
        </div>
    );
};