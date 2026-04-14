
export const SummaryCard = ({ title, quantity, subtitle }) => {
    return (
        <div className="bg-[var(--bg-card)] rounded-lg shadow-md p-5 w-full md:w-1/3">
            <h2 className="text-lg font-medium text-[var(--text-label)]">{title}</h2>
            <p className="text-2xl font-semibold text-[var(--text-primary)]">{quantity}</p>
            <p className="text-sm text-[var(--text-muted)]">{subtitle}</p>
        </div>
    );
}