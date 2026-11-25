import { Button } from "@/components/controls/Button";
import { AlertCircle } from "lucide-react";

interface PlanLoadErrorProps {
    title: string;
    actionsTitle: string;
    description: string;
    retryLabel: string;
    backLabel: string;
    onRetry: () => void;
    onBackToPlans: () => void;
}

export const PlanLoadError = ({
    title,
    actionsTitle,
    description,
    retryLabel,
    backLabel,
    onRetry,
    onBackToPlans,
}: PlanLoadErrorProps) => (
    <section
        aria-live="polite"
        className="mx-auto max-w-3xl rounded-3xl border border-light-10 bg-surface p-6 shadow-[0_24px_70px_rgba(0,0,0,0.16)] sm:p-10"
    >
        <header className="flex items-start gap-4">
            <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-warning/10">
                <AlertCircle className="h-5 w-5 text-warning" aria-hidden="true" />
            </span>
            <div>
                <h1 className="text-2xl font-semibold tracking-tight sm:text-3xl">{title}</h1>
                <p className="mt-3 text-sm leading-6 text-helper sm:text-base">
                    {description}
                </p>
            </div>
        </header>

        <div aria-hidden="true" className="my-8 border-t border-light-10" />

        <footer className="flex flex-col-reverse justify-between gap-5 sm:flex-row sm:items-center">
            <h2 className="text-base font-semibold text-light">{actionsTitle}</h2>
            <div className="flex flex-col-reverse gap-3 sm:flex-row">
                <Button
                    text={backLabel}
                    variant="outline"
                    onClick={onBackToPlans}
                />
                <Button
                    text={retryLabel}
                    onClick={onRetry}
                />
            </div>
        </footer>
    </section>
);
