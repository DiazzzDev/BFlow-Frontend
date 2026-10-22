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
    <>
        <section
            aria-live="polite"
            className="mb-5 flex flex-col gap-4 rounded-xl border border-light-10 bg-surface p-5 sm:flex-row sm:items-center sm:px-6"
        >
            <AlertCircle className="h-6 w-6 shrink-0 text-warning" aria-hidden="true" />
            <h1 className="text-xl font-semibold tracking-tight sm:text-2xl">{title}</h1>
        </section>

        <section className="rounded-xl border border-light-10 bg-surface p-5 sm:p-8">
            <header>
                <h2 className="text-2xl font-semibold tracking-tight sm:text-3xl">
                    {actionsTitle}
                </h2>
                <p className="mt-3 text-sm leading-6 text-helper sm:text-base">
                    {description}
                </p>
            </header>

            <div aria-hidden="true" className="my-8 border-t border-light-10" />

            <footer className="flex flex-col-reverse justify-end gap-3 sm:flex-row">
                <Button
                    text={backLabel}
                    variant="outline"
                    onClick={onBackToPlans}
                />
                <Button
                    text={retryLabel}
                    onClick={onRetry}
                />
            </footer>
        </section>
    </>
);