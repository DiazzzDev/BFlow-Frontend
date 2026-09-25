interface StepCardProps {
    number: string;
    title: string;
    desc: string;
    active?: boolean;
    progress?: number;
    onSelect: () => void;
}

export const StepCard = ({
    number,
    title,
    desc,
    active = false,
    progress = 0,
    onSelect,
}: StepCardProps) => {
    return (
        <button
            type="button"
            onClick={onSelect}
            className={`relative w-full overflow-hidden text-left rounded-2xl border px-5 py-5 transition-all cursor-pointer ${
                active
                    ? "bg-surface border-primary-25"
                    : "bg-surface border-light-10 hover:border-light-25"
            }`}
        >
            <div
                className={`mb-3 inline-flex h-8 w-8 items-center justify-center rounded-lg text-xs font-bold ${
                    active
                        ? "bg-primary text-light"
                        : "bg-primary-15 text-primary"
                }`}
            >
                {number}
            </div>
            <h3 className="text-base font-semibold text-light mb-1.5">{title}</h3>
            <p className="text-sm text-helper leading-relaxed">{desc}</p>

            {active && (
                <span className="pointer-events-none absolute top-1/2 -right-4 hidden h-px w-4 bg-light-25 lg:block" />
            )}

            {active && (
                <div className="absolute inset-x-0 bottom-0 h-[3px] bg-light-10">
                    <div
                        className="h-full bg-primary"
                        style={{ width: `${progress}%` }}
                    />
                </div>
            )}
        </button>
    );
};