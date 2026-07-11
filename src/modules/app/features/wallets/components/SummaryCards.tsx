interface SummaryCardProps {
    title: string;
    quantity: string;
    subtitle: string;
}

export const SummaryCard = ({ title, quantity, subtitle }: SummaryCardProps) => {
    return (
        <div className="bg-card rounded-lg shadow-md p-5 w-full md:w-1/3">
            <h2 className="text-lg font-medium text-label">{title}</h2>
            <p className="text-2xl font-semibold text-foreground">{quantity}</p>
            <p className="text-sm text-muted-foreground">{subtitle}</p>
        </div>
    );
}
