export const modulePanelClass =
    "group/panel relative flex min-w-0 flex-col border-t border-light-10 transition-[flex-grow] duration-500 ease-out first:border-t-0 lg:basis-0 lg:border-l lg:border-t-0 lg:first:border-l-0";

interface ModulePanelHeaderProps {
    number: string;
    label: string;
    tagline?: string;
    isActive: boolean;
}

export const ModulePanelHeader = ({
    number,
    label,
    tagline,
    isActive,
}: ModulePanelHeaderProps) => (
    <span
        className={`relative flex h-12 items-center gap-3 border-b border-light-10 px-5 text-sm transition-colors duration-300 ${
            isActive ? "bg-surface-hard" : "bg-surface-hard group-hover/panel:bg-surface"
        }`}
    >
        <span
            className={`shrink-0 font-mono text-xs transition-colors ${
                isActive ? "text-primary" : "text-helper group-hover/panel:text-label"
            }`}
        >
            {number}
        </span>
        <span className="min-w-0 flex-1 overflow-hidden whitespace-nowrap [mask-image:linear-gradient(to_right,black_calc(100%-2.5rem),transparent)]">
            <span
                className={`font-semibold transition-colors ${
                    isActive ? "text-light" : "text-label group-hover/panel:text-light"
                }`}
            >
                {label}
            </span>
            {isActive && tagline ? (
                <span className="text-helper"> {tagline}</span>
            ) : null}
        </span>

        {isActive ? (
            <span className="absolute -bottom-px left-5 right-12 h-px bg-primary" />
        ) : (
            <span className="absolute -bottom-px left-5 right-12 h-px origin-left scale-x-0 bg-light-25 transition-transform duration-300 group-hover/panel:scale-x-100" />
        )}
    </span>
);
