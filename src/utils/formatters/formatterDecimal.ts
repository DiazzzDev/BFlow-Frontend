/**
 * Sanitiza y valida una cadena para permitir solo números con hasta 2 decimales y un máximo de caracteres.
 * 
 * @param value Valor actual del input.
 * @param maxLength Límite máximo de caracteres (por defecto 10).
 * @returns El string formateado/válido, o el estado actual si la entrada no cumple las reglas.
 */
export const formatDecimal = (value: string, maxLength = 10): string | null => {
    // 1. Convertir comas a puntos para teclados en español
    const sanitized = value.replace(",", ".");

    // 2. Si se vacía el campo, retornamos string vacío
    if (sanitized === "") {
        return "";
    }

    // 3. Expresión regular: Cero o más dígitos, seguido opcionalmente de un punto y hasta 2 decimales
    const isValidFormat = /^\d*(\.\d{0,2})?$/.test(sanitized);

    // 4. Si cumple el formato y la longitud, retornamos el nuevo valor; si no, retornamos null
    if (isValidFormat && sanitized.length <= maxLength) {
        return sanitized;
    }

    return null;
};