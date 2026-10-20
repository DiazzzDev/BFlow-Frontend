import { formatCurrency } from "@/utils/formatters/formatCurrency";

interface AmountDisplayProps {
    amount: number;
    currency: string;
    className?: string;
}

// Split whole vs cents so decimals render muted
export const AmountDisplay = ({ amount, currency, className = "" }: AmountDisplayProps) => {
    const formatted = formatCurrency(amount, currency);
    const decimalIndex = formatted.lastIndexOf(".");
    const amountClassName = `mt-1.5 text-3xl font-semibold tracking-tight text-light ${className}`;

    if (decimalIndex === -1) {
        return <p className={amountClassName}>{formatted}</p>;
    }

    const whole = formatted.slice(0, decimalIndex);
    const cents = formatted.slice(decimalIndex);

    return (
        <p className={amountClassName}>
            {whole}
            <span className="font-medium text-light-75">{cents}</span>
        </p>
    );
};
