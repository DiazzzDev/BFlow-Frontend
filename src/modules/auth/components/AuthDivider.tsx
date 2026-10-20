interface AuthDividerProps {
    text: string;
}

export const AuthDivider = ({ text }: AuthDividerProps) => {
    return (
        <div className="my-6 flex items-center gap-3">
            <span className="h-px flex-1 bg-light-10" />
            <span className="text-[11px] font-medium uppercase tracking-widest text-helper">{text}</span>
            <span className="h-px flex-1 bg-light-10" />
        </div>
    );
};
