import { format, formatDistanceToNow, parseISO, differenceInDays } from 'date-fns';
import { es } from 'date-fns/locale/es';

/**
 * Formatea una fecha de manera inteligente:
 * - Menos de 30 días: "hace 2 horas", "hace 5 días", etc.
 * - Más de 30 días: "10 de junio de 2024"
 */
export const formatterDynamicDate = (dateString?: string | null): string => {
    if (!dateString) { return '' };

    try {
        const date = parseISO(dateString);

        // Validación por si el string recibido no es un ISO válido
        if (isNaN(date.getTime())) {
            console.warn(`Fecha inválida provista: ${dateString}`);
            return '';
        }

        const now: Date = new Date();
        const daysDifference: number = differenceInDays(now, date);

        if (daysDifference >= 30) {
            return format(date, "d 'de' MMMM 'de' yyyy", { locale: es });
        }

        return formatDistanceToNow(date, {
            addSuffix: true,
            locale: es,
        });
    } catch (error: unknown) {
        console.error("Error al formatear la fecha:", error);
        return '';
    }
}