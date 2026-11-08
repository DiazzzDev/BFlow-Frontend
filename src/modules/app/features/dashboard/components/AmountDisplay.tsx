import { RolldownNumber } from "@/components/RolldownNumber";
import { formatCurrency } from "@/utils/formatters/formatCurrency";

interface AmountDisplayProps {
    amount: number;
    currency: string;
    className?: string;
    decimalClassName?: string;
    duration?: number;
}

// Split whole vs cents so decimals render muted
export const AmountDisplay = ({
    amount,
    currency,
    className = "text-light",
    decimalClassName = "text-light-75",
    duration = 1,
}: AmountDisplayProps) => {
    const formatted = formatCurrency(amount, currency);
    const decimalIndex = formatted.lastIndexOf(".");
    const amountClassName = `mt-1.5 text-3xl font-semibold tracking-tight ${className}`;
    const formatWhole = (value: number) => {
        const formattedValue = formatCurrency(value, currency);
        const valueDecimalIndex = formattedValue.lastIndexOf(".");

        return valueDecimalIndex === -1 ? formattedValue : formattedValue.slice(0, valueDecimalIndex);
    };

    if (decimalIndex === -1) {
        return (
            <p className={amountClassName}>
                <RolldownNumber value={amount} formatValue={formatWhole} duration={duration} />
            </p>
        );
    }

    const cents = formatted.slice(decimalIndex);
    const decimalSeparator = cents.charAt(0);
    const decimalDigits = cents.slice(1);
    const decimalValue = Number(decimalDigits);
    const formatDecimals = (value: number) =>
        `${decimalSeparator}${Math.round(value).toString().padStart(decimalDigits.length, "0")}`;

    return (
        <p className={amountClassName}>
            <RolldownNumber value={amount} formatValue={formatWhole} duration={duration} />
            <RolldownNumber
                value={decimalValue}
                formatValue={formatDecimals}
                duration={duration}
                className={`font-medium ${decimalClassName}`}
            />
        </p>
    );
};
