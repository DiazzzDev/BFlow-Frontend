const LINE_COUNT = 9;
const LINE_GAP = 26;
const FIRST_LINE_Y = 290;

const LINES = Array.from({ length: LINE_COUNT }, (_, index) => {
    const y = FIRST_LINE_Y + index * LINE_GAP;
    return `M0 ${y} C 360 ${y - 70}, 1080 ${y + 70}, 1440 ${y}`;
});

export const AuthBackground = () => {
    return (
        <div aria-hidden="true" className="pointer-events-none absolute inset-0 overflow-hidden">
            <svg
                className="absolute inset-0 h-full w-full"
                viewBox="0 0 1440 900"
                preserveAspectRatio="none"
                fill="none"
            >
                {LINES.map((path, index) => (
                    <path
                        key={path}
                        d={path}
                        strokeWidth="1"
                        strokeDasharray="3 7"
                        className={index === Math.floor(LINE_COUNT / 2) ? "stroke-primary/25" : "stroke-light-10"}
                    />
                ))}
            </svg>

            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_0%,var(--color-surface-hard)_75%)]" />
        </div>
    );
};
