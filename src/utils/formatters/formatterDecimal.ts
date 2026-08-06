/**
 * Sanitiza un input numérico: hasta `maxDigits` dígitos en total,
 * de los cuales como máximo 2 pueden ir después del punto decimal.
 *
 * @returns El string válido, o `null` si la entrada no cumple las reglas.
 */
export const formatterDecimal = (value: string, maxDigits = 10): string | null => {
    const sanitized = value.replace(",", ".");

    if (sanitized === "") {
        return "";
    }

    const isValidFormat = /^\d*(\.\d{0,2})?$/.test(sanitized);
    if (!isValidFormat) {
        return null;
    }

    const digitsOnly = sanitized.replace(".", "");
    if (digitsOnly.length > maxDigits) {
        return null;
    }

    return sanitized;
};
