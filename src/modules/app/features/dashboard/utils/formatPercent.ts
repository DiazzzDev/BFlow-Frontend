/** API already returns percent units (e.g. 5.8 → 5.8%). */
export const formatPercentValue = (value: number) => {
    if (Number.isInteger(value)) {
        return String(value);
    }

    return String(Math.round(value * 10) / 10);
};
