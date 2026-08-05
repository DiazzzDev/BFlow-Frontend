interface FaqItemProps {
    question: string;
    answer: string;
    open: boolean;
    onToggle: () => void;
}

export const FaqItem = ({ question, answer, open, onToggle }: FaqItemProps) => {
    return (
        <div
            className={`bg-surface border rounded-2xl overflow-hidden transition-colors duration-300 ${
                open ? "border-light-25" : "border-light-10"
            }`}
        >
            <button
                type="button"
                onClick={onToggle}
                aria-expanded={open}
                className="w-full flex items-center justify-between gap-4 px-7 py-6 text-left cursor-pointer"
            >
                <span className="text-base md:text-lg font-medium text-light">{question}</span>
                <svg
                    width="18"
                    height="18"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className={`shrink-0 text-helper transition-transform duration-300 ease-out ${
                        open ? "rotate-180" : "rotate-0"
                    }`}
                >
                    <path d="m6 9 6 6 6-6" />
                </svg>
            </button>

            <div
                className={`grid transition-[grid-template-rows,opacity] duration-300 ease-out ${
                    open ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
                }`}
            >
                <div className="overflow-hidden">
                    <p className="px-7 pb-6 text-sm text-helper leading-relaxed">{answer}</p>
                </div>
            </div>
        </div>
    );
};
