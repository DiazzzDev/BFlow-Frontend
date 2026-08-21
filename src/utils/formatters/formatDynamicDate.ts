import {
    differenceInCalendarDays,
    differenceInDays,
    format,
    formatDistanceToNow,
    isToday,
    isTomorrow,
    isYesterday,
    parseISO,
    startOfDay,
} from "date-fns";
import { es } from "date-fns/locale/es";

const DATE_ONLY_PATTERN = /^\d{4}-\d{2}-\d{2}$/;

/**
 * Formatea una fecha de manera inteligente:
 * - Fechas sin hora (`YYYY-MM-DD`): compara por día calendario
 *   ("Hoy", "Mañana", "en 6 días", "hace 3 días")
 * - Fechas con hora: distancia relativa con precisión temporal
 * - Más de 30 días: "10 de junio de 2024"
 */
export const formatterDynamicDate = (dateString?: string | null): string => {
    if (!dateString) {
        return "";
    }

    try {
        const date = parseISO(dateString);

        if (isNaN(date.getTime())) {
            console.warn(`Fecha inválida provista: ${dateString}`);
            return "";
        }

        const now = new Date();

        if (DATE_ONLY_PATTERN.test(dateString.trim())) {
            const targetDay = startOfDay(date);
            const today = startOfDay(now);
            const dayDiff = differenceInCalendarDays(targetDay, today);

            if (isToday(targetDay)) {
                return "Hoy";
            }
            if (isTomorrow(targetDay)) {
                return "Mañana";
            }
            if (isYesterday(targetDay)) {
                return "Ayer";
            }

            if (Math.abs(dayDiff) >= 30) {
                return format(date, "d 'de' MMMM 'de' yyyy", { locale: es });
            }

            return formatDistanceToNow(targetDay, {
                addSuffix: true,
                locale: es,
            });
        }

        const daysDifference = differenceInDays(now, date);

        if (daysDifference >= 30) {
            return format(date, "d 'de' MMMM 'de' yyyy", { locale: es });
        }

        return formatDistanceToNow(date, {
            addSuffix: true,
            locale: es,
        });
    } catch (error: unknown) {
        console.error("Error al formatear la fecha:", error);
        return "";
    }
};
