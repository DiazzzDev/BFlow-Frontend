interface SummaryCardProps {
    title: string;
    quantity: string;
    subtitle: string;
}

export const SummaryCard = ({ title, quantity, subtitle }: SummaryCardProps) => {
    return (
        <div className="bg-surface rounded-lg shadow-md p-5 w-full md:w-1/3">
            <h2 className="text-lg font-medium text-text-label">{title}</h2>
            <p className="text-2xl font-semibold text-text-primary">{quantity}</p>
            <p className="text-sm text-text-muted">{subtitle}</p>
        </div>
    );
}
